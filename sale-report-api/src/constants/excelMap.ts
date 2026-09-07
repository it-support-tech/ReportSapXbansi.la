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
 * All aliases below are CONFIRMED against the real SAP B1 export
 * ("NTP-Report AR Reserve Invoice_Item Group_Status.xlsx"), header row:
 * #, Canceled Status, Customer Name, Oil Category (Item Code), Oil Type
 * (Item Name), Warehouse Code, Tax ID, Document Date, Delivery Note No,
 * AR Invoice No, Tax Invoice No, Sales Order No, Sales Order Date,
 * Customer PO, Liters, Gov Structure Date, Gov Structure No, Additional OMP,
 * Doc Currency, Discount Amt., Gross Price after Disc.,
 * Price Excl. OMP (LAK), Amount Excl. OMP (LAK), OMP 10% (LAK),
 * Total Amount (LAK), Total Amount (THB), Total Amount (USD).
 *
 * "Gov Structure Date/No" and "Additional OMP" are intentionally not mapped —
 * the report skips the government-structure columns entirely (always empty
 * in practice). "Tax Invoice No" is also unused: this report's tax invoice
 * number comes from ບັນຊີ.la's vat_number instead (see BANCHI_LA_COLUMN_MAP).
 */
export const SAP_B1_COLUMN_MAP: ColumnDef[] = [
  { field: "invoiceNumber", aliases: ["ar invoice no"], required: true },
  { field: "customerName", aliases: ["customer name"] },
  { field: "oilCategoryCode", aliases: ["oil category (item code)"] },
  { field: "oilTypeName", aliases: ["oil type (item name)"] },
  { field: "warehouse", aliases: ["warehouse code"] },
  { field: "customerTaxId", aliases: ["tax id"] },
  { field: "documentDate", aliases: ["document date"] },
  { field: "deliveryDocNumber", aliases: ["delivery note no"] },
  { field: "soNumber", aliases: ["sales order no"] },
  { field: "soDate", aliases: ["sales order date"] },
  { field: "customerPo", aliases: ["customer po"] },
  { field: "quantityLiters", aliases: ["liters"] },
  { field: "discount", aliases: ["discount amt."] },
  { field: "grossPriceAfterDisc", aliases: ["gross price after disc."] },
  { field: "priceExclVat", aliases: ["price excl. omp (lak)"] },
  { field: "amountExclVat", aliases: ["amount excl. omp (lak)"] },
  { field: "vatAmount10Pct", aliases: ["omp 10% (lak)"] },
  { field: "grandTotalInclVat", aliases: ["total amount (lak)"] },
  { field: "totalAmountUsd", aliases: ["total amount (usd)"] },
  { field: "totalAmountThb", aliases: ["total amount (thb)"] },
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
