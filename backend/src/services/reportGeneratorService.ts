import ExcelJS from "exceljs";
import { REPORT_COLUMNS } from "../constants/reportColumns";
import { THEME } from "../config/theme";
import { MergedRow } from "../types/excel.types";

const REPORT_FONT = "Phetsarath OT";

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
  reportTitle = "ລາຍງານປະຈຳງວດ (Sales Tax Reconciliation Report)"
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
    views: [{ state: "frozen", xSplit: 1, ySplit: 4, showGridLines: false }],
  });

  const colCount = REPORT_COLUMNS.length;

  sheet.mergeCells(1, 1, 1, colCount);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = reportTitle;
  titleCell.font = { name: REPORT_FONT, size: 14, bold: true, color: { argb: THEME.secondary.argb } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 26;

  sheet.mergeCells(2, 1, 2, colCount);
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = `ສ້າງເມື່ອ: ${new Date().toLocaleDateString("lo-LA")}   |   ຈຳນວນລາຍການ: ${rows.length}`;
  subtitleCell.font = { name: REPORT_FONT, size: 10, italic: true, color: { argb: "FF555555" } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "center" };

  // Two-row header: columns with the same `group` share one merged label
  // above their own sub-headers (e.g. "ໂຄງສ້າງລັດຖະບານ"); ungrouped columns
  // get a single label vertically merged across both header rows.
  const groupHeaderRow = 3;
  const subHeaderRow = 4;
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
