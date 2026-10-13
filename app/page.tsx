import { Book } from "@/components/Book";
import { CHAPTER_PAGES, JournalPages, PAGE_COUNT } from "@/components/JournalPages";
import { chapters, moreRepos, person } from "@/content/journal";
import { getRepoFacts } from "@/lib/github";

export default async function Home() {
  const repos = await getRepoFacts(person.githubHandle, moreRepos.map((r) => r.name));
  const ribbons = chapters.map((c) => ({ ...c, page: CHAPTER_PAGES[c.id as keyof typeof CHAPTER_PAGES] }));
  return (
    <Book pageCount={PAGE_COUNT} ribbons={ribbons} cv={person.cv}>
      <JournalPages repos={repos} />
    </Book>
  );
}
