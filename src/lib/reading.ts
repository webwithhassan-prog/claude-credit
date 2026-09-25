/** Estimated reading time in minutes for a Markdown body (~230 words per minute). */
export function readingMinutes(body: string): number {
  const words = body.replace(/[#>*_`\[\]()|-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
