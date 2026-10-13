import type { ReactNode } from "react";
import { VoxelScene } from "./VoxelScene";
import { about, education, experience, milestones, moreRepos, person, projects, skills } from "@/content/journal";
import type { RepoFacts } from "@/lib/github";

/** Page index of each chapter's first page (cover = 0). Kept next to the layout that defines it. */
export const CHAPTER_PAGES = {
  prologue: 1,
  about: 3,
  education: 5,
  experience: 7,
  toolbox: 11,
  milestones: 13,
  portfolio: 15,
  epilogue: 20,
} as const;
export const PAGE_COUNT = 22;

type PageProps = {
  n: number;
  chapter: string;
  head?: string;
  scene?: string;
  className?: string;
  children: ReactNode;
};

function Page({ n, chapter, head, scene, className = "", children }: PageProps) {
  const side = n % 2 === 1 ? "left" : "right";
  return (
    <div className={`page paper ${side} ${className}`} data-page={n} data-chapter={chapter}>
      <div className="pg">
        {head ? <div className="run">{head}</div> : null}
        <div className="pg-body">{children}</div>
        {scene ? (
          <div className="pg-fig ink">
            <VoxelScene name={scene} />
          </div>
        ) : null}
        <div className="folio">{n}</div>
      </div>
    </div>
  );
}

