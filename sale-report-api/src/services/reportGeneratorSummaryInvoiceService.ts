import ExcelJS from "exceljs";
import path from "path";
import { SUMMARY_INVOICE_REPORT_COLUMNS } from "../constants/summaryInvoiceReportColumns";
import { THEME } from "../config/theme";
import { SummaryInvoiceMergedRow } from "../types/summaryInvoiceExcel.types";
import { REPORT_FONT, applyBodyCellStyle, applyHeaderStyle } from "./reportStyles";

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

/**
 * Company block as printed on "summary invoice.jpeg". Distinct from
 * letterheadService.ts's COMPANY_INFO (different phone last digit, different
 * Lao name/logo on the reference image) — kept separate rather than reused,
 * since we don't yet know if that's a real difference or a template typo.
 */
const COMPANY_INFO = {
  nameLao: "ບໍລິສັດ ເອັນທີພີ ຈຳໜ່າຍນ້ຳມັນໃສ ຈຳກັດ",
  name: "	NTP TRADING PETROLEUM CO., LTD",
  addressLine1: "Donglouang Village, Naxaythong District",
  addressLine2: "Vientiane Capital, Lao P.D.R",
  tel: "Tel: 030-5888884",
  email: "E-mail: bill.n@nhotmanhkhong-group.com",
};

const NATIONAL_HEADER_LINES = [
  "ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ",
  "ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ",
];

const SIGNATURE_LABELS = [
  "Approved by\n出货方公司领导",
  "Verify by\n出货方财务主管",
  "Receiver signature\n收货方物资部签章",
  "Prepared by\n出货方制表人",
];

/** Groups rows by customer name (the only customer identifier the SAP export has), preserving first-seen order. */
const groupByCustomer = (rows: SummaryInvoiceMergedRow[]): SummaryInvoiceMergedRow[][] => {
  const groups = new Map<string, SummaryInvoiceMergedRow[]>();
  for (const row of rows) {
    const key = String(row.sap?.customerName || "UNKNOWN");
    const list = groups.get(key);
    if (list) list.push(row);
    else groups.set(key, [row]);
  }
  return [...groups.values()];
};

/** Excel sheet names must be <=31 chars and can't contain : \ / ? * [ ] — also de-duplicated across the workbook. */
const toSafeSheetName = (raw: string, usedNames: Set<string>): string => {
  const base = raw.replace(/[:\\/?*[\]]/g, " ").trim().slice(0, 28) || "Customer";
  let name = base;
  let suffix = 2;
  while (usedNames.has(name)) {
    name = `${base.slice(0, 28 - String(suffix).length - 1)}-${suffix}`;
    suffix++;
  }
  usedNames.add(name);
  return name;
};

const sum = (rows: SummaryInvoiceMergedRow[], pick: (r: SummaryInvoiceMergedRow) => number | null | undefined): number =>
  rows.reduce((total, row) => total + (pick(row) ?? 0), 0);

// "hair" is Excel's thinnest available border style (thinner than "thin").
const BORDER_THIN: ExcelJS.Border = { style: "thin", 
  color: { argb: "FFBFBFBF" } };

/**
 * Column boundary closest to the physical horizontal center of the printed
 * page (by summed column width, not raw column count) — this is where the
 * letterhead's company/meta vertical divider goes, so it visually splits the
 * page in half rather than sitting at some fraction of the column count.
 */
const findLetterheadMetaStartCol = (): number => {
  const widths = SUMMARY_INVOICE_REPORT_COLUMNS.map((c) => c.width);
  const half = widths.reduce((a, b) => a + b, 0) / 2;
  let cumulative = 0;
  let bestCol = 4;
  let bestDiff = Infinity;
  widths.forEach((w, i) => {
    cumulative += w;
    const diff = Math.abs(cumulative - half);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestCol = i + 2; // the meta block starts right after this column
    }
  });
  return Math.min(Math.max(bestCol, 4), widths.length);
};

/**
 * Builds ONE "Summary Invoice" worksheet per customer found in `rows` (see
 * "summary invoice.jpeg"): national/company letterhead + a per-customer
 * "Bill To" block, the flat shipment table, a total row, and a signature
 * footer. Unlike the flat fuel report or the per-invoice grouping of the
 * lubricant report, this report groups by CUSTOMER — each customer's
 * shipments across the whole upload become their own billing statement.
 */
