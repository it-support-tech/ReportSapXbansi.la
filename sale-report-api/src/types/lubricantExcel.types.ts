import { MergedRow } from "./excel.types";

/**
 * One product line from the lubricant SAP B1 export ("Lubricant-report X
 * Bansi.la.xlsx" — the real sample). Unlike the fuel report, one invoice
 * commonly has several product lines — each with its own item, packaging
 * unit/qty, and amounts — sharing one invoice header (customer, tax id,
 * delivery note, date). Unlike the fuel report, VAT and the grand total are
 * SAP-computed fields here too, not derived on our side.
 */
export interface SapLubricantRow {
  invoiceNumber: string;
  documentDate: string | null;
  soNumber: string | null;
  deliveryDocNumber: string | null;
  customerCode: string | null;
  customerName: string | null;
  customerTaxId: string | null;
  productCode: string | null;
  productDescription: string | null;
  unitPrice: number | null;
  qty: number | null;
  unit: string | null;
  literPerUnit: number | null;
  totalLiters: number | null;
  amountExclVat: number | null;
  vatAmount: number | null;
  grandTotalInclVat: number | null;
  amountThb: number | null;
  amountUsd: number | null;
  docCurrency: string | null;
  [extra: string]: string | number | null;
}

export type LubricantMergedRow = MergedRow<SapLubricantRow>;
