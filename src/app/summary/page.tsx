import React from "react";
import { getArticleContent } from "../../lib/actions";
import DOMPurify from "isomorphic-dompurify";

export default async function Summary() {
  const url = "https://www.ole.com.ar";
  const result = await getArticleContent(url);

  if (result.error) {
    return <div>Error: {result.error}</div>;
  }

  if (!result.article) {
    return <div>No article content available</div>;
  }

  const { article } = result;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      {article.byline && <p className="text-gray-600 mb-2">{article.byline}</p>}
      {article.siteName && (
        <p className="text-gray-500 mb-4">Source: {article.siteName}</p>
      )}
      {article.lang && (
        <p className="text-gray-500 mb-4">Language: {article.lang}</p>
      )}
      <div
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content),
        }}
      />
    </div>
  );
}