export function JournalPages({ repos }: { repos: Record<string, RepoFacts> }) {
  const [seal, keppel] = experience;
  const [langs, ai, auto, ml] = skills;
  const [hack, paper, prize] = milestones;
  const { holo, embryo } = projects;

  return (
    <>
      {/* 0 · Front cover */}
      <div className="page cover-front" data-density="hard" data-page={0} data-chapter="cover">
        <div className="cover-art">
          <div className="cover-frame">
            <div className="cover-vol">VOL. I · {person.years}</div>
            <div className="cover-orn" />
            <h1 className="cover-title">
              Aka&apos;s
              <br />
              Journal
            </h1>
            <div className="cover-orn" />
            <div className="cover-name">{person.name.toUpperCase()}</div>
            <div className="cover-role">{person.role}</div>
          </div>
          <div className="cover-ribbon" />
        </div>
      </div>

      {/* 1 · Bookplate */}
      <Page n={1} chapter="prologue" scene="hello" className="endpaper">
        <div className="plate ink">
          <p className="hand">This journal belongs to</p>
          <p className="plate-name">{person.name}</p>
          <p className="plate-role">{person.role}</p>
          <p className="plate-aka">a.k.a. {person.nickname}</p>
        </div>
      </Page>

      {/* 2 · Contents */}
      <Page n={2} chapter="prologue" head="Contents" scene="signpost">
        <h2 className="ink">Contents</h2>
        <ol className="toc">
          {(
            [
              ["I", "About me", "about"],
              ["II", "Education", "education"],
              ["III", "Experience", "experience"],
              ["IV", "Toolbox", "toolbox"],
              ["V", "Milestones", "milestones"],
              ["VI", "Portfolio", "portfolio"],
              ["", "Epilogue", "epilogue"],
            ] as const
          ).map(([num, title, id]) => (
            <li key={id} className="ink">
              <a href={`#${id}`} data-goto={CHAPTER_PAGES[id]}>{`${num ? num + " · " : ""}${title} ··· ${CHAPTER_PAGES[id]}`}</a>
            </li>
          ))}
        </ol>
        <p className="hand ink">Turn a corner, use ← →, or tap a ribbon.</p>
      </Page>

      {/* 3 · About: diary entry */}
      <Page n={3} chapter="about" head="I · About me" scene="laptop">
        <h2 className="ink">I · About me</h2>
        <div className="polaroid ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/aka-portrait.jpg" alt="Portrait of Phan Quang Huy" width={288} height={384} />
          <span className="hand">me, {person.nickname}</span>
        </div>
        <p className="lead ink">{about.summary}</p>
        <p className="ink">{about.diary[0]}</p>
      </Page>

      {/* 4 · About: today */}
      <Page n={4} chapter="about" head="I · About me" scene="workflow">
        <p className="hand ink">These days I call myself</p>
        <p className="big ink">{person.role}</p>
        <p className="ink">{about.diary[1]}</p>
        <p className="label ink">My daily tools</p>
        <p className="chips ink">
          {about.tools.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </p>
        <p className="margin-note hand ink">Interested in: {about.interests}</p>
      </Page>

      {/* 5 · Education */}
      <Page n={5} chapter="education" head="II · Education" scene="graduate">
        <h2 className="ink">II · Education</h2>
        <div className="stub ink">
          <span className="stub-years">{education[0].years}</span>
          <strong>{education[0].school}</strong>
          <span>{education[0].detail}</span>
        </div>
        <p className="hand ink">Where the computer science started.</p>
      </Page>

      {/* 6 · Education continued */}
      <Page n={6} chapter="education" head="II · Education" scene="tree">
        <div className="certificate ink">
          <span className="cert-kicker">Certificate</span>
          <strong>{education[1].detail}</strong>
          <span>{education[1].school}</span>
          <span className="stub-years">{education[1].years}</span>
        </div>
        <div className="stub small ink">
          <span className="stub-years">{education[2].years}</span>
          <strong>{education[2].school}</strong>
        </div>
      </Page>

      {/* 7 · Seal Labs: field notes */}
      <Page n={7} chapter="experience" head="III · Experience" scene="robot">
        <h2 className="ink">III · Experience</h2>
        <p className="role ink">
          <strong>{seal.role}</strong> · {seal.company}
          <span className="date">{seal.dates}</span>
        </p>
        <ul className="log">
          <li className="ink">{seal.notes[0]}</li>
          <li className="ink">{seal.notes[1]}</li>
        </ul>
      </Page>

      {/* 8 · Seal Labs: on-chain sketch */}
      <Page n={8} chapter="experience" head={`III · ${seal.company}`} scene="onchain">
        <ul className="log">
          <li className="ink">{seal.notes[2]}</li>
          <li className="ink">{seal.notes[3]}</li>
        </ul>
        <p className="label ink">{seal.sketch.title}</p>
        <p className="chips ink">
          {seal.sketch.items.map((t) => (
            <span key={t} className="chip blue">
              {t}
            </span>
          ))}
        </p>
      </Page>

      {/* 9 · Keppel Land: field notes */}
      <Page n={9} chapter="experience" head="III · Experience" scene="feedback">
        <p className="role ink">
          <strong>{keppel.role}</strong>
          <span className="company">{keppel.company}</span>
          <span className="date">{keppel.dates}</span>
        </p>
        <ul className="log">
          {keppel.notes.map((t) => (
            <li key={t} className="ink">
              {t}
            </li>
          ))}
        </ul>
      </Page>

      {/* 10 · Keppel Land: loop sketch */}
      <Page n={10} chapter="experience" head={`III · ${keppel.company}`} scene="crates">
        <p className="label ink">{keppel.sketch.title}</p>
        <ol className="loop">
          {keppel.sketch.items.map((t, i) => (
            <li key={t} className="ink">
              <span>{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="hand ink">Listening first, then fixing what people actually feel.</p>
      </Page>

      {/* 11 · Toolbox */}
      <Page n={11} chapter="toolbox" head="IV · Toolbox" scene="craft">
        <h2 className="ink">IV · Toolbox</h2>
        {[langs, ai].map((g) => (
          <div key={g.group} className="pocket ink">
            <p className="label">{g.group}</p>
            {g.items.map((it) => (
              <p key={it.name} className="tool">
                <span>{it.name}</span>
                {it.note ? <em className="hand">{it.note}</em> : null}
              </p>
            ))}
          </div>
        ))}
      </Page>

      {/* 12 · Toolbox continued */}
      <Page n={12} chapter="toolbox" head="IV · Toolbox" scene="wrench">
        {[auto, ml].map((g) => (
          <div key={g.group} className="pocket ink">
            <p className="label">{g.group}</p>
            {g.items.map((it) => (
              <p key={it.name} className="tool">
                <span>{it.name}</span>
                {it.note ? <em className="hand">{it.note}</em> : null}
              </p>
            ))}
          </div>
        ))}
        <p className="hand ink">Build, train, automate. Repeat.</p>
      </Page>

      {/* 13 · Milestones */}
      <Page n={13} chapter="milestones" head="V · Milestones" scene="trophy">
        <h2 className="ink">V · Milestones</h2>
        {[hack, prize].map((m) => (
          <div key={m.stamp} className="milestone ink">
            <span className="stamp">{m.stamp}</span>
            <div>
              <strong>{m.title}</strong>
              <span>{m.detail}</span>
            </div>
          </div>
        ))}
      </Page>

      {/* 14 · Milestones: the paper */}
      <Page n={14} chapter="milestones" head="V · Milestones" scene="scroll">
        <div className="milestone ink">
          <span className="stamp">{paper.stamp}</span>
          <div>
            <strong>{paper.title}</strong>
            <span>{paper.detail}</span>
          </div>
        </div>
        <p className="paper-title ink">
          <a href={paper.paper.url} target="_blank" rel="noopener noreferrer">
            {paper.paper.title}
          </a>
        </p>
        <p className="hand ink">Segmentation helping classification: one network, two tasks.</p>
      </Page>

      {/* 15 · Portfolio: how the holo card is made */}
      <Page n={15} chapter="portfolio" head="VI · Portfolio" scene="layers">
        <h2 className="ink">VI · Portfolio</h2>
        <p className="proj-name ink">{holo.name}</p>
        <p className="ink">{holo.tagline}</p>
        <p className="label ink">How it&apos;s made: five layers</p>
        <ol className="layers">
          {holo.layers.map((l, i) => (
            <li key={l} className="ink" style={{ ["--i" as string]: i }}>
              {l}
            </li>
          ))}
        </ol>
      </Page>

      {/* 16 · Portfolio: the card */}
      <Page n={16} chapter="portfolio" head={`VI · ${holo.name}`} scene="holo">
        <div className="taped ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={holo.poster} alt="The Thunder Meow holographic card, tilted under the pointer" />
        </div>
        <ul className="feat">
          {holo.features.slice(1, 2).map((f) => (
            <li key={f} className="ink">
              {f}
            </li>
          ))}
        </ul>
        <p className="actions ink">
          <a className="btn-ink" href={holo.url} target="_blank" rel="noopener noreferrer">
            See it on GitHub
          </a>
        </p>
      </Page>

      {/* 17 · Portfolio: embryo, lab notebook */}
      <Page n={17} chapter="portfolio" head="VI · Portfolio" scene="microscope">
        <p className="proj-name ink">Embryo quality, deep learning</p>
        <p className="lead ink">{embryo.title}</p>
        <p className="ink">{embryo.abstract}</p>
        <p className="margin-note hand ink">My part: {embryo.role}</p>
      </Page>

      {/* 18 · Portfolio: embryo pipeline */}
      <Page n={18} chapter="portfolio" head={`VI · ${embryo.name}`} scene="cells">
        <p className="label ink">Baselines</p>
        <p className="chips ink">
          {embryo.baselines.map((b) => (
            <span key={b} className="chip">
              {b}
            </span>
          ))}
        </p>
        <p className="label ink">Final approach</p>
        <p className="pipeline ink">
          {embryo.final.map((b, i) => (
            <span key={b}>
              {i > 0 ? <i>+</i> : null}
              <b>{b}</b>
            </span>
          ))}
        </p>
        <div className="milestone ink">
          <span className="stamp">ISODS 2023</span>
          <div>
            <strong>Kaggle challenge winner</strong>
            <span>≥ 9.3% over traditional methods</span>
          </div>
        </div>
        <p className="actions ink">
          <a className="link" href={embryo.url} target="_blank" rel="noopener noreferrer">
            Open repo ↗
          </a>
        </p>
      </Page>

      {/* 19 · More on GitHub */}
      <Page n={19} chapter="portfolio" head="VI · More on GitHub" scene="backpack">
        <p className="label ink">More on GitHub</p>
        <ul className="repos">
          {moreRepos.map((r) => {
            const f = repos[r.name];
            return (
              <li key={r.name} className="ink">
                <p className="repo-line">
                  <a href={`${person.github}/${r.name}`} target="_blank" rel="noopener noreferrer">
                    {r.name}
                  </a>
                  {f?.language ? <em className="lang">{f.language}</em> : null}
                </p>
                <span>{r.note}</span>
              </li>
            );
          })}
        </ul>
      </Page>

      {/* 20 · Epilogue */}
      <Page n={20} chapter="epilogue" head="Epilogue" scene="farewell">
        <h2 className="ink">Epilogue</h2>
        <p className="hand big-hand ink">Let&apos;s write the next chapter.</p>
        <p className="ink">If you are building something with AI, data or automation, I would love to hear about it.</p>
        <p className="contact ink">
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </p>
        <p className="contact ink">
          <a href={person.github} target="_blank" rel="noopener noreferrer">
            github.com/{person.githubHandle}
          </a>
        </p>
        <p className="actions ink">
          <a className="btn-ink" href={person.cv} download>
            Download my CV
          </a>
        </p>
      </Page>

      {/* 21 · Back cover */}
      <div className="page cover-back" data-density="hard" data-page={21} data-chapter="back">
        <div className="cover-art">
          <p className="back-line">Vol. II is being written.</p>
          <div className="back-fig">
            <VoxelScene name="walk" />
          </div>
          <p className="back-mark">AKA&apos;S JOURNAL</p>
        </div>
      </div>
    </>
  );
}
