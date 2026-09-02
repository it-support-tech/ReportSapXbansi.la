import { BanchiLaRow, MergedRow, SapB1Row } from "../types/excel.types";
import { MatchSummary } from "../types/report.types";

/**
 * Left-joins SAP B1 rows with ບັນຊີ.la rows on invoiceNumber. SAP is the
 * driving dataset (the report is "the SAP sales lines"); ບັນຊີ.la only
 * enriches each SAP row with its tax invoice number when one matches — a
 * ບັນຊີ.la row with no matching SAP invoice contributes nothing to the
 * report (it's outside this SAP export's scope), but is still counted in
 * `unmatchedBanchi` so a large number is visible as a possible data issue.
 *
 * A cancelled-and-reissued tax invoice can leave more than one ບັນຊີ.la row
 * under the same base invoice number (e.g. "126080007" and "126080007.").
 * The row with the highest `invoiceVersion` is the current one — NOT
 * whichever row happens to come last in the file — so duplicates are
 * resolved by version, keeping the first-seen row on a tie.
 */
export const matchInvoices = (
  sapRows: SapB1Row[],
  banchiRows: BanchiLaRow[]
): { rows: MergedRow[]; summary: MatchSummary } => {
  const banchiByInvoice = new Map<string, BanchiLaRow>();
  for (const row of banchiRows) {
    const existing = banchiByInvoice.get(row.invoiceNumber);
    if (!existing || row.invoiceVersion > existing.invoiceVersion) {
      banchiByInvoice.set(row.invoiceNumber, row);
    }
  }

  const matchedBanchiInvoices = new Set<string>();
  const rows: MergedRow[] = [];

  for (const sap of sapRows) {
    const banchi = banchiByInvoice.get(sap.invoiceNumber) ?? null;
    if (banchi) matchedBanchiInvoices.add(sap.invoiceNumber);
    rows.push({
      invoiceNumber: sap.invoiceNumber,
      matched: banchi !== null,
      sap,
      banchi,
    });
  }

  const summary: MatchSummary = {
    totalSap: sapRows.length,
    totalBanchi: banchiRows.length,
    matched: matchedBanchiInvoices.size,
    unmatchedSap: sapRows.length - matchedBanchiInvoices.size,
    unmatchedBanchi: banchiRows.length - matchedBanchiInvoices.size,
  };

  return { rows, summary };
};
