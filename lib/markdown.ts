import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

/**
 * Detects whether a string looks like Markdown (not already HTML).
 * Heuristic: if it doesn't start with an HTML tag but contains markdown
 * syntax like `#`, `**`, `![`, `|---|` etc.
 */
function looksLikeMarkdown(content: string): boolean {
  const trimmed = content.trimStart();
  if (/^<[a-z][\s\S]*>/i.test(trimmed)) return false; // starts with an HTML tag
  return /^#{1,6}\s|!\[|\*\*|\[.+\]\(|^\|.+\|/m.test(trimmed);
}

/**
 * Converts markdown to HTML when the content is detected as markdown.
 * Returns the original string unchanged if it's already HTML.
 */
export async function markdownToHtml(content: string): Promise<string> {
  if (!content) return '';
  if (!looksLikeMarkdown(content)) return content;

  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return String(result);
}
