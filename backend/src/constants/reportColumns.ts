import { MergedRow } from "../types/excel.types";

export type ReportCellValue = string | number | null;

export interface ReportColumnDef {
  header: string;
  key: string;
  width: number;
  numFmt?: string;
  align?: "left" | "center" | "right";
  /** Columns sharing the same `group` text get one merged header cell above their own sub-headers (see "ໂຄງສ້າງລັດຖະບານ"). */
  group?: string;
  /** Pulls the display value for this column out of one merged row. */
  getValue: (row: MergedRow, index: number) => ReportCellValue;
}

const VAT_RATE = 0.1;

const safeDiv = (a: number | null | undefined, b: number | null | undefined): number | null =>
  a == null || b == null || b === 0 ? null : a / b;

/** ຍອດລວມທັງໝົດ (ລວມ ອມພ) ÷ ຈຳນວນລີດ */
const unitPriceInclVat = (row: MergedRow): number | null =>
  safeDiv(row.sap?.grandTotalInclVat as number | null, row.sap?.quantityLiters as number | null);

/** ລາຄາຂາຍຕົວຈິງ (ລວມ ອມພ) ÷ (1 + 10%) */
const unitPriceExclVat = (row: MergedRow): number | null => {
  const inclVat = unitPriceInclVat(row);
  return inclVat == null ? null : inclVat / (1 + VAT_RATE);
};

/** ຍອດລວມທັງໝົດ (ລວມ ອມພ) ÷ (1 + 10%) */
const amountExclVat = (row: MergedRow): number | null => {
  const grandTotal = row.sap?.grandTotalInclVat as number | null;
  return grandTotal == null ? null : grandTotal / (1 + VAT_RATE);
};

/** ຍອດລວມທັງໝົດ - ຈຳນວນເງິນບໍ່ລວມອມພ */
const vatAmount10Pct = (row: MergedRow): number | null => {
  const grandTotal = row.sap?.grandTotalInclVat as number | null;
  const exclVat = amountExclVat(row);
  return grandTotal == null || exclVat == null ? null : grandTotal - exclVat;
};

/**
 * Final report column layout — mirrors the company's real template
 * (ສະຫລຸບການຂາຍເດືອນ) column-for-column, 24 columns total so
 * fitToWidth:1 lands them on one printed A4 landscape page.
 * ໂຄງສ້າງລັດຖະບານ is one merged header spanning 4 sub-columns.
 */
export const REPORT_COLUMNS: ReportColumnDef[] = [
  { header: "ລ/ດ", key: "no", width: 6, align: "center", getValue: (_r, i) => i + 1 },
  { header: "ຊື່ລູກຄ້າ", key: "customerName", width: 26, getValue: (r) => r.sap?.customerName ?? null },
  { header: "ປະເພດນ້ຳມັນ", key: "oilCategoryCode", width: 14, getValue: (r) => r.sap?.oilCategoryCode ?? null },
  { header: "ຊະນິດນໍ້າມັນ", key: "oilTypeName", width: 12, getValue: (r) => r.sap?.oilTypeName ?? null },
  { header: "ສາງ", key: "warehouse", width: 10, align: "center", getValue: (r) => r.sap?.warehouse ?? null },
  { header: "ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ", key: "customerTaxId", width: 18, getValue: (r) => r.sap?.customerTaxId ?? null },
  { header: "ວັນທີ ອອກເອກະສານ", key: "documentDate", width: 14, align: "center", getValue: (r) => r.sap?.documentDate ?? null },
  { header: "ເລກທີ່ໃບຂົນສົ່ງສິນຄ້າ", key: "deliveryDocNumber", width: 16, getValue: (r) => r.sap?.deliveryDocNumber ?? null },
  { header: "ເລກທີ່ໃບອີນວອຍ", key: "invoiceNumber", width: 16, getValue: (r) => r.invoiceNumber },
  { header: "ເລກທີບິນອາກອນ", key: "taxInvoiceNumber", width: 16, getValue: (r) => r.banchi?.taxInvoiceNumber ?? null },
  { header: "ເລກທີໃບສັ່ງຂາຍ ( SO )", key: "soNumber", width: 16, getValue: (r) => r.sap?.soNumber ?? null },
  { header: "ວັນທີ່ອອກເອກະສານ ( SO )", key: "soDate", width: 14, align: "center", getValue: (r) => r.sap?.soDate ?? null },
  { header: "PO ລູກຄ້າ", key: "customerPo", width: 14, getValue: (r) => r.sap?.customerPo ?? null },
  { header: "ຈຳນວນລີດ", key: "quantityLiters", width: 12, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.quantityLiters ?? null },
  { header: "ວັນທີ", key: "govPriceDate", width: 12, align: "center", group: "ໂຄງສ້າງລັດຖະບານ", getValue: (r) => r.sap?.govPriceDate ?? null },
  { header: "ເລກທີ", key: "govPriceRefNumber", width: 12, group: "ໂຄງສ້າງລັດຖະບານ", getValue: (r) => r.sap?.govPriceRefNumber ?? null },
  { header: "ອມພ ມອບຕື່ມ", key: "govVatAllowance", width: 12, numFmt: "#,##0", align: "right", group: "ໂຄງສ້າງລັດຖະບານ", getValue: (r) => r.sap?.govVatAllowance ?? null },
  { header: "ລາຄາໂຄງສ້າງ", key: "govStructuredPrice", width: 12, numFmt: "#,##0", align: "right", group: "ໂຄງສ້າງລັດຖະບານ", getValue: (r) => r.sap?.govStructuredPrice ?? null },
  { header: "ສ່ວນຫຼຸດ", key: "discount", width: 10, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.discount ?? null },
  { header: "ລາຄາຂາຍຕົວຈິງ (ລວມ ອມພ)", key: "unitPriceInclVat", width: 16, numFmt: "#,##0.00", align: "right", getValue: unitPriceInclVat },
  { header: "ລາຄາບໍ່ລວມ ອມພ", key: "unitPriceExclVat", width: 14, numFmt: "#,##0.00", align: "right", getValue: unitPriceExclVat },
  { header: "ຈໍານວນເງິນ ບໍ່ລວມ ອມພ", key: "amountExclVat", width: 16, numFmt: "#,##0", align: "right", getValue: amountExclVat },
  { header: "ອມພ 10%", key: "vatAmount10Pct", width: 14, numFmt: "#,##0", align: "right", getValue: vatAmount10Pct },
  { header: "ຍອດລວມທັງໝົດ (ລວມ ອມພ)", key: "grandTotalInclVat", width: 16, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.grandTotalInclVat ?? null },
];
