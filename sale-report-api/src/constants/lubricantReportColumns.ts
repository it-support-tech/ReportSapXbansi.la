import { LubricantMergedRow } from "../types/lubricantExcel.types";

export type LubricantCellValue = string | number | null;

export interface LubricantColumnDef {
  header: string;
  key: string;
  width: number;
  numFmt?: string;
  align?: "left" | "center" | "right";
  /**
   * true: this field is one-per-invoice (customer, tax id, dates, tax invoice
   * no) — the generator merges it vertically across every product-line row
   * belonging to the same invoice, and calls `getValue` once per invoice
   * group. false: one-per-product-line (item, unit/qty, amounts) —
   * `getValue` is called for every row.
   */
  groupLevel: boolean;
  getValue: (row: LubricantMergedRow, rowIndexInGroup: number, group: LubricantMergedRow[]) => LubricantCellValue;
}

/**
 * Layout mirrors the real target template (ສະຫລຸບການຂາຍເດືອນ 08 - update
 * .xlsx, sheet "Total ຍອດຂາຍນ້ຳມັນເຄື່ອງ"): one invoice can span several
 * rows (one per product line), with invoice-level fields merged down the
 * group. VAT and the grand total are raw SAP fields here (unlike the
 * placeholder version of this module) — the real export computes them.
 */
export const LUBRICANT_REPORT_COLUMNS: LubricantColumnDef[] = [
  { header: "ລ/ດ", key: "no", width: 6, align: "center", groupLevel: false, getValue: (_r, _i, _g) => null },
  { header: "ຊື່ລູກຄ້າ", key: "customerName", width: 26, groupLevel: true, getValue: (r) => r.sap?.customerName ?? null },
  { header: "ລາຍການສິນຄ້າ", key: "productDescription", width: 30, groupLevel: false, getValue: (r) => r.sap?.productDescription ?? null },
  { header: "ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ", key: "customerTaxId", width: 18, groupLevel: true, getValue: (r) => r.sap?.customerTaxId ?? null },
  { header: "ເລກທີ່ໃບຂົນສົ່ງສິນຄ້າ", key: "deliveryDocNumber", width: 14, groupLevel: true, getValue: (r) => r.sap?.deliveryDocNumber ?? null },
  { header: "ເລກທີ່ໃບອິນວອຍ", key: "invoiceNumber", width: 14, groupLevel: true, getValue: (r) => r.invoiceNumber },
  { header: "ວັນທີອອກອິນວອຍ", key: "documentDate", width: 14, align: "center", groupLevel: true, getValue: (r) => r.sap?.documentDate ?? null },
  { header: "ເລກທີ່ບິນອາກອນ", key: "taxInvoiceNumber", width: 16, groupLevel: true, getValue: (r) => r.banchi?.taxInvoiceNumber ?? null },
  { header: "ຫົວໜ່ວຍ", key: "unit", width: 10, groupLevel: false, getValue: (r) => r.sap?.unit ?? null },
  { header: "ຈຳນວນ", key: "qty", width: 10, numFmt: "#,##0", align: "right", groupLevel: false, getValue: (r) => r.sap?.qty ?? null },
  { header: "ລາຄາບໍ່ລວມ ອມພ", key: "amountExclVat", width: 16, numFmt: "#,##0", align: "right", groupLevel: false, getValue: (r) => r.sap?.amountExclVat ?? null },
  { header: "ອມພ 10%", key: "vatAmount", width: 14, numFmt: "#,##0", align: "right", groupLevel: false, getValue: (r) => r.sap?.vatAmount ?? null },
  { header: "ຍອດລວມ(ເສຍພາສີ)", key: "totalInclVat", width: 16, numFmt: "#,##0", align: "right", groupLevel: false, getValue: (r) => r.sap?.grandTotalInclVat ?? null },
  { header: "ຍອດລວມທັງໝົດ", key: "grandTotalRow", width: 16, numFmt: "#,##0", align: "right", groupLevel: false, getValue: (r) => r.sap?.grandTotalInclVat ?? null },
  { header: "ເປັນເງິນ THB", key: "amountThb", width: 14, numFmt: "#,##0.00", align: "right", groupLevel: false, getValue: (r) => r.sap?.amountThb ?? null },
  { header: "ເປັນເງິນ USD", key: "amountUsd", width: 14, numFmt: "#,##0.00", align: "right", groupLevel: false, getValue: (r) => r.sap?.amountUsd ?? null },
];
