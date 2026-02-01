/**
 * Cleans HTML content to plain text.
 */
export function cleanHtmlContent(html: string): string {
  if (!html) return "";

  let text = html
    // Remove scripts and styles first
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    // Remove structural elements that might contain navigation/footer noise
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    // Replace <br> and block elements with newlines
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    // Remove all other tags
    .replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));

  // Collapse multiple whitespace/newlines
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Fetches page content and returns cleaned text.
 */
export async function fetchAndCleanPage(url: string, maxLength = 8000): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TenderBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`Fetch failed for ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const text = cleanHtmlContent(html);
    return text.slice(0, maxLength);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}
