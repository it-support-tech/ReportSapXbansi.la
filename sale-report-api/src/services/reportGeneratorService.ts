import path from "path";
import ExcelJS from "exceljs";
import { REPORT_COLUMNS } from "../constants/reportColumns";
import { THEME } from "../config/theme";
import { MergedRow } from "../types/excel.types";

const REPORT_FONT = "Phetsarath OT";

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

const COMPANY_INFO = {
  name: "NTP TRADING PETROLEUM CO., LTD.",
  address: "Donglouang Village, Naxay Thong District, Vientiane Capital Laos P.D.R",
  tel: "Tel. : 030-5888885",
  taxId: "TAX ID : 200510584900",
  email: "ntp@gmail.com",
};

const applyHeaderStyle = (cell: ExcelJS.Cell): void => {
  cell.font = { name: REPORT_FONT, size: 11, bold: true, color: { argb: THEME.white.argb } };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: THEME.secondary.argb },
  };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: THEME.borderGray.argb } },
    left: { style: "thin", color: { argb: THEME.borderGray.argb } },
    bottom: { style: "thin", color: { argb: THEME.borderGray.argb } },
    right: { style: "thin", color: { argb: THEME.borderGray.argb } },
  };
};

const applyBodyCellStyle = (cell: ExcelJS.Cell, align: "left" | "center" | "right", zebra: boolean): void => {
  cell.font = { name: REPORT_FONT, size: 10, color: { argb: "FF1A1A1A" } };
  cell.alignment = { vertical: "middle", horizontal: align, wrapText: false };
  cell.border = {
    top: { style: "hair", color: { argb: THEME.borderGray.argb } },
    left: { style: "hair", color: { argb: THEME.borderGray.argb } },
    bottom: { style: "hair", color: { argb: THEME.borderGray.argb } },
    right: { style: "hair", color: { argb: THEME.borderGray.argb } },
  };
  if (zebra) {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME.lightGray.argb } };
  }
};

/**
 * Builds the landscape A4 report workbook from merged rows. Page setup fits
 * however many columns are configured in REPORT_COLUMNS onto one printed page.
 */
export const generateReportWorkbook = async (
  rows: MergedRow[],
  reportTitle = "ສະຫຼຸບບິນຂາຍນໍ້າມັນໃສ"
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

  const colCount = REPORT_COLUMNS.length;

  // Letterhead: logo spans columns A-B across rows 1-5; company info fills
  // the rest of row width beside it, one line per row.
  const LETTERHEAD_ROWS = 5;
  const LOGO_COLUMN_SPAN = 2;

  const imageId = workbook.addImage({ filename: LOGO_PATH, extension: "png" });
  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 100, height: 98 },
  });

  const letterheadLines: Array<{ text: string; bold?: boolean; size?: number }> = [
    { text: COMPANY_INFO.name, bold: true, size: 13 },
    { text: COMPANY_INFO.address },
    { text: COMPANY_INFO.tel },
    { text: COMPANY_INFO.taxId },
    { text: COMPANY_INFO.email },
  ];
  letterheadLines.forEach((line, idx) => {
    const rowNum = idx + 1;
    sheet.mergeCells(rowNum, LOGO_COLUMN_SPAN + 1, rowNum, colCount);
    const cell = sheet.getCell(rowNum, LOGO_COLUMN_SPAN + 1);
    cell.value = line.text;
    cell.font = { name: "Arial", size: line.size ?? 10, bold: line.bold ?? false, color: { argb: "FF1A1A1A" } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    sheet.getRow(rowNum).height = 16;
  });

  const titleRow = LETTERHEAD_ROWS + 1;
  const subtitleRow = LETTERHEAD_ROWS + 2;

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

  // Two-row header: columns with the same `group` share one merged label
  // above their own sub-headers (e.g. "ໂຄງສ້າງລັດຖະບານ"); ungrouped columns
  // get a single label vertically merged across both header rows.
  const groupHeaderRow = subtitleRow + 1;
  const subHeaderRow = subtitleRow + 2;
  let col = 1;
  while (col <= colCount) {
    const current = REPORT_COLUMNS[col - 1];
    if (current.group) {
      let runEnd = col;
      while (runEnd < colCount && REPORT_COLUMNS[runEnd]?.group === current.group) runEnd++;

      if (runEnd > col) sheet.mergeCells(groupHeaderRow, col, groupHeaderRow, runEnd);
      const groupCell = sheet.getCell(groupHeaderRow, col);
      groupCell.value = current.group;
      applyHeaderStyle(groupCell);

      for (let c = col; c <= runEnd; c++) {
        const subCol = REPORT_COLUMNS[c - 1];
        const subCell = sheet.getCell(subHeaderRow, c);
        subCell.value = subCol.header;
        applyHeaderStyle(subCell);
        sheet.getColumn(c).width = subCol.width;
      }
      col = runEnd + 1;
    } else {
      sheet.mergeCells(groupHeaderRow, col, subHeaderRow, col);
      const cell = sheet.getCell(groupHeaderRow, col);
      cell.value = current.header;
      applyHeaderStyle(cell);
      sheet.getColumn(col).width = current.width;
      col++;
    }
  }
  sheet.getRow(groupHeaderRow).height = 20;
  sheet.getRow(subHeaderRow).height = 20;

  const firstDataRow = subHeaderRow + 1;
  rows.forEach((row, rowIdx) => {
    const excelRowIndex = firstDataRow + rowIdx;
    REPORT_COLUMNS.forEach((reportCol, colIdx) => {
      const cell = sheet.getCell(excelRowIndex, colIdx + 1);
      cell.value = reportCol.getValue(row, rowIdx);
      if (reportCol.numFmt) cell.numFmt = reportCol.numFmt;
      applyBodyCellStyle(cell, reportCol.align ?? "left", rowIdx % 2 === 1);
    });
  });

  sheet.autoFilter = {
    from: { row: subHeaderRow, column: 1 },
    to: { row: subHeaderRow, column: colCount },
  };

  return workbook;
};
