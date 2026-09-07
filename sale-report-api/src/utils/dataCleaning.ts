/**
 * Trims, collapses internal whitespace, and normalizes case for use as a join
 * key. Also strips:
 *  - a leading "IN-" — ບັນຊີ.la's invoice_number carries that prefix (e.g.
 *    "IN-126080108") while SAP's AR Invoice No is the bare number
 *    ("126080108").
 *  - a trailing re-issue marker — when a tax invoice in ບັນຊີ.la is
 *    cancelled and redone against the same original invoice, staff append
 *    something to tell the copies apart: "IN-126080108.", "IN-126080108..",
 *    "IN-126080108-1", "IN-126080108-2", etc. SAP only ever has the original
 *    bare number, so all of those must normalize back down to it.
 */
export const cleanInvoiceNumber = (value: unknown): string => {
  let cleaned = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
  if (cleaned.startsWith("IN-")) cleaned = cleaned.slice(3);
  cleaned = cleaned.replace(/\.+$/, ""); // trailing "." / ".." re-issue marker
  cleaned = cleaned.replace(/-\d+$/, ""); // trailing "-1" / "-2" re-issue marker
  return cleaned;
};

/**
 * Reads the re-issue marker off a RAW (pre-clean) invoice_number, e.g.
 * "IN-126080007." -> 1, "IN-126080253-02" -> 2, "IN-126080108" -> 0. Higher
 * means a more recent redo — when ບັນຊີ.la has multiple rows for the same
 * base invoice (original cancelled + one or more redone copies), the row
 * with the highest version is the currently-valid one, NOT whichever row
 * happens to come last in the file.
 */
export const getInvoiceReissueVersion = (value: unknown): number => {
  let raw = String(value ?? "").trim().replace(/\s+/g, "").toUpperCase();
  if (raw.startsWith("IN-")) raw = raw.slice(3); // strip first, or its "-" gets mistaken for a "-N" marker
  const dotMatch = raw.match(/\.+$/);
  if (dotMatch) return dotMatch[0].length;
  const dashMatch = raw.match(/-(\d+)$/);
  if (dashMatch) return Number(dashMatch[1]);
  return 0;
};

export const isBlank = (value: unknown): boolean =>
  value === null || value === undefined || String(value).trim() === "";

export const toNullableString = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  return String(value).trim();
};

export const toNullableNumber = (value: unknown): number | null => {
  if (isBlank(value)) return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
};
