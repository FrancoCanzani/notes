import Editor from '../../../../../components/editor/editor';

export default async function Page({ params }: { params: { slug: string } }) {
  const noteId = params.slug[0];

  return (
    <main>
      <Editor noteId={noteId} />
    </main>
  );
}
