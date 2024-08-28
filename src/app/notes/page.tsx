import NewArticleForm from "../../components/forms/new-article-form";
import Sidebar from "../../components/sidebar/sidebar";
import getCloudNotes from "../../lib/helpers/get-cloud-notes";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    const notes = await getCloudNotes(userId);

    const serializedNotes = JSON.parse(JSON.stringify(notes));

    return (
      <div className="w-full sm:flex items-start">
        <aside className="self-start sticky top-0 w-80 z-30 hidden h-[calc(100vh)] shrink-0 sm:sticky sm:block">
          <Sidebar notes={serializedNotes} />
        </aside>
        <main className="flex-1 relative overflow-y-auto">
          <NewArticleForm showSubtext={true} label="Generate article" />
        </main>
      </div>
    );
  }
}
