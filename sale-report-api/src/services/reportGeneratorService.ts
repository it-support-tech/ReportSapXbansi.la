import ExcelJS from "exceljs";
import { REPORT_COLUMNS } from "../constants/reportColumns";
import { THEME } from "../config/theme";
import { MergedRow } from "../types/excel.types";
import { REPORT_FONT, applyBodyCellStyle, applyHeaderStyle } from "./reportStyles";
import { LETTERHEAD_ROWS, applyLetterhead } from "./letterheadService";

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

  applyLetterhead(sheet, colCount);

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
