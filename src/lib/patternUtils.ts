/**
 * Small regex-building helpers shared by the signal definitions in
 * `src/data/signals.ts`.
 *
 * Plain `\b` word-boundary anchors only recognize `[A-Za-z0-9_]` as "word"
 * characters, so they silently fail to bound Devanagari text: neither a
 * space nor a Devanagari letter is a `\w` character, so JS never sees a
 * word/non-word transition and `\b` matches nowhere. `wb()` below builds an
 * equivalent boundary using Unicode `\p{L}` / `\p{N}` lookaround instead,
 * which works uniformly for Latin, Devanagari, and mixed-script phrases.
 */

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Regex alternation of raw sub-pattern strings: `alt(['ab', 'c.d'])` -> `(?:ab|c.d)`. */
export function alt(items: string[]): string {
  return `(?:${items.join('|')})`
}

/** Regex alternation of literal (non-regex) strings/phrases, each escaped. */
export function altLiteral(items: string[]): string {
  return alt(items.map(escapeRegExp))
}

/**
 * Wraps a raw pattern string with a Unicode-aware word boundary and returns
 * a case-insensitive RegExp. Use this (instead of hand-written `\b...\b`)
 * for every new Hinglish/Hindi/Marathi signal pattern, since it behaves
 * correctly for Devanagari script as well as Latin/romanized text.
 */
export function wb(pattern: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${pattern})(?![\\p{L}\\p{N}])`, 'iu')
}
