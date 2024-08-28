import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  textContent: z.string(),
  length: z.number(),
  siteName: z.string(),
  byline: z.string().nullable(),
  dir: z.string().nullable(),
  lang: z.string().nullable(),
});

type Article = z.infer<typeof ArticleSchema>;

interface ArticleResponse {
  article?: Article;
  error?: string;
}

function fixImageSources(doc: Document, url: string) {
  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("/")) {
      img.setAttribute("src", new URL(src, url).toString());
    }
  });
}

function fixLinks(doc: Document, url: string) {
  doc.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("/")) {
      a.setAttribute("href", new URL(href, url).toString());
    }
  });
}

function preserveVideos(doc: Document) {
  const videos = doc.querySelectorAll(
    'video, iframe[src*="youtube.com"], iframe[src*="vimeo.com"]'
  );
  videos.forEach((video) => {
    video.setAttribute("data-preserve", "true");
  });
}

function reinsertVideos(content: string): string {
  const tempDoc = new JSDOM(content).window.document;
  const preservedVideos = tempDoc.querySelectorAll('[data-preserve="true"]');
  preservedVideos.forEach((video) => {
    video.removeAttribute("data-preserve");
  });
  return tempDoc.body.innerHTML;
}

export async function getArticleContent(url: string): Promise<ArticleResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    fixImageSources(doc, url);
    fixLinks(doc, url);
    preserveVideos(doc);

    const reader = new Readability(doc);
    const article = reader.parse();

    if (!article) {
      throw new Error("Failed to extract article content");
    }

    const processedContent = reinsertVideos(article.content || "");

    const articleData: Article = {
      title: article.title || "",
      content: processedContent,
      textContent: article.textContent || "",
      length: article.textContent?.length || 0,
      siteName: article.siteName || new URL(url).hostname,
      byline: article.byline || null,
      dir: article.dir || null,
      lang: article.lang || null,
    };

    const validatedArticle = ArticleSchema.parse(articleData);

    return { article: validatedArticle };
  } catch (err) {
    console.error(`Error fetching article: ${err}`);
    let errorMessage: string;

    if (err instanceof z.ZodError) {
      errorMessage = "Article data validation failed";
    } else if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    return { error: errorMessage };
  } finally {
    clearTimeout(timeoutId);
  }
}
