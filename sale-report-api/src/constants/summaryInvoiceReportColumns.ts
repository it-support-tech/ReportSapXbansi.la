import { SummaryInvoiceMergedRow } from "../types/summaryInvoiceExcel.types";

export type SummaryInvoiceCellValue = string | number | null;

export interface SummaryInvoiceColumnDef {
  header: string;
  key: string;
  width: number;
  numFmt?: string;
  align?: "left" | "center" | "right";
  getValue: (row: SummaryInvoiceMergedRow, indexInGroup: number) => SummaryInvoiceCellValue;
}

/**
 * Column layout matches the original "summary invoice.jpeg" template exactly
 * (kept as-is per instruction — headers do NOT follow the SAP export's own
 * wording). Columns with no source in the real SAP export are kept in the
 * layout and just left blank, rather than removed:
 *  - "Shipment Date": SAP only has one date ("Invoice Date", used for "Sale
 *    Date") — no separate shipment date exists.
 *  - "Truck No": not in the SAP export at all.
 *  - "Unit" (车数 — trip/vehicle count): no SAP source; defaults to 1 per row.
 *  - "Units" (升数 — delivered qty): SAP has only one QTY figure, so this
 *    mirrors "Order Qty" rather than being left blank.
 * Every customer's shipments are listed flat (one row per shipment line)
 * inside that customer's own worksheet (see
 * reportGeneratorSummaryInvoiceService.ts).
 */
export const SUMMARY_INVOICE_REPORT_COLUMNS: SummaryInvoiceColumnDef[] = [
  { header: "NO", key: "no", width: 5, align: "center", getValue: (_r, i) => i + 1 },
  { header: "Sale Date", key: "saleDate", width: 10, align: "center", getValue: (r) => r.sap?.invoiceDate ?? null },
  { header: "Shipment Date", key: "shipmentDate", width: 10, align: "center", getValue: () => null },
  { header: "Shipment No", key: "shipmentNumber", width: 11, align: "center", getValue: (r) => r.sap?.deliveryNumber ?? null },
  { header: "Location", key: "destination", width: 22, getValue: (r) => r.sap?.shipToAddress ?? null },
  { header: "Truck No", key: "truckNo", width: 10, align: "center", getValue: () => null },
  { header: "Tax Inv No", key: "taxInvoiceNumber", width: 13, getValue: (r) => r.banchi?.taxInvoiceNumber ?? null },
  { header: "Invoice", key: "invoiceNumber", width: 12, getValue: (r) => r.invoiceNumber },
  { header: "Unit 车数", key: "unitCount", width: 7, numFmt: "#,##0", align: "right", getValue: () => 1 },
  { header: "Order Qty", key: "orderQty", width: 11, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.qty ?? null },
  { header: "Units 升数", key: "deliveredQty", width: 11, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.qty ?? null },
  { header: "Cost Per Unit 单价", key: "costPerUnit", width: 12, numFmt: "#,##0.0000", align: "right", getValue: (r) => r.sap?.unitPrice ?? null },
  { header: "Amount 金额", key: "amount", width: 14, numFmt: "#,##0", align: "right", getValue: (r) => r.sap?.grossTotalInclVat ?? null },
];
