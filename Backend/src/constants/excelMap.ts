/**
 * Source column mapping (SAP B1 export & ບັນຊີ.la export -> internal field names).
 *
 * Header matching is case-insensitive, trims whitespace, and treats `_`/`-`
 * as spaces. `aliases` is priority-ordered, not a plain synonym set: if a
 * sheet has more than one column that could match a field (e.g. both
 * "Invoice No" and "invoice_number"), the alias listed FIRST wins — put the
 * canonical/most-specific header name first. Add/edit aliases here when SAP
 * or ບັນຊີ.la change their export headers — no service code changes needed.
 *
 * `required: true` fields must be found in the sheet or parsing throws.
 */
export interface ColumnDef {
  field: string;
  aliases: string[];
  required?: boolean;
}

/**
 * Aliases marked CONFIRMED come straight from the real SAP B1 export headers.
 * Everything else is still a BEST-EFFORT guess (the report template's own Lao
 * label, or a generic SAP B1 fallback) pending confirmation.
 */
export const SAP_B1_COLUMN_MAP: ColumnDef[] = [
  { field: "invoiceNumber", aliases: ["ar invoice no", "invoice number", "ເລກທີ່ໃບອີນວອຍ", "docnum", "invoice no"], required: true }, // CONFIRMED: "AR Invoice No"
  { field: "customerName", aliases: ["ຊື່ລູກຄ້າ", "ຊືີ່ລູກຄ້າ", "customer name", "cardname"] },
  { field: "oilCategoryCode", aliases: ["oil category (item code)", "ປະເພດນ້ຳມັນ"] }, // CONFIRMED
  { field: "oilTypeName", aliases: ["oil type (item name)", "ຊະນິດນໍ້າມັນ", "ຊະນິດນ້ຳມັນ"] }, // CONFIRMED
  { field: "warehouse", aliases: ["warehouse code", "ສາງ"] }, // CONFIRMED
  { field: "customerTaxId", aliases: ["ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ", "tax id", "lictradnum"] },
  { field: "documentDate", aliases: ["document date", "ວັນທີ ອອກເອກະສານ", "ວັນທີອອກເອກະສານ"] }, // CONFIRMED
  { field: "deliveryDocNumber", aliases: ["delivery note no", "ເລກທີ່ໃບຂົນສົ່ງສິນຄ້າ"] }, // CONFIRMED
  { field: "soNumber", aliases: ["sales order no", "ເລກທີໃບສັ່ງຂາຍ ( so )"] }, // CONFIRMED
  { field: "soDate", aliases: ["sales order date", "ວັນທີ່ອອກເອກະສານ ( so )"] }, // CONFIRMED
  { field: "customerPo", aliases: ["po ລູກຄ້າ", "customer po"] },
  { field: "quantityLiters", aliases: ["liters", "ຈຳນວນລີດ", "quantity", "qty"] }, // CONFIRMED
  { field: "govPriceDate", aliases: ["gov price date"] },
  { field: "govPriceRefNumber", aliases: ["gov price ref number"] },
  { field: "govVatAllowance", aliases: ["ອມພ ມອບຕື່ມ"] },
  { field: "govStructuredPrice", aliases: ["ລາຄາໂຄງສ້າງ"] },
  { field: "discount", aliases: ["ສ່ວນຫຼຸດ", "discount"] },
  { field: "grandTotalInclVat", aliases: ["ຍອດລວມທັງໝົດ (ລວມ ອມພ)", "ຍອດລວມທັງໝົດ", "doctotal", "amount"] },
];

/**
 * ບັນຊີ.la contributes exactly one field to the report: vat_number (the tax
 * invoice number), joined onto the SAP row by invoice_number. Everything
 * else in the report comes from SAP B1.
 */
export const BANCHI_LA_COLUMN_MAP: ColumnDef[] = [
  { field: "invoiceNumber", aliases: ["invoice number", "ເລກທີ invoice", "ເລກໃບເກັບເງິນ", "invoice no"], required: true },
  { field: "taxInvoiceNumber", aliases: ["vat number", "ເລກທີບິນອາກອນ"] },
];

/**
 * Normalizes a raw header string for alias matching: lowercase + trim + collapse
 * spaces, and treats `_`/`-` as spaces so snake_case/kebab-case export headers
 * (e.g. "invoice_number") match the same alias as "invoice number".
 */
export const normalizeHeader = (header: unknown): string =>
  String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
