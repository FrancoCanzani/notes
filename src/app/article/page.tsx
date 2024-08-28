import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { getArticleContent } from "../../lib/helpers/get-article-content";
import { Link } from "@phosphor-icons/react/dist/ssr";

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function ensureHttpProtocol(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let url = searchParams?.url as string;

  if (!url) {
    return <div>Error: No URL provided</div>;
  }

  url = ensureHttpProtocol(url);

  if (!isValidUrl(url)) {
    return <div>Error: Invalid URL provided</div>;
  }

  const result = await getArticleContent(url);

  if (result.error) {
    return <div>Error: {result.error}</div>;
  }

  if (!result.article) {
    return <div>No article content available</div>;
  }

  const { article } = result;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      {article.byline && <p className="text-gray-600 mb-2">{article.byline}</p>}
      <a
        href={url}
        target="_blank"
        className="text-gray-500 mb-2 flex items-center justify-start gap-x-1"
      >
        <Link size={14} />{" "}
        <span className="hover:underline">{new URL(url).hostname}</span>
      </a>
      <article
        className="prose lg:prose-lg prose-img:rounded-sm"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content),
        }}
      />
    </div>
  );
}
