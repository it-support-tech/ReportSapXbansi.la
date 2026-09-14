import ExcelJS from "exceljs";
import { THEME } from "../config/theme";

export const REPORT_FONT = "Phetsarath OT";

export const applyHeaderStyle = (cell: ExcelJS.Cell): void => {
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

export const applyBodyCellStyle = (cell: ExcelJS.Cell, align: "left" | "center" | "right", zebra: boolean): void => {
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
