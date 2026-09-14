/** Preview-table column config — mirrors the shape of the backend's REPORT_COLUMNS. */
export interface PreviewColumn {
  key: string;
  header: string;
  source: "sap" | "banchi" | "root";
  align?: "left" | "center" | "right";
}

export const PREVIEW_TABLE_COLUMNS: PreviewColumn[] = [
  { key: "invoiceNumber", header: "ເລກທີ່ໃບອີນວອຍ", source: "root" },
  { key: "documentDate", header: "ວັນທີ ອອກເອກະສານ", source: "sap", align: "center" },
  { key: "customerName", header: "ຊື່ລູກຄ້າ", source: "sap" },
  { key: "oilTypeName", header: "ຊະນິດນໍ້າມັນ", source: "sap" },
  { key: "quantityLiters", header: "ຈຳນວນລີດ", source: "sap", align: "right" },
  { key: "grandTotalInclVat", header: "ຍອດລວມທັງໝົດ", source: "sap", align: "right" },
  { key: "taxInvoiceNumber", header: "ເລກທີບິນອາກອນ", source: "banchi" },
  { key: "matched", header: "ສະຖານະ", source: "root", align: "center" },
];

export interface DebugColumn {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
}

/** SAP-only debug view — one row per SapB1Row field, in the same order as sale-report-api/src/constants/excelMap.ts. */
export const SAP_DEBUG_COLUMNS: DebugColumn[] = [
  { key: "invoiceNumber", header: "AR Invoice No" },
  { key: "customerName", header: "ຊື່ລູກຄ້າ" },
  { key: "oilCategoryCode", header: "ປະເພດນ້ຳມັນ" },
  { key: "oilTypeName", header: "ຊະນິດນໍ້າມັນ" },
  { key: "warehouse", header: "ສາງ", align: "center" },
  { key: "customerTaxId", header: "ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ" },
  { key: "documentDate", header: "ວັນທີ ອອກເອກະສານ", align: "center" },
  { key: "deliveryDocNumber", header: "ເລກທີ່ໃບຂົນສົ່ງສິນຄ້າ" },
  { key: "soNumber", header: "ເລກທີໃບສັ່ງຂາຍ (SO)" },
  { key: "soDate", header: "ວັນທີ່ອອກເອກະສານ (SO)", align: "center" },
  { key: "customerPo", header: "PO ລູກຄ້າ" },
  { key: "quantityLiters", header: "ຈຳນວນລີດ", align: "right" },
  { key: "discount", header: "ສ່ວນຫຼຸດ", align: "right" },
  { key: "grossPriceAfterDisc", header: "ລາຄາຂາຍຕົວຈິງ (ລວມ ອມພ)", align: "right" },
  { key: "priceExclVat", header: "ລາຄາບໍ່ລວມ ອມພ", align: "right" },
  { key: "amountExclVat", header: "ຈໍານວນເງິນ ບໍ່ລວມ ອມພ", align: "right" },
  { key: "vatAmount10Pct", header: "ອມພ 10%", align: "right" },
  { key: "grandTotalInclVat", header: "ຍອດລວມທັງໝົດ", align: "right" },
  { key: "totalAmountUsd", header: "Total Amount (USD)", align: "right" },
  { key: "totalAmountThb", header: "Total Amount (THB)", align: "right" },
];

/** Preview-table config for the lubricant (ນ້ຳມັນເຄື່ອງ) module — mirrors LUBRICANT_REPORT_COLUMNS. */
export const LUBRICANT_PREVIEW_COLUMNS: PreviewColumn[] = [
  { key: "invoiceNumber", header: "ເລກທີ່ໃບອິນວອຍ", source: "root" },
  { key: "documentDate", header: "ວັນທີອອກອິນວອຍ", source: "sap", align: "center" },
  { key: "customerName", header: "ຊື່ລູກຄ້າ", source: "sap" },
  { key: "productDescription", header: "ລາຍການສິນຄ້າ", source: "sap" },
  { key: "grandTotalInclVat", header: "ຍອດລວມທັງໝົດ", source: "sap", align: "right" },
  { key: "taxInvoiceNumber", header: "ເລກທີບິນອາກອນ", source: "banchi" },
  { key: "matched", header: "ສະຖານະ", source: "root", align: "center" },
];

/** SAP-only debug view for lubricant, in the same order as lubricantExcelMap.ts. */
export const LUBRICANT_SAP_DEBUG_COLUMNS: DebugColumn[] = [
  { key: "invoiceNumber", header: "Invoice No" },
  { key: "documentDate", header: "Invoice Date", align: "center" },
  { key: "soNumber", header: "SO No" },
  { key: "deliveryDocNumber", header: "Delivery Note No" },
  { key: "customerCode", header: "Customer Code" },
  { key: "customerName", header: "Customer Name" },
  { key: "customerTaxId", header: "Tax ID" },
  { key: "productCode", header: "Product Code" },
  { key: "productDescription", header: "Description" },
  { key: "unitPrice", header: "Unit Price", align: "right" },
  { key: "qty", header: "Qty", align: "right" },
  { key: "unit", header: "Unit" },
  { key: "literPerUnit", header: "Liter Per Unit", align: "right" },
  { key: "totalLiters", header: "Total Liters", align: "right" },
  { key: "amountExclVat", header: "Amount Excl. VAT (LAK)", align: "right" },
  { key: "vatAmount", header: "VAT Amount (LAK)", align: "right" },
  { key: "grandTotalInclVat", header: "Amount Incl. VAT (Grand Total LAK)", align: "right" },
  { key: "amountThb", header: "Amount (THB)", align: "right" },
  { key: "amountUsd", header: "Amount (USD)", align: "right" },
  { key: "docCurrency", header: "Doc Currency" },
];
