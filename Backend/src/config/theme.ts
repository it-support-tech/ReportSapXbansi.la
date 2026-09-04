/**
 * Company brand colors, shared with frontend/src/constants/colors.ts.
 * exceljs uses ARGB hex (no rgb()/# prefix) for fills & fonts.
 */
export const THEME = {
  primary: { rgb: "rgb(249, 56, 34)", argb: "FFF93822" }, // #F93822
  secondary: { rgb: "rgb(0, 38, 87)", argb: "FF002657" }, // #002657
  white: { argb: "FFFFFFFF" },
  gold: { argb: "FFD4AF37" },
  lightGray: { argb: "FFF2F2F2" },
  borderGray: { argb: "FFB0B0B0" },
} as const;
