/**
 * Tiny voxel kit: scenes are described in code as coloured boxes and drawn as
 * isometric SVG on the server. No WebGL, no runtime cost, crisp at any size,
 * and the drawing turns and curls with the paper because it IS the paper.
 *
 * Axes: x → right-down, y → left-down, z → up. Visible faces: top, +y (left
 * front) and +x (right front). Characters face +y.
 */

export type Group = "base" | "who" | "cat" | "fx" | "fx2";

type Vox = { x: number; y: number; z: number; c: string; g: Group };
type Fill = string | ((x: number, y: number, z: number) => string);

export class Scene {
  private m = new Map<string, Vox>();

  box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c: Fill, g: Group = "base") {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++)
          this.m.set(`${x},${y},${z}`, { x, y, z, c: typeof c === "function" ? c(x, y, z) : c, g });
    return this;
  }

  has(x: number, y: number, z: number) {
    return this.m.has(`${x},${y},${z}`);
  }

  voxels() {
    return [...this.m.values()];
  }
}

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f))),
  );
  return "#" + ((1 << 24) + (ch[0] << 16) + (ch[1] << 8) + ch[2]).toString(16).slice(1);
}

export type SvgOut = { viewBox: string; body: string };

/** Painter-ordered isometric polygons; consecutive polygons of one group share a <g>. */
export function toSvg(scene: Scene, s = 10): SvgOut {
  const vox = scene.voxels().sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z || a.x - b.x);
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const P = (x: number, y: number, z: number): [number, number] => {
    const X = r1((x - y) * 0.866 * s);
    const Y = r1((x + y) * 0.5 * s - z * s);
    if (X < minX) minX = X;
    if (Y < minY) minY = Y;
    if (X > maxX) maxX = X;
    if (Y > maxY) maxY = Y;
    return [X, Y];
  };
  /** One face as a compact relative path: "M x y l dx dy l dx dy l dx dy z". */
  const face = (pts: [number, number][]) => {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += `l${r1(pts[i][0] - pts[i - 1][0])} ${r1(pts[i][1] - pts[i - 1][1])}`;
    return d + "z";
  };

  // Painter order is kept; consecutive faces with the same colour share one <path>.
  let body = "";
  let open: Group | null = null;
  let runColor = "";
  let runD = "";
  const flush = () => {
    if (runD) body += `<path fill="${runColor}" stroke="${runColor}" d="${runD}"/>`;
    runD = "";
  };
  const add = (c: string, d: string) => {
    if (c !== runColor) {
      flush();
      runColor = c;
    }
    runD += d;
  };
  for (const { x, y, z, c, g } of vox) {
    const faces: [string, string][] = [];
    if (!scene.has(x, y, z + 1)) faces.push([shade(c, 1.16), face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])]);
    if (!scene.has(x, y + 1, z)) faces.push([c, face([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])]);
    if (!scene.has(x + 1, y, z)) faces.push([shade(c, 0.78), face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)])]);
    if (!faces.length) continue;
    if (g !== open) {
      flush();
      runColor = "";
      if (open) body += "</g>";
      body += `<g class="v-${g}">`;
      open = g;
    }
    for (const [col, d] of faces) add(col, d);
  }
  flush();
  if (open) body += "</g>";
  const p = 3;
  return {
    viewBox: `${(minX - p).toFixed(1)} ${(minY - p).toFixed(1)} ${(maxX - minX + 2 * p).toFixed(1)} ${(maxY - minY + 2 * p).toFixed(1)}`,
    body,
  };
}

/* ------------------------------------------------------------------ */
/* Cast: Aka (original character, red hoodie like the cover) and Meow  */
/* ------------------------------------------------------------------ */

const SKIN = "#EFC29A", HAIR = "#2B1D16", RED = "#C8323A", RED_D = "#A82A31", JEAN = "#35598F", EYE = "#1F2A44";

export type Pose = "stand" | "wave" | "lift" | "hold";

export function aka(S: Scene, ox = 0, oy = 0, pose: Pose = "stand", oz = 0) {
  const B = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c: string) =>
    S.box(x0 + ox, x1 + ox, y0 + oy, y1 + oy, z0 + oz, z1 + oz, c, "who");
  B(0, 3, 0, 1, 0, 0, "#2A2F3A"); // shoes
  B(0, 3, 0, 1, 1, 5, JEAN);
  B(0, 3, 0, 1, 6, 11, RED);
  B(1, 2, 1, 1, 7, 8, RED_D); // hoodie pocket
  // left arm
  if (pose === "lift") { B(-2, -1, 0, 1, 10, 13, RED); B(-2, -1, 0, 1, 14, 15, SKIN); }
  else { B(-2, -1, 0, 1, 8, 11, RED); B(-2, -1, 0, 1, 6, 7, SKIN); }
  // right arm
  if (pose === "wave" || pose === "lift") { B(4, 5, 0, 1, 10, 13, RED); B(4, 5, 0, 1, 14, 15, SKIN); }
  else if (pose === "hold") { B(4, 5, 0, 1, 8, 11, RED); B(4, 5, 1, 2, 7, 7, SKIN); }
  else { B(4, 5, 0, 1, 8, 11, RED); B(4, 5, 0, 1, 6, 7, SKIN); }
  // head
  B(0, 3, -1, 2, 12, 15, SKIN);
  B(0, 3, -1, 2, 16, 16, HAIR);
  B(0, 3, -1, -1, 12, 15, HAIR);
  B(0, 0, -1, 2, 14, 15, HAIR);
  B(3, 3, -1, 1, 14, 15, HAIR);
  B(0, 3, 2, 2, 15, 15, HAIR); // fringe
  B(1, 1, 2, 2, 13, 13, EYE);
  B(2, 2, 2, 2, 13, 13, EYE);
}

const CAT = "#F2B33D", CAT_L = "#FBE3A1", CAT_D = "#D98E1F";
export function meow(S: Scene, ox = 0, oy = 0, oz = 0) {
  const B = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c: string) =>
    S.box(x0 + ox, x1 + ox, y0 + oy, y1 + oy, z0 + oz, z1 + oz, c, "cat");
  B(0, 3, 0, 1, 0, 0, CAT_D); // paws
  B(0, 3, 0, 1, 1, 2, CAT);
  B(1, 2, 1, 1, 1, 1, CAT_L); // belly
  B(-1, -1, 0, 0, 2, 5, CAT_D); // tail
  B(2, 4, 0, 2, 3, 5, CAT); // head
  B(2, 2, 0, 0, 6, 6, CAT_D); // ears
  B(4, 4, 0, 0, 6, 6, CAT_D);
  B(2, 2, 2, 2, 4, 4, EYE);
  B(4, 4, 2, 2, 4, 4, EYE);
  B(3, 3, 2, 2, 3, 3, "#E06A6A");
  B(4, 4, 1, 1, 6, 6, "#FFE38A"); // lightning tuft (thunder meow)
}

/** Light-blue checker island. */
export function island(S: Scene, x0: number, x1: number, y0: number, y1: number) {
  S.box(x0, x1, y0, y1, -1, -1, "#C4E0F6");
  S.box(x0, x1, y0, y1, -2, -2, "#A9D3F5");
}