export const generateSummaryInvoiceReportWorkbook = async (
  rows: SummaryInvoiceMergedRow[]
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "saleReport Automated Report Generator";
  workbook.created = new Date();

  const colCount = SUMMARY_INVOICE_REPORT_COLUMNS.length;
  const orderQtyCol = SUMMARY_INVOICE_REPORT_COLUMNS.findIndex((c) => c.key === "orderQty") + 1;
  const deliveredQtyCol = SUMMARY_INVOICE_REPORT_COLUMNS.findIndex((c) => c.key === "deliveredQty") + 1;
  const costPerUnitCol = colCount - 1;
  const amountCol = colCount;

  const usedSheetNames = new Set<string>();
  const groups = groupByCustomer(rows);
  const metaStartCol = findLetterheadMetaStartCol();
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;

  groups.forEach((group, groupIdx) => {
    const customerName = (group[0].sap?.customerName as string | null) ?? "ລູກຄ້າ";
    const customerAddress = (group[0].sap?.customerAddress as string | null) ?? "";

    const sheet = workbook.addWorksheet(toSafeSheetName(customerName, usedSheetNames), {
      pageSetup: {
        orientation: "landscape",
        paperSize: 9, // A4
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: { left: 0.2, right: 0.2, top: 0.5, bottom: 0.4, header: 0.2, footer: 0.2 },
      },
      views: [{ showGridLines: false }],
    });

    let row = 5;
    NATIONAL_HEADER_LINES.forEach((line) => {
      sheet.mergeCells(row, 1, row, colCount);
      const cell = sheet.getCell(row, 1);
      cell.value = line;
      cell.font = { name: REPORT_FONT, size: 18, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      row++;
    });
    row += 2; // blank spacer rows (pushes the name lines down to rows 9-10)

    const logoRow = row;
    // Compact, equal heights so the Lao/English name lines sit close together
    // rather than far apart, while still leaving enough combined room
    // (~53px) for most of the 100px logo — the rest overflows harmlessly
    // into the blank gap rows below, well short of the box.
    sheet.getRow(logoRow).height = 20;
    sheet.getRow(logoRow + 1).height = 20;
    const imageId = workbook.addImage({ filename: LOGO_PATH, extension: "png" });
    // Anchored one row ABOVE the name text (not logoRow - 1) so the logo's
    // ~100px height spans past both name rows on either side — the name text
    // ends up roughly centered against the logo instead of pinned to its top.
    sheet.addImage(imageId, { tl: { col: 0, row: logoRow - 3 }, ext: { width: 120, height: 120 } });

    // Unboxed top band: logo + the two company name lines (Lao, then English)
    // — the title sits centered below the boxed panel instead, see below.
    sheet.mergeCells(logoRow, 3, logoRow, colCount);
    const nameLaoCell = sheet.getCell(logoRow, 3);
    nameLaoCell.value = COMPANY_INFO.nameLao;
    nameLaoCell.font = { name: "Arial", size: 16, bold: true };
    nameLaoCell.alignment = { vertical: "middle", horizontal: "left" };

    sheet.mergeCells(logoRow + 1, 3, logoRow + 1, colCount);
    const nameEnCell = sheet.getCell(logoRow + 1, 3);
    nameEnCell.value = COMPANY_INFO.name;
    nameEnCell.font = { name: "Arial", size: 16, bold: true };
    nameEnCell.alignment = { vertical: "middle", horizontal: "left" };

    // Boxed panel below the top band: company legal name/address/tel/email
    // (left) vs this document's own Invoice/Date + the customer's Bill
    // To/Address (right) — left 2-3 blank rows of breathing room above the box.
    const NAME_TO_BOX_GAP_ROWS = 3;
    const boxTopRow = logoRow + 2 + NAME_TO_BOX_GAP_ROWS;
    const boxBottomRow = boxTopRow + 4;

    const companyLines = [
      `Address:${COMPANY_INFO.addressLine1}`,
      COMPANY_INFO.addressLine2,
      COMPANY_INFO.tel,
      COMPANY_INFO.email,
    ];
    // "Invoice"/"Date" here are this SUMMARY document's own reference, generated
    // per customer as year+month+running number — SAP has no such field (each
    // row keeps its own shipment invoice number in the table below). Revisit
    // once real numbering rules exist.
    const invoiceNumber = `${yearMonth}-${String(groupIdx + 1).padStart(5, "0")}`;
    const metaLines = [
      `Invoice: ${invoiceNumber}`,
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      "",
      `Bill To: ${customerName}`,
      customerAddress ? `Address: ${customerAddress}` : "",
    ];

    for (let i = 0; i < 5; i++) {
      const lineRow = boxTopRow + i;

      sheet.mergeCells(lineRow, 3, lineRow, metaStartCol - 1);
      const companyCell = sheet.getCell(lineRow, 3);
      companyCell.value = companyLines[i] ?? "";
      companyCell.font = { name: "Arial", size: 14 };
      companyCell.alignment = { vertical: "middle", horizontal: "left" };

      sheet.mergeCells(lineRow, metaStartCol, lineRow, colCount);
      const metaCell = sheet.getCell(lineRow, metaStartCol);
      metaCell.value = metaLines[i];
      metaCell.font = { name: "Arial", size: 14 };
      metaCell.alignment = { vertical: "middle", horizontal: "left" };
    }

    // Box only the address/invoice-meta panel: top + bottom border and a
    // vertical divider between the company info (left) and Invoice/Date/Bill
    // To meta (right) — the left/right OUTER sides stay open on purpose (no
    // left/right border). The divider's column comes from
    // findLetterheadMetaStartCol(), so it lands at the physical middle of the
    // page rather than some arbitrary column count fraction.
    for (let r = boxTopRow; r <= boxBottomRow; r++) {
      const companyMaster = sheet.getCell(r, 3);
      companyMaster.border = { ...companyMaster.border, right: BORDER_THIN };

      const metaMaster = sheet.getCell(r, metaStartCol);
      metaMaster.border = { ...metaMaster.border, left: BORDER_THIN };
    }
    ([
      [boxTopRow, "top"],
      [boxBottomRow, "bottom"],
    ] as const).forEach(([r, side]) => {
      [1, 2].forEach((c) => {
        const cell = sheet.getCell(r, c);
        cell.border = { ...cell.border, [side]: BORDER_THIN };
      });
      const companyMaster = sheet.getCell(r, 3);
      companyMaster.border = { ...companyMaster.border, [side]: BORDER_THIN };
      const metaMaster = sheet.getCell(r, metaStartCol);
      metaMaster.border = { ...metaMaster.border, [side]: BORDER_THIN };
    });

    row = boxBottomRow + 2;

    sheet.mergeCells(row, 1, row, colCount);
    const titleCell = sheet.getCell(row, 1);
    titleCell.value = "Summary Invoice (应收帐单)";
    titleCell.font = { name: REPORT_FONT, size: 20, bold: true, color: { argb: THEME.secondary.argb } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    sheet.getRow(row).height = 26;
    row += 2;

    const headerRow = row;
    SUMMARY_INVOICE_REPORT_COLUMNS.forEach((col, idx) => {
      const cell = sheet.getCell(headerRow, idx + 1);
      cell.value = col.header;
      applyHeaderStyle(cell);
      sheet.getColumn(idx + 1).width = col.width;
    });
    sheet.getRow(headerRow).height = 22;
    row++;

    const firstDataRow = row;
    group.forEach((r, idx) => {
      const excelRowIndex = firstDataRow + idx;
      SUMMARY_INVOICE_REPORT_COLUMNS.forEach((col, colIdx) => {
        const cell = sheet.getCell(excelRowIndex, colIdx + 1);
        cell.value = col.getValue(r, idx);
        if (col.numFmt) cell.numFmt = col.numFmt;
        applyBodyCellStyle(cell, col.align ?? "left", idx % 2 === 1);
        // Bumped up from reportStyles.ts's shared 10pt — kept local to this
        // report so it doesn't also resize the fuel/lubricant tables.
        cell.font = { ...cell.font, size: 14 };
      });
    });
    row = firstDataRow + group.length;

    const totalRow = row;
    sheet.mergeCells(totalRow, 1, totalRow, orderQtyCol - 1);
    const totalLabelCell = sheet.getCell(totalRow, 1);
    totalLabelCell.value = "Total (小计)";
    totalLabelCell.font = { name: REPORT_FONT, size: 12, bold: true };
    totalLabelCell.alignment = { vertical: "middle", horizontal: "center" };

    const totalOrderQtyCell = sheet.getCell(totalRow, orderQtyCol);
    totalOrderQtyCell.value = sum(group, (r) => r.sap?.qty);
    totalOrderQtyCell.numFmt = "#,##0";
    totalOrderQtyCell.font = { name: REPORT_FONT, size: 12, bold: true };
    totalOrderQtyCell.alignment = { vertical: "middle", horizontal: "right" };

    const totalDeliveredQtyCell = sheet.getCell(totalRow, deliveredQtyCol);
    totalDeliveredQtyCell.value = sum(group, (r) => r.sap?.qty);
    totalDeliveredQtyCell.numFmt = "#,##0";
    totalDeliveredQtyCell.font = { name: REPORT_FONT, size: 12, bold: true };
    totalDeliveredQtyCell.alignment = { vertical: "middle", horizontal: "right" };

    const totalAmountLabelCell = sheet.getCell(totalRow, costPerUnitCol);
    totalAmountLabelCell.value = "TOTAL (小计)";
    totalAmountLabelCell.font = { name: REPORT_FONT, size: 12, bold: true };
    totalAmountLabelCell.alignment = { vertical: "middle", horizontal: "right" };

    const totalAmountCell = sheet.getCell(totalRow, amountCol);
    totalAmountCell.value = sum(group, (r) => r.sap?.grossTotalInclVat);
    totalAmountCell.numFmt = "#,##0";
    totalAmountCell.font = { name: REPORT_FONT, size: 12, bold: true };
    totalAmountCell.alignment = { vertical: "middle", horizontal: "right" };
    row += 2;

    const sigColSpan = Math.max(1, Math.floor(colCount / SIGNATURE_LABELS.length));
    SIGNATURE_LABELS.forEach((label, idx) => {
      const startCol = idx * sigColSpan + 1;
      const endCol = idx === SIGNATURE_LABELS.length - 1 ? colCount : startCol + sigColSpan - 1;
      sheet.mergeCells(row, startCol, row, endCol);
      const cell = sheet.getCell(row, startCol);
      cell.value = label;
      cell.font = { name: REPORT_FONT, size: 9 };
      cell.alignment = { vertical: "top", horizontal: "center", wrapText: true };
    });
    sheet.getRow(row).height = 40;
  });

  return workbook;
};
