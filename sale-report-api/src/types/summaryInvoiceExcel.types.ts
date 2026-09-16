import { MergedRow } from "./excel.types";

/**
 * One shipment/delivery line for the "Summary Invoice" (ໃບສະຫຼຸບອິນວອຍ) report
 * — a per-customer billing statement listing every shipment for that customer
 * within a period, ending in one grand total (see "summary invoice.jpeg" in
 * the project root for the reference template).
 *
 * CONFIRMED against the real SAP export ("summary-invoice-to-generate-report.xlsx"),
 * header row: #, Bill To, Bill To Address, Invoice Date, Delivery No,
 * Ship To Address, Invoice No, Item Code, Item Description, QTY, Unit Price,
 * Gross Total (Incl. VAT). Item Code/Item Description are read but not used —
 * the report keeps the original template's column set (see
 * summaryInvoiceReportColumns.ts), which has no place for them.
 */
export interface SapSummaryInvoiceRow {
  invoiceNumber: string;
  invoiceDate: string | null;
  deliveryNumber: string | null;
  customerName: string | null;
  /** Bill To Address — used in the per-customer "Bill To" header block, not shown as a table column. */
  customerAddress: string | null;
  /** Ship To Address — the template's "Location" column; can differ per shipment even for the same customer. */
  shipToAddress: string | null;
  qty: number | null;
  unitPrice: number | null;
  grossTotalInclVat: number | null;
  [extra: string]: string | number | null;
}

export type SummaryInvoiceMergedRow = MergedRow<SapSummaryInvoiceRow>;
