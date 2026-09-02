/** A single row read out of an uploaded workbook, keyed by our internal field names. */
export type RawRow = Record<string, string | number | null>;

/** Field names mirror the company's real report template (see reportColumns.ts) column-for-column. */
export interface SapB1Row {
  invoiceNumber: string;
  customerName: string | null;
  oilCategoryCode: string | null;
  oilTypeName: string | null;
  warehouse: string | null;
  customerTaxId: string | null;
  documentDate: string | null;
  deliveryDocNumber: string | null;
  soNumber: string | null;
  soDate: string | null;
  customerPo: string | null;
  quantityLiters: number | null;
  govPriceDate: string | null;
  govPriceRefNumber: string | null;
  govVatAllowance: number | null;
  govStructuredPrice: number | null;
  discount: number | null;
  grandTotalInclVat: number | null;
  [extra: string]: string | number | null;
}

export interface BanchiLaRow {
  invoiceNumber: string;
  /** ບັນຊີ.la's "vat_number" column — the ເລກທີບິນອາກອນ (tax invoice number) shown on the report. */
  taxInvoiceNumber: string | null;
  /** How many times this invoice's tax document was cancelled and reissued (0 = original); see dataMatcherService. */
  invoiceVersion: number;
  [extra: string]: string | number | null;
}

export interface MergedRow {
  invoiceNumber: string;
  matched: boolean;
  sap: Partial<SapB1Row> | null;
  banchi: Partial<BanchiLaRow> | null;
}

export interface ParseResult<T> {
  rows: T[];
  warnings: string[];
  totalRowsRead: number;
  skippedRows: number;
}
