/**
 * BookEngine: the only file that knows about the page-flip library (StPageFlip, MIT,
 * last released 2021). Swap the implementation here if it ever needs replacing.
 *
 * Responsibilities: clone server-rendered pages into an engine-owned root, run the
 * page curl, and own the "ink" (text reveal) and "live" (animated figure) states.
 */

export type Bounds = { left: number; top: number; width: number; height: number; pageWidth: number };

export type BookEngine = {
  next(): void;
  prev(): void;
  turnTo(page: number): void;
  destroy(): void;
};

type Options = {
  host: HTMLElement;
  pages: HTMLElement[];
  startPage: number;
  turnMs: number;
  reduce: boolean;
  onSettle(page: number, portrait: boolean): void;
  onTurnStart(): void;
  onLayout(bounds: Bounds, portrait: boolean): void;
  onAction(action: string, value?: string): void;
};

type PageFlipLike = {
  on(ev: string, cb: (e: { data: unknown }) => void): PageFlipLike;
  loadFromHTML(items: HTMLElement[]): void;
  flipNext(corner?: "top" | "bottom"): void;
  flipPrev(corner?: "top" | "bottom"): void;
  flip(page: number, corner?: "top" | "bottom"): void;
  turnToPage(page: number): void;
  getCurrentPageIndex(): number;
  getOrientation(): "portrait" | "landscape";
  getBoundsRect(): Bounds;
  getPageCount(): number;
  getState?(): string;
  destroy(): void;
};

export async function createBookEngine(o: Options): Promise<BookEngine> {
  const { PageFlip } = (await import("page-flip")) as unknown as {
    PageFlip: new (el: HTMLElement, settings: Record<string, unknown>) => PageFlipLike;
  };

  const root = document.createElement("div");
  root.className = "flip-root";
  o.host.appendChild(root);

  const clones = o.pages.map((p) => {
    const c = p.cloneNode(true) as HTMLElement;
    c.querySelectorAll<HTMLElement>(".ink").forEach((el, i) => el.style.setProperty("--d", String(i)));
    root.appendChild(c);
    return c;
  });
  const total = clones.length;
  const last = total - 1;

  const pf = new PageFlip(root, {
    width: 450,
    height: 600,
    size: "stretch",
    minWidth: 260,
    maxWidth: 560,
    minHeight: 347,
    maxHeight: 747,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    maxShadowOpacity: 0.45,
    flippingTime: o.turnMs,
    mobileScrollSupport: false,
    swipeDistance: 24,
    startPage: o.startPage,
    clickEventForward: true,
  });

  /* ------------- ink + live state (single owner) ------------- */
  const inked = new Set<number>();
  const els = (i: number) => root.querySelectorAll<HTMLElement>(`[data-page="${i}"]`);
  const portrait = () => pf.getOrientation() === "portrait";

  /** Pages visible when the book rests on index p. */
  function spreadAt(p: number): number[] {
    if (portrait()) return [p];
    if (p <= 0) return [0];
    if (p >= last) return [last];
    const left = p % 2 === 1 ? p : p - 1;
    return [left, left + 1].filter((i) => i <= last);
  }
  function neighbours(p: number): number[] {
    const s = spreadAt(p);
    const lo = Math.min(...s), hi = Math.max(...s);
    return [...spreadAt(hi + 1), ...(lo > 0 ? spreadAt(lo - 1) : [])];
  }
  let inkTimer = 0;
  function ink(pages: number[], delay: number) {
    window.clearTimeout(inkTimer);
    const run = () =>
      pages.forEach((i) => {
        if (i < 0 || i > last) return;
        inked.add(i);
        els(i).forEach((e) => e.classList.add("inked"));
      });
    if (delay <= 0) run();
    else inkTimer = window.setTimeout(run, delay);
  }
  function setLive(p: number) {
    root.querySelectorAll(".live").forEach((e) => e.classList.remove("live"));
    spreadAt(p).forEach((i) => els(i).forEach((e) => e.classList.add("live")));
  }
  function layout() {
    o.onLayout(pf.getBoundsRect(), portrait());
  }

  let pendingTarget: number | null = null;
  const inkDelay = o.reduce ? 0 : Math.round(o.turnMs * 0.4);

  pf.on("changeState", (e) => {
    const state = String(e.data);
    if (state === "flipping" || state === "user_fold") {
      o.onTurnStart();
      // ink starts while the page is still in the air (~40% of the turn)
      const targets = pendingTarget !== null ? spreadAt(pendingTarget) : neighbours(pf.getCurrentPageIndex());
      ink(targets, state === "user_fold" ? 0 : inkDelay);
      root.querySelectorAll(".live").forEach((el) => el.classList.remove("live"));
    }
    if (state === "read") {
      // a cancelled drag lands here without a flip event: restore the resting page
      const p = pf.getCurrentPageIndex();
      ink(spreadAt(p), 0);
      setLive(p);
      pendingTarget = null;
      o.onSettle(p, portrait());
    }
  });
  pf.on("flip", (e) => {
    const p = Number(e.data);
    ink(spreadAt(p), 0);
    setLive(p);
    pendingTarget = null;
    o.onSettle(p, portrait());
  });
  pf.on("changeOrientation", () => {
    layout();
    const p = pf.getCurrentPageIndex();
    ink(spreadAt(p), 0);
    setLive(p);
  });
  pf.on("init", () => window.requestAnimationFrame(layout));

  pf.loadFromHTML(clones);
  if (process.env.NODE_ENV !== "production") (window as unknown as { __pf: unknown }).__pf = pf;

  const onResize = () => window.requestAnimationFrame(layout);
  window.addEventListener("resize", onResize);

  // delegated actions inside pages (cloned nodes carry no React handlers)
  const onClick = (ev: MouseEvent) => {
    const t = (ev.target as HTMLElement).closest<HTMLElement>("[data-goto],[data-action]");
    if (!t || !root.contains(t)) return;
    ev.preventDefault();
    if (t.dataset.goto) o.onAction("goto", t.dataset.goto);
    else if (t.dataset.action) o.onAction(t.dataset.action);
  };
  root.addEventListener("click", onClick);

  // initial resting state
  const start = pf.getCurrentPageIndex();
  ink(spreadAt(start), 0);
  setLive(start);
  window.requestAnimationFrame(layout);

  return {
    next: () => pf.flipNext("bottom"),
    prev: () => pf.flipPrev("bottom"),
    turnTo(page: number) {
      const target = Math.max(0, Math.min(last, page));
      if (spreadAt(pf.getCurrentPageIndex()).includes(target)) return;
      pendingTarget = target;
      pf.flip(target, "bottom");
    },
    destroy() {
      window.clearTimeout(inkTimer);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("click", onClick);
      pf.destroy();
    },
  };
}
