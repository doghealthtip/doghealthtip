export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

/**
 * Extracts H2 and H3 headings from HTML content string or sections
 * and injects unique ID attributes if they are missing.
 */
export function extractHeadingsAndInjectIds(htmlContent: string): {
  processedHtml: string;
  headings: TocItem[];
} {
  if (!htmlContent) {
    return { processedHtml: '', headings: [] };
  }

  const headings: TocItem[] = [];
  let index = 0;

  // Regex to match <h2>...</h2> and <h3>...</h3>
  const headingRegex = /<(h[23])(\s+[^>]*)?>(.*?)<\/\1>/gi;

  const processedHtml = htmlContent.replace(headingRegex, (match, tag, attrs, text) => {
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;
    // Strip inner HTML tags from title text
    const cleanTitle = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanTitle) return match;

    // Check if ID already exists in attributes
    let id = '';
    if (attrs) {
      const idMatch = attrs.match(/id=["']([^"']+)["']/i);
      if (idMatch) {
        id = idMatch[1];
      }
    }

    if (!id) {
      // Create slugified id from title
      id = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `heading-${index}`;
      id = `${id}-${index}`;
    }

    headings.push({
      id,
      title: cleanTitle,
      level,
    });

    index++;

    // Ensure id attribute is present on heading tag
    if (attrs && attrs.includes('id=')) {
      return match;
    }

    const cleanAttrs = attrs ? attrs.trim() : '';
    return `<${tag} id="${id}" ${cleanAttrs} class="${level === 2 ? 'font-serif text-2xl font-bold text-[#1c1c16] mt-8 mb-4' : 'font-serif text-xl font-bold text-[#24451F] mt-6 mb-3'} scroll-mt-24">${text}</${tag}>`;
  });

  return { processedHtml, headings };
}
