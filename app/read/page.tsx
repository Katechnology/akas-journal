import type { Metadata } from "next";
import Link from "next/link";
import { VoxelScene } from "@/components/VoxelScene";
import { about, education, experience, milestones, moreRepos, person, projects, skills } from "@/content/journal";

export const metadata: Metadata = {
  title: "Aka's Journal (read as a page) · Phan Quang Huy",
  description: "The full content of Aka's Journal as one accessible, scrolling page.",
};

/** The same journal as one plain scrolling article: for screen readers, search engines and quick readers. */
export default function ReadPage() {
  const { holo, embryo } = projects;
  return (
    <main className="read">
      <nav className="read-top">
        <Link href="/">← Back to the book</Link>
        <a href={person.cv} download>
          Download CV (PDF)
        </a>
      </nav>

      <header className="read-head">
        <p className="eyebrow">Aka&apos;s Journal · Vol. I</p>
        <h1>{person.name}</h1>
        <p className="read-role">{person.role}</p>
        <div className="read-fig">
          <VoxelScene name="hello" />
        </div>
      </header>

      <section id="about">
        <h2>I · About me</h2>
        <p className="lead">{about.summary}</p>
        {about.diary.map((d) => (
          <p key={d}>{d}</p>
        ))}
        <p>
          <strong>Daily tools:</strong> {about.tools.join(", ")}.
        </p>
        <p>
          <strong>Interested in:</strong> {about.interests}
        </p>
      </section>

      <section id="education">
        <h2>II · Education</h2>
        <ul className="read-list">
          {education.map((e) => (
            <li key={e.school}>
              <strong>{e.school}</strong> · {e.detail} <span className="muted">({e.years})</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience">
        <h2>III · Experience</h2>
        {experience.map((x) => (
          <article key={x.id}>
            <h3>
              {x.role}, {x.company} <span className="muted">· {x.dates}</span>
            </h3>
            <ul className="read-list">
              {x.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="toolbox">
        <h2>IV · Toolbox</h2>
        <ul className="read-list">
          {skills.map((g) => (
            <li key={g.group}>
              <strong>{g.group}:</strong> {g.items.map((i) => (i.note ? `${i.name} (${i.note})` : i.name)).join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <section id="milestones">
        <h2>V · Milestones</h2>
        <ul className="read-list">
          {milestones.map((m) => (
            <li key={m.stamp}>
              <strong>{m.title}</strong>: {m.detail}{" "}
              {"paper" in m ? (
                <a href={m.paper.url} target="_blank" rel="noopener noreferrer">
                  {m.paper.title}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="portfolio">
        <h2>VI · Portfolio</h2>
        <article>
          <h3>
            <a href={holo.url} target="_blank" rel="noopener noreferrer">
              {holo.name}
            </a>
          </h3>
          <p>{holo.tagline}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="read-img" src={holo.poster} alt="The Thunder Meow holographic card" />
          <ul className="read-list">
            {holo.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p>
            Built with {holo.stack.join(", ")}.
          </p>
        </article>
        <article>
          <h3>
            <a href={embryo.url} target="_blank" rel="noopener noreferrer">
              {embryo.title}
            </a>
          </h3>
          <p>{embryo.abstract}</p>
          <p>
            <strong>My part:</strong> {embryo.role}
          </p>
          <p>
            Baselines: {embryo.baselines.join(", ")}. Final approach: {embryo.final.join(" + ")}.
          </p>
          <p className="muted">Authors: {embryo.authors}.</p>
        </article>
        <article>
          <h3>More on GitHub</h3>
          <ul className="read-list">
            {moreRepos.map((r) => (
              <li key={r.name}>
                <a href={`${person.github}/${r.name}`} target="_blank" rel="noopener noreferrer">
                  {r.name}
                </a>
                : {r.note}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section id="epilogue">
        <h2>Epilogue</h2>
        <p>Let&apos;s write the next chapter. If you are building something with AI, data or automation, I would love to hear about it.</p>
        <p>
          <a href={`mailto:${person.email}`}>{person.email}</a> ·{" "}
          <a href={person.github} target="_blank" rel="noopener noreferrer">
            github.com/{person.githubHandle}
          </a>
        </p>
      </section>
    </main>
  );
}
