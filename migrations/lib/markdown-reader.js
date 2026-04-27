import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function loadAllMarkdown(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const filepath = path.join(dir, file);
    const raw = fs.readFileSync(filepath, 'utf8');
    const { data, content } = matter(raw);

    return {
      file,
      slug: file.replace(/\.md$/, ''),
      data,
      content: content.trim(),
    };
  });
}
