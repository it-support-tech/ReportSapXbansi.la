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

/** SAP-only debug view — one row per SapB1Row field, in the same order as backend/src/constants/excelMap.ts. */
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
  { key: "govPriceDate", header: "ໂຄງສ້າງລັດຖະບານ: ວັນທີ", align: "center" },
  { key: "govPriceRefNumber", header: "ໂຄງສ້າງລັດຖະບານ: ເລກທີ" },
  { key: "govVatAllowance", header: "ອມພ ມອບຕື່ມ", align: "right" },
  { key: "govStructuredPrice", header: "ລາຄາໂຄງສ້າງ", align: "right" },
  { key: "discount", header: "ສ່ວນຫຼຸດ", align: "right" },
  { key: "grandTotalInclVat", header: "ຍອດລວມທັງໝົດ", align: "right" },
];
