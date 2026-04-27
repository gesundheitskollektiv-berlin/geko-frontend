import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Load a directory of `{slug}.{locale}.md` files and group them by slug.
 *
 * Returns: { [slug]: { [locale]: { data, content } } }
 *
 * Files whose locale is not in the allowed list are ignored.
 * Files that fail to parse (malformed YAML) are skipped with a warning,
 * without affecting other locales of the same slug.
 */
export function loadLocalizedEntries(dir, locales) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const entries = {};

  for (const file of files) {
    const match = file.match(/^(.*)\.([a-z]{2})\.md$/);
    if (!match) continue;

    const [, slug, locale] = match;
    if (!locales.includes(locale)) continue;

    const filepath = path.join(dir, file);
    try {
      const raw = fs.readFileSync(filepath, 'utf8');
      const { data, content } = matter(raw);

      if (!entries[slug]) entries[slug] = {};
      entries[slug][locale] = { data, content: content.trim() };
    } catch (err) {
      console.warn(`  ⚠ Skipped ${file}: ${err.message}`);
    }
  }

  return entries;
}
