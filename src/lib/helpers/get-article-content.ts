"use server";

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

const USER_AGENTS = {
  default:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  googlebot:
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  bingbot:
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
};

const REFERERS = [
  "https://www.google.com/",
  "https://www.facebook.com/",
  "https://t.co/x?amp=1",
];

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

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryFetchWithUserAgents(url: string): Promise<string> {
  for (const [name, userAgent] of Object.entries(USER_AGENTS)) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          headers: { "User-Agent": userAgent },
        },
        15000
      );
      return await response.text();
    } catch (error) {
      console.log(`Failed to fetch with ${name} user agent:`, error);
    }
  }
  throw new Error("Failed to fetch content with all user agents");
}

async function tryFetchWithReferers(url: string): Promise<string> {
  for (const referer of REFERERS) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          headers: {
            "User-Agent": USER_AGENTS.default,
            Referer: referer,
          },
        },
        15000
      );
      return await response.text();
    } catch (error) {
      console.log(`Failed to fetch with referer ${referer}:`, error);
    }
  }
  throw new Error("Failed to fetch content with all referers");
}

async function tryFetchFromArchives(url: string): Promise<string> {
  const archives = [
    `https://web.archive.org/web/2/${url}`,
    `https://archive.is/latest/${url}`,
    `https://webcache.googleusercontent.com/search?q=cache:${url}`,
  ];

  for (const archiveUrl of archives) {
    try {
      const response = await fetchWithTimeout(
        archiveUrl,
        {
          headers: { "User-Agent": USER_AGENTS.default },
        },
        20000
      );
      return await response.text();
    } catch (error) {
      console.log(`Failed to fetch from archive ${archiveUrl}:`, error);
    }
  }
  throw new Error("Failed to fetch content from all archives");
}

export async function getArticleContent(url: string): Promise<ArticleResponse> {
  try {
    let html: string;

    // Try different methods to fetch the content
    try {
      html = await tryFetchWithUserAgents(url);
    } catch (error) {
      console.log("Failed with user agents, trying referers");
      try {
        html = await tryFetchWithReferers(url);
      } catch (error) {
        console.log("Failed with referers, trying archives");
        html = await tryFetchFromArchives(url);
      }
    }

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
    let errorMessage: string;

    if (err instanceof z.ZodError) {
      errorMessage = "Article data validation failed";
      console.error("Zod validation errors:", JSON.stringify(err.errors));
    } else if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    return { error: errorMessage };
  }
}
