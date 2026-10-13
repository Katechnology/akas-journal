export type RepoFacts = { name: string; language: string | null; updated: string | null };

/** Repo facts fetched once at build time (static export). Offline builds fall back to names only. */
export async function getRepoFacts(owner: string, names: readonly string[]): Promise<Record<string, RepoFacts>> {
  const out: Record<string, RepoFacts> = {};
  for (const name of names) out[name] = { name, language: null, updated: null };
  try {
    const res = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "force-cache",
    });
    if (!res.ok) return out;
    const repos = (await res.json()) as { name: string; language: string | null; pushed_at: string }[];
    for (const r of repos) {
      if (out[r.name]) out[r.name] = { name: r.name, language: r.language, updated: r.pushed_at?.slice(0, 7) ?? null };
    }
  } catch {
    /* offline build: keep names only */
  }
  return out;
}
