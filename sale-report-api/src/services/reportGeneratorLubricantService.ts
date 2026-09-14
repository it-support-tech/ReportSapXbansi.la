import ExcelJS from "exceljs";
import { LUBRICANT_REPORT_COLUMNS } from "../constants/lubricantReportColumns";
import { THEME } from "../config/theme";
import { LubricantMergedRow } from "../types/lubricantExcel.types";
import { REPORT_FONT, applyBodyCellStyle, applyHeaderStyle } from "./reportStyles";
import { LETTERHEAD_ROWS, applyLetterhead } from "./letterheadService";

/** Groups consecutive-by-invoice rows into per-invoice line-item blocks, preserving first-seen order. */
const groupByInvoice = (rows: LubricantMergedRow[]): LubricantMergedRow[][] => {
  const groups = new Map<string, LubricantMergedRow[]>();
  for (const row of rows) {
    const list = groups.get(row.invoiceNumber);
    if (list) list.push(row);
    else groups.set(row.invoiceNumber, [row]);
  }
  return [...groups.values()];
};

/**
 * Builds the lubricant (ນ້ຳມັນເຄື່ອງ) report workbook. Unlike the fuel report,
 * one invoice can span several rows (one per product line): invoice-level
 * columns (customer, tax id, dates, tax invoice no, invoice grand total) are
 * merged vertically across the group; product-line columns (item, packaging
 * quantities, amounts) get their own value on every row.
 */
export const generateLubricantReportWorkbook = async (
  rows: LubricantMergedRow[],
  reportTitle = "ສະຫຼຸບບິນຂາຍນໍ້າມັນເຄື່ອງ"
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "saleReport Automated Report Generator";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Report", {
    pageSetup: {
      orientation: "landscape",
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.3, right: 0.3, top: 0.5, bottom: 0.4, header: 0.2, footer: 0.2 },
    },
    views: [{ state: "frozen", xSplit: 1, ySplit: 9, showGridLines: false }],
  });

  const colCount = LUBRICANT_REPORT_COLUMNS.length;

  applyLetterhead(sheet, colCount);

  const titleRow = LETTERHEAD_ROWS + 1;
  const subtitleRow = LETTERHEAD_ROWS + 2;
  const headerRow = LETTERHEAD_ROWS + 3;
  const firstDataRow = headerRow + 1;

  sheet.mergeCells(titleRow, 1, titleRow, colCount);
  const titleCell = sheet.getCell(titleRow, 1);
  titleCell.value = reportTitle;
  titleCell.font = { name: REPORT_FONT, size: 14, bold: true, color: { argb: THEME.secondary.argb } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(titleRow).height = 26;

  sheet.mergeCells(subtitleRow, 1, subtitleRow, colCount);
  const subtitleCell = sheet.getCell(subtitleRow, 1);
  subtitleCell.value = `ວັນທີ: ${new Date().toLocaleDateString("lo-LA")}   |   ຈຳນວນລາຍການ: ${rows.length}`;
  subtitleCell.font = { name: REPORT_FONT, size: 10, italic: true, color: { argb: "FF555555" } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "center" };

  LUBRICANT_REPORT_COLUMNS.forEach((col, idx) => {
    const cell = sheet.getCell(headerRow, idx + 1);
    cell.value = col.header;
    applyHeaderStyle(cell);
    sheet.getColumn(idx + 1).width = col.width;
  });
  sheet.getRow(headerRow).height = 24;

  const groups = groupByInvoice(rows);
  let cursorRow = firstDataRow;
  let lineNo = 0;

  for (const group of groups) {
    const groupStartRow = cursorRow;
    const groupEndRow = cursorRow + group.length - 1;

    group.forEach((row, idxInGroup) => {
      const excelRowIndex = cursorRow + idxInGroup;
      lineNo++;

      LUBRICANT_REPORT_COLUMNS.forEach((col, colIdx) => {
        const colNumber = colIdx + 1;

        if (col.key === "no") {
          const cell = sheet.getCell(excelRowIndex, colNumber);
          cell.value = lineNo;
          applyBodyCellStyle(cell, col.align ?? "left", idxInGroup % 2 === 1);
          return;
        }

        if (col.groupLevel) return; // written once below, after the group's rows are merged
        const cell = sheet.getCell(excelRowIndex, colNumber);
        cell.value = col.getValue(row, idxInGroup, group);
        if (col.numFmt) cell.numFmt = col.numFmt;
        applyBodyCellStyle(cell, col.align ?? "left", idxInGroup % 2 === 1);
      });
    });

    LUBRICANT_REPORT_COLUMNS.forEach((col, colIdx) => {
      if (!col.groupLevel) return;
      const colNumber = colIdx + 1;
      if (groupEndRow > groupStartRow) sheet.mergeCells(groupStartRow, colNumber, groupEndRow, colNumber);
      const cell = sheet.getCell(groupStartRow, colNumber);
      cell.value = col.getValue(group[0], 0, group);
      if (col.numFmt) cell.numFmt = col.numFmt;
      applyBodyCellStyle(cell, col.align ?? "left", false);
    });

    cursorRow = groupEndRow + 1;
  }

  sheet.autoFilter = {
    from: { row: headerRow, column: 1 },
    to: { row: headerRow, column: colCount },
  };

  return workbook;
};
