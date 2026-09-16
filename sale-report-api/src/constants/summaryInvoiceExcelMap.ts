import { ColumnDef } from "./excelMap";

/**
 * CONFIRMED against the real SAP export ("summary-invoice-to-generate-report.xlsx"),
 * header row: #, Bill To, Bill To Address, Invoice Date, Delivery No,
 * Ship To Address, Invoice No, Item Code, Item Description, QTY, Unit Price,
 * Gross Total (Incl. VAT). Item Code/Item Description aren't mapped — the
 * report's column set (summaryInvoiceReportColumns.ts) has no place for them.
 *
 * ບັນຊີ.la's column map (BANCHI_LA_COLUMN_MAP in excelMap.ts) is reused
 * as-is: same source system, same invoice_number/vat_number shape.
 */
export const SAP_SUMMARY_INVOICE_COLUMN_MAP: ColumnDef[] = [
  { field: "invoiceNumber", aliases: ["invoice no"], required: true },
  { field: "invoiceDate", aliases: ["invoice date"] },
  { field: "deliveryNumber", aliases: ["delivery no"] },
  { field: "customerName", aliases: ["bill to"] },
  { field: "customerAddress", aliases: ["bill to address"] },
  { field: "shipToAddress", aliases: ["ship to address"] },
  { field: "qty", aliases: ["qty"] },
  { field: "unitPrice", aliases: ["unit price"] },
  { field: "grossTotalInclVat", aliases: ["gross total (incl. vat)"] },
];
