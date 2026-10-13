"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createBookEngine, type BookEngine } from "@/lib/bookEngine";

type Ribbon = { id: string; numeral: string; title: string; page: number };
type Bounds = { left: number; top: number; width: number; height: number; pageWidth: number };

const TURN_MS = 900;
const OPEN_MS = 700;

/**
 * The desk, the 3D book body and everything around the pages.
 * Pages are rendered on the server inside `.book-source`; on mount they are cloned
 * into an engine-owned root so the page-flip library never fights React over DOM nodes.
 */
export function Book({ pageCount, ribbons, cv, children }: { pageCount: number; ribbons: Ribbon[]; cv: string; children: ReactNode }) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const modelFaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<BookEngine | null>(null);
  const busyRef = useRef(false);

  const last = pageCount - 1;
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false); // false = the closed 3D model is shown
  const [frontal, setFrontal] = useState(false); // closed model rotated to face the reader
  const [portrait, setPortrait] = useState(false);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [reduced, setReduced] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const chapterOf = useCallback(
    (p: number) => {
      let cur: Ribbon | null = null;
      for (const r of ribbons) if (r.page <= p) cur = r;
      return p < 3 ? null : cur;
    },
    [ribbons],
  );

  /* ---------------- engine lifecycle ---------------- */
  useEffect(() => {
    const host = hostRef.current;
    const source = sourceRef.current;
    if (!host || !source) return;
    let disposed = false;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = mq.matches;
    setReduced(reduce);

    // the closed model's cover face shows the real cover artwork
    const coverArt = source.querySelector(".cover-front .cover-art");
    if (coverArt && modelFaceRef.current) {
      modelFaceRef.current.replaceChildren(coverArt.cloneNode(true));
    }

    const fromHash = ribbons.find((r) => `#${r.id}` === window.location.hash)?.page ?? 0;

    createBookEngine({
      host,
      pages: [...source.querySelectorAll<HTMLElement>(":scope > .page")],
      startPage: fromHash,
      turnMs: reduce ? 260 : TURN_MS,
      reduce,
      onSettle: (p, isPortrait) => {
        setPage(p);
        setPortrait(isPortrait);
        busyRef.current = false;
        if (p === 0) {
          // closing: swap the flat cover for the 3D model, then let it tilt back
          setFrontal(true);
          setOpen(false);
          window.setTimeout(() => setFrontal(false), 40);
        }
        const ch = p < 3 ? null : ribbons.filter((r) => r.page <= p).pop();
        const hash = ch ? `#${ch.id}` : " ";
        if (window.location.hash !== hash.trim()) window.history.replaceState(null, "", hash.trim() || window.location.pathname);
      },
      onTurnStart: () => {
        busyRef.current = true;
      },
      onLayout: (b, isPortrait) => {
        setBounds(b);
        setPortrait(isPortrait);
      },
      onAction: (action, value) => {
        if (action === "goto") window.dispatchEvent(new CustomEvent("journal:goto", { detail: Number(value) }));
      },
    }).then((engine) => {
      if (disposed) return engine.destroy();
      engineRef.current = engine;
      if (fromHash > 0) {
        setOpen(true);
        setPage(fromHash);
      }
      setReady(true);
    });

    return () => {
      disposed = true;
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- navigation ---------------- */
  const openBook = useCallback(
    (target = 1) => {
      const engine = engineRef.current;
      if (!engine || open || busyRef.current) return;
      busyRef.current = true;
      setFrontal(true); // swing the 3D book to face the reader
      window.setTimeout(
        () => {
          setOpen(true); // swap to the engine's flat cover (same size, same place)
          setPage(target === 1 ? 1 : target);
          requestAnimationFrame(() => engine.turnTo(target));
        },
        reduced ? 0 : OPEN_MS,
      );
    },
    [open, reduced],
  );

  const next = useCallback(() => {
    if (!open) return openBook(1);
    engineRef.current?.next();
  }, [open, openBook]);

  const prev = useCallback(() => {
    if (!open) return;
    engineRef.current?.prev();
  }, [open]);

  const goTo = useCallback(
    (p: number) => {
      if (!open) return openBook(p);
      engineRef.current?.turnTo(p);
    },
    [open, openBook],
  );
  // links inside pages (contents page) arrive as a DOM event from the engine
  useEffect(() => {
    const onGo = (e: Event) => goTo((e as CustomEvent<number>).detail);
    window.addEventListener("journal:goto", onGo);
    return () => window.removeEventListener("journal:goto", onGo);
  }, [goTo]);

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      let act: (() => void) | null = null;
      if (e.key === "ArrowRight" || e.key === "PageDown") act = next;
      else if (e.key === "ArrowLeft" || e.key === "PageUp") act = prev;
      else if (e.key === "Home") act = () => goTo(1);
      else if (e.key === "End") act = () => goTo(last);
      else if (e.key === "Escape" && open) act = () => engineRef.current?.turnTo(0);
      else if ((e.key === "Enter" || e.key === " ") && !open && t === stageRef.current) act = () => openBook(1);
      if (act) {
        e.preventDefault();
        act();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, open, openBook, last]);

  /* ---------------- derived layout ---------------- */
  const atBack = page === last;
  const shift = !portrait && bounds ? (page === 0 && open ? -0.5 : !open ? -0.5 : atBack ? 0.5 : 0) : 0;
  const progress = page / last;
  const stackL = Math.round(2 + progress * 10);
  const stackR = Math.round(2 + (1 - progress) * 10);
  const layers = (n: number, dir: 1 | -1) =>
    Array.from({ length: n }, (_, i) => `${dir * (i + 1)}px ${i + 1}px 0 ${i % 2 ? "#D7E6F3" : "#FBFDFF"}`).join(",");

  // on a spread, the right-hand page decides the chapter (a chapter may start there)
  const chapter = chapterOf(portrait || page === 0 ? page : Math.min(page + 1, last - 1));
  const visible = !open ? "Closed" : portrait ? `Page ${page}` : page === 0 ? "Cover" : atBack ? "Back cover" : `Pages ${page}–${page + 1}`;
  const numbered = open && page !== 0 && !atBack;
  const status = `${visible}${numbered ? ` of ${last - 1}` : ""}${!atBack && chapter ? ` · ${chapter.numeral ? chapter.numeral + " · " : ""}${chapter.title}` : ""}`;

  const style = {
    "--pw": bounds ? `${bounds.pageWidth}px` : undefined,
    "--ph": bounds ? `${bounds.height}px` : undefined,
    "--bl": bounds ? `${bounds.left}px` : undefined,
    "--bt": bounds ? `${bounds.top}px` : undefined,
    "--shift": `${shift}`,
    "--tx": `${tilt.x}`,
    "--ty": `${tilt.y}`,
  } as CSSProperties;

  return (
    <div className={`desk${ready ? " ready" : ""}${open ? " is-open" : ""}${portrait ? " portrait" : ""}${reduced ? " reduce" : ""}${atBack ? " at-back" : ""}`} style={style}>
      <header className="topbar">
        <span className="brand">Aka&apos;s Journal</span>
        <nav>
          <a href="/read/">Read as a page</a>
          <a href={cv} download>
            CV (PDF)
          </a>
        </nav>
      </header>

      <div
        className="stage"
        ref={stageRef}
        tabIndex={0}
        aria-label="Aka's Journal. Use the left and right arrow keys to turn pages."
        onPointerMove={(e) => {
          if (open || reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className="book-host-wrap">
          <div className="book-host" ref={hostRef}>
            {/* ribbons: one bookmark per chapter, hanging above the page block */}
            {open && bounds && !atBack && page !== 0 ? (
              <nav className="ribbons" aria-label="Chapters">
                {ribbons.map((r) => {
                  const active = chapter?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`ribbon${active ? " active" : ""}`}
                      onClick={() => goTo(r.page % 2 === 0 && !portrait ? r.page - 1 : r.page)}
                      aria-label={`${r.numeral ? "Chapter " + r.numeral + ", " : ""}${r.title}`}
                      aria-current={active ? "true" : undefined}
                      title={r.title}
                    >
                      <span>{r.numeral || "✉"}</span>
                    </button>
                  );
                })}
              </nav>
            ) : null}

            {/* cover boards + page block behind the open spread */}
            {bounds ? (
              <div className="body3d" aria-hidden="true">
                <div className="board" />
                <div className="stack l" style={{ boxShadow: layers(stackL, -1) }} />
                <div className="stack r" style={{ boxShadow: layers(stackR, 1) }} />
              </div>
            ) : null}
          </div>

          {/* the closed book as a real 3D object */}
          <button
            type="button"
            className={`model${frontal ? " frontal" : ""}`}
            onClick={() => openBook(1)}
            aria-label="Open Aka's Journal"
            hidden={open}
          >
            <span className="m-tilt">
              <span className="m-back" />
              <span className="m-edge r" />
              <span className="m-edge t" />
              <span className="m-edge b" />
              <span className="m-spine">
                <span>AKA&apos;S JOURNAL · VOL. I</span>
              </span>
              <span className="m-face page cover-front" ref={modelFaceRef} />
            </span>
          </button>
          <div className="desk-shadow" aria-hidden="true" />
        </div>
      </div>

      <footer className="controls">
        <button type="button" className="ctl" onClick={prev} disabled={!open || page === 0} aria-label="Previous page">
          ←
        </button>
        <p className="status" aria-live="polite">
          {!ready ? "Opening the desk…" : !open ? "Click the journal to open it" : status}
        </p>
        <button type="button" className="ctl primary" onClick={next} disabled={open && atBack} aria-label={open ? "Next page" : "Open the journal"}>
          {open ? "→" : "Open"}
        </button>
      </footer>

      {/* server-rendered pages: cloned into the engine on mount, readable as-is without JS */}
      <div className="book-source" ref={sourceRef}>
        {children}
      </div>
      <noscript>
        <p className="noscript">
          JavaScript is off, so the book shows as plain pages. <a href="/read/">Read the journal as one page.</a>
        </p>
      </noscript>

    </div>
  );
}
