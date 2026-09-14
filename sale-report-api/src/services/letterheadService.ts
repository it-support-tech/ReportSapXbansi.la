import path from "path";
import ExcelJS from "exceljs";

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

const COMPANY_INFO = {
  name: "NTP TRADING PETROLEUM CO., LTD.",
  address: "Donglouang Village, Naxay Thong District, Vientiane Capital Laos P.D.R",
  tel: "Tel. : 030-5888885",
};

/** Logo + company info block occupies rows 1-5 at the top of every generated report. */
export const LETTERHEAD_ROWS = 5;
const LOGO_COLUMN_SPAN = 2;

/** Draws the shared company letterhead (logo + info) into rows 1-5 of `sheet`. */
export const applyLetterhead = (sheet: ExcelJS.Worksheet, colCount: number): void => {
  const imageId = sheet.workbook.addImage({ filename: LOGO_PATH, extension: "png" });
  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 100, height: 98 },
  });

  const letterheadLines: Array<{ text: string; bold?: boolean; size?: number }> = [
    { text: COMPANY_INFO.name, bold: true, size: 13 },
    { text: COMPANY_INFO.address },
    { text: COMPANY_INFO.tel },
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
};
