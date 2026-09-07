import ExcelJS from "exceljs";
import { AppError } from "../utils/AppError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/statusCodes";
import { ColumnDef, normalizeHeader } from "../constants/excelMap";
import { cleanInvoiceNumber, getInvoiceReissueVersion, toNullableNumber, toNullableString } from "../utils/dataCleaning";
import { ParseResult, RawRow } from "../types/excel.types";

/** Real-world exports (SAP B1, ບັນຊີ.la) often have company/title rows before the actual header. */
const HEADER_SCAN_LIMIT = 25;

/**
 * Finds the column for one field by trying its aliases in priority order —
 * the FIRST alias (in `col.aliases`) that matches any cell in the row wins,
 * even if a later alias would also match a different column. This matters
 * because real exports can carry more than one invoice-like column (e.g.
 * both "Invoice No" and "invoice_number"); listing the canonical name first
 * in excelMap.ts is what decides which one is actually used.
 */
const findFieldColumn = (row: ExcelJS.Row, aliases: string[]): number | null => {
  for (const alias of aliases) {
    const target = normalizeHeader(alias);
    let match: number | null = null;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (match === null && normalizeHeader(cell.value) === target) {
        match = colNumber;
      }
    });
    if (match !== null) return match;
  }
  return null;
};

const matchRowToFields = (row: ExcelJS.Row, columnMap: ColumnDef[]): Map<string, number> => {
  const fieldToIndex = new Map<string, number>();
  for (const col of columnMap) {
    const colIndex = findFieldColumn(row, col.aliases);
    if (colIndex !== null) fieldToIndex.set(col.field, colIndex);
  }
  return fieldToIndex;
};

/**
 * Scans the first HEADER_SCAN_LIMIT rows for the one that contains every
 * required column (aliased), instead of assuming row 1 is the header —
 * exports commonly have company name / title rows above the real header.
 */
const findHeaderRow = (
  sheet: ExcelJS.Worksheet,
  columnMap: ColumnDef[]
): { rowNumber: number; fieldToIndex: Map<string, number> } | null => {
  const requiredFields = columnMap.filter((c) => c.required).map((c) => c.field);
  const scanLimit = Math.min(HEADER_SCAN_LIMIT, sheet.rowCount);

  for (let rowNumber = 1; rowNumber <= scanLimit; rowNumber++) {
    const fieldToIndex = matchRowToFields(sheet.getRow(rowNumber), columnMap);
    const hasAllRequired = requiredFields.every((f) => fieldToIndex.has(f));
    if (hasAllRequired) {
      return { rowNumber, fieldToIndex };
    }
  }

  return null;
};

/**
 * Grouped exports (e.g. one invoice with several item lines) commonly merge
 * the invoice-level cells — customer, date, PO — down the whole group and
 * only store the value on the top-left cell. Non-master cells in a merge
 * read back as null, which silently blanked those fields on every line but
 * the first; resolving to `.master` recovers the real value for every row.
 */
const resolveMergedCell = (cell: ExcelJS.Cell): ExcelJS.Cell => (cell.isMerged ? cell.master : cell);

const cellToRaw = (rawCell: ExcelJS.Cell): string | number | null => {
  const cell = resolveMergedCell(rawCell);
  const v = cell.value;
  if (v === null || v === undefined) return null;
  if (typeof v === "object" && "result" in (v as ExcelJS.CellFormulaValue)) {
    return (v as ExcelJS.CellFormulaValue).result as string | number | null;
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object" && "richText" in (v as ExcelJS.CellRichTextValue)) {
    return (v as ExcelJS.CellRichTextValue).richText.map((t) => t.text).join("");
  }
  return v as string | number;
};

/**
 * Reads the first worksheet of an uploaded workbook into rows keyed by our
 * internal field names, using `columnMap` for flexible header matching.
 * `numericFields` controls which resolved fields are coerced to numbers.
 */
export const parseWorkbook = async <T extends RawRow & { invoiceNumber: string }>(
  filePath: string,
  columnMap: ColumnDef[],
  numericFields: string[]
): Promise<ParseResult<T>> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];
  if (!sheet || sheet.rowCount < 2) {
    throw new AppError(ERROR_MESSAGES.EMPTY_WORKBOOK, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  const header = findHeaderRow(sheet, columnMap);
  if (!header) {
    const missingRequired = columnMap.filter((c) => c.required);
    throw new AppError(
      ERROR_MESSAGES.MISSING_INVOICE_COLUMN,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      missingRequired.map((c) => c.field)
    );
  }
  const { rowNumber: headerRowNumber, fieldToIndex } = header;
  const numericSet = new Set(numericFields);

  const rows: T[] = [];
  const warnings: string[] = [];
  let skippedRows = 0;
  const totalRowsRead = sheet.rowCount - headerRowNumber;

  for (let rowNumber = headerRowNumber + 1; rowNumber <= sheet.rowCount; rowNumber++) {
    const excelRow = sheet.getRow(rowNumber);
    if (excelRow.cellCount === 0) {
      skippedRows++;
      continue;
    }

    const record: RawRow = {};
    for (const [field, colIndex] of fieldToIndex) {
      const raw = cellToRaw(excelRow.getCell(colIndex));
      record[field] = numericSet.has(field) ? toNullableNumber(raw) : toNullableString(raw);
    }

    const rawInvoiceValue = record.invoiceNumber;
    const invoiceNumber = cleanInvoiceNumber(rawInvoiceValue);
    if (!invoiceNumber) {
      skippedRows++;
      continue;
    }

    const invoiceVersion = getInvoiceReissueVersion(rawInvoiceValue);
    rows.push({ ...record, invoiceNumber, invoiceVersion } as unknown as T);
  }

  if (skippedRows > 0) {
    warnings.push(`ຂ້າມ ${skippedRows} ແຖວ ເນື່ອງຈາກບໍ່ມີ Invoice Number`);
  }

  return { rows, warnings, totalRowsRead, skippedRows };
};
