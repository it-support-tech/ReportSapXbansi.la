import { ColumnDef } from "./excelMap";

/**
 * All aliases below are CONFIRMED against the real lubricant SAP B1 export
 * ("Lubricant-report X Bansi.la.xlsx"), header row: #, Invoice Date,
 * Invoice No, SO No, Delivery Note No, Customer Code, Customer Name, Tax ID,
 * Product Code, Description, Unit Price, Qty, Unit, Liter Per Unit,
 * Total Liters, Amount Excl. VAT (LAK), VAT Amount (LAK),
 * Amount Incl. VAT (Grand Total LAK), Amount (THB), Amount (USD),
 * Doc Currency.
 *
 * ບັນຊີ.la's column map (BANCHI_LA_COLUMN_MAP in excelMap.ts) is reused
 * as-is: same source system, same invoice_number/vat_number shape.
 */
export const SAP_LUBRICANT_COLUMN_MAP: ColumnDef[] = [
  { field: "invoiceNumber", aliases: ["invoice no"], required: true },
  { field: "documentDate", aliases: ["invoice date"] },
  { field: "soNumber", aliases: ["so no"] },
  { field: "deliveryDocNumber", aliases: ["delivery note no"] },
  { field: "customerCode", aliases: ["customer code"] },
  { field: "customerName", aliases: ["customer name"] },
  { field: "customerTaxId", aliases: ["tax id"] },
  { field: "productCode", aliases: ["product code"] },
  { field: "productDescription", aliases: ["description"] },
  { field: "unitPrice", aliases: ["unit price"] },
  { field: "qty", aliases: ["qty"] },
  { field: "unit", aliases: ["unit"] },
  { field: "literPerUnit", aliases: ["liter per unit"] },
  { field: "totalLiters", aliases: ["total liters"] },
  { field: "amountExclVat", aliases: ["amount excl. vat (lak)"] },
  { field: "vatAmount", aliases: ["vat amount (lak)"] },
  { field: "grandTotalInclVat", aliases: ["amount incl. vat (grand total lak)"] },
  { field: "amountThb", aliases: ["amount (thb)"] },
  { field: "amountUsd", aliases: ["amount (usd)"] },
  { field: "docCurrency", aliases: ["doc currency"] },
];
