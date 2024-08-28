import React, { Suspense } from "react";
import ArticleContent from "@/components/article-content";
import ArticleSkeleton from "@/components/skeletons/article-skeleton";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import NewArticleForm from "@/components/forms/new-article-form";

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

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let url = searchParams?.url as string;

  if (!url) {
    return (
      <div className="max-w-3xl mx-auto text-center font-medium w-full px-4 py-8">
        Error: No URL provided
      </div>
    );
  }

  url = ensureHttpProtocol(url);

  if (!isValidUrl(url)) {
    return (
      <div className="max-w-3xl mx-auto text-center font-medium w-full px-4 py-8">
        Error: Invalid URL provided
      </div>
    );
  }

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link
          href={"/notes"}
          className="flex text-xs w-full items-center text-gray-500 justify-start"
        >
          <ArrowLeft size={12} className="mr-1" />{" "}
          <span className="hover:underline">Back to notes</span>
        </Link>
        <ArticleContent url={url} />
        <Separator className="bg-gray-300 opacity-45 h-[0.5px]" />
        <NewArticleForm showSubtext={false} label="Continue reading" />
      </div>
    </Suspense>
  );
}
