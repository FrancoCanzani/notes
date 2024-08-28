import DOMPurify from 'isomorphic-dompurify';
import { Link } from '@phosphor-icons/react/dist/ssr';
import { getArticleContent } from '@/lib/helpers/get-article-content';

interface Article {
  title: string;
  content: string;
  byline: string | null;
}

interface ArticleResult {
  article?: Article;
  error?: string;
}

export default async function ArticleContent({ url }: { url: string }) {
  const result = await getArticleContent(url);

  if (result.error) {
    return (
      <div className='max-w-3xl mx-auto text-center font-medium w-full px-4 py-8'>
        Error: {result.error}
      </div>
    );
  }

  if (!result.article) {
    return (
      <div className='max-w-3xl mx-auto text-center font-medium w-full px-4 py-8'>
        No article content available
      </div>
    );
  }

  const { article } = result;

  return (
    <div className='max-w-3xl mx-auto px-4 pt-8'>
      <h1 className='text-3xl font-bold mb-4'>{article.title}</h1>
      {article.byline && <p className='text-gray-600 mb-2'>{article.byline}</p>}
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-gray-500 mb-2 flex items-center justify-start gap-x-1'
      >
        <Link size={14} />{' '}
        <span className='hover:underline'>{new URL(url).hostname}</span>
      </a>
      <article
        className='prose prose-img:rounded-sm'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content),
        }}
      />
    </div>
  );
}
