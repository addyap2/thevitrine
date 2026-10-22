// Light anti-harvesting for phone numbers. A number is stored reversed and
// base64-encoded, and only decoded in the visitor's browser once they tap a
// button, so it never appears in the HTML or in this public repository as
// plain digits. It isn't encryption: it keeps numbers away from the bots that
// scrape pages and code for contact details.
//
// To encode a number (international digits, no + or spaces):
//   node -e 'console.log(Buffer.from("33612345678".split("").reverse().join("")).toString("base64"))'

export const decodeNumber = (encoded: string) => atob(encoded).split("").reverse().join("");

/** "33612345678" → "+33 6 12 34 56 78" (French numbers); others get a plain "+". */
export const formatPhone = (digits: string) =>
  digits.startsWith("33") && digits.length === 11
    ? `+33 ${digits[2]} ${digits.slice(3).match(/../g)!.join(" ")}`
    : `+${digits}`;
