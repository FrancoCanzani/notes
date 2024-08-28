import React, { Suspense } from 'react';
import ArticleContent from '@/components/article-content';
import ArticleSkeleton from '@/components/skeletons/article-skeleton';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Separator } from '@/components/ui/separator';
import NewArticleForm from '@/components/forms/new-article-form';

export const maxDuration = 60;

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let url = searchParams?.url as string;

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <div className='max-w-3xl mx-auto px-4 pt-8'>
        <Link
          href={'/notes'}
          className='flex text-xs w-full items-center text-gray-500 justify-start'
        >
          <ArrowLeft size={12} className='mr-1' />{' '}
          <span className='hover:underline'>Back to notes</span>
        </Link>
        <ArticleContent url={url} />
        <Separator className='bg-gray-300 opacity-45 h-[0.5px]' />
        <NewArticleForm showSubtext={false} label='Continue reading' />
      </div>
    </Suspense>
  );
}
