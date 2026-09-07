import { MergedRow } from "../types/excel.types";

export type ReportCellValue = string | number | null;

export interface ReportColumnDef {
  header: string;
  key: string;
  width: number;
  numFmt?: string;
  align?: "left" | "center" | "right";
  /** Columns sharing the same `group` text get one merged header cell above their own sub-headers. */
  group?: string;
  /** Pulls the display value for this column out of one merged row. */
  getValue: (row: MergedRow, index: number) => ReportCellValue;
}

/**
 * Final report column layout — mirrors the company's real template
 * (ສະຫລຸບການຂາຍເດືອນ), with two currency columns (USD/THB) appended.
 * Every value is a raw SAP field, no derived/computed VAT math — except
 * the "ໂຄງສ້າງລັດຖະບານ" group, which is kept for layout parity with the
 * template but always left blank: there's no reliable SAP source for it.
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
  { header: "ວັນທີ", key: "govPriceDate", width: 12, align: "center", group: "ໂຄງສ້າງລັດຖະບານ", getValue: () => null },
  { header: "ເລກທີ", key: "govPriceRefNumber", width: 12, group: "ໂຄງສ້າງລັດຖະບານ", getValue: () => null },
  { header: "ອມພ ມອບຕື່ມ", key: "govVatAllowance", width: 12, numFmt: "#,##0", align: "right", group: "ໂຄງສ້າງລັດຖະບານ", getValue: () => null },
  { header: "ລາຄາໂຄງສ້າງ", key: "govStructuredPrice", width: 12, numFmt: "#,##0", align: "right", group: "ໂຄງສ້າງລັດຖະບານ", getValue: () => null },
  { header: "ສ່ວນຫຼຸດ", key: "discount", width: 10, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.discount ?? null },
  { header: "ລາຄາຂາຍຕົວຈິງ (ລວມ ອມພ)", key: "grossPriceAfterDisc", width: 16, numFmt: "#,##0.00", align: "right", getValue: (r) => r.sap?.grossPriceAfterDisc ?? null },
  { header: "ລາຄາບໍ່ລວມ ອມພ", key: "priceExclVat", width: 14, numFmt: "#,##0.00", align: "right", getValue: (r) => r.sap?.priceExclVat ?? null },
  { header: "ຈໍານວນເງິນ ບໍ່ລວມ ອມພ", key: "amountExclVat", width: 16, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.amountExclVat ?? null },
  { header: "ອມພ 10%", key: "vatAmount10Pct", width: 14, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.vatAmount10Pct ?? null },
  { header: "ຍອດລວມທັງໝົດ (ລວມ ອມພ)", key: "grandTotalInclVat", width: 16, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.grandTotalInclVat ?? null },
  { header: "Total Amount (USD)", key: "totalAmountUsd", width: 14, numFmt: "#,##0.00", align: "right", getValue: (r) => r.sap?.totalAmountUsd ?? null },
  { header: "Total Amount (THB)", key: "totalAmountThb", width: 14, numFmt: "#,##0.00", align: "right", getValue: (r) => r.sap?.totalAmountThb ?? null },
];
