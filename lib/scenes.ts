import { Scene, aka, meow, island, toSvg, type SvgOut } from "./voxel";

/** One small diorama per page: the same two characters walk through the book. */
const BUILD: Record<string, (S: Scene) => void> = {
  // Bookplate: "This is my journal."
  hello(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(-3, -2, 1, 2, 6, 9, "#B3202A", "who"); // red journal in hand
    S.box(-3, -2, 1, 2, 10, 10, "#F3F7FB", "who");
    meow(S, 8, 1);
  },
  // Contents: a signpost to the chapters
  signpost(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 0, 0);
    S.box(9, 9, 1, 1, 0, 9, "#8B5A2B");
    S.box(7, 12, 1, 1, 8, 9, "#E9D2A9", "fx");
    S.box(13, 13, 1, 1, 8, 9, "#C8323A", "fx");
    S.box(8, 11, 1, 1, 5, 6, "#E9D2A9", "fx2");
    S.box(7, 7, 1, 1, 5, 6, "#4A9AD8", "fx2");
  },
  // I · About: desk and laptop
  laptop(S) {
    island(S, -3, 14, -2, 4);
    aka(S, 0, 0, "hold");
    S.box(7, 13, 0, 3, 0, 4, "#C9A06A");
    S.box(8, 12, 1, 3, 5, 5, "#9AA7B5");
    S.box(8, 12, 0, 0, 5, 9, "#1F2A44");
    S.box(9, 11, 0, 0, 6, 8, "#7FD3FF", "fx");
    S.box(13, 13, 2, 3, 5, 6, "#F3F7FB"); // mug
    S.box(13, 13, 2, 2, 7, 7, "#DCEEFB", "fx2"); // steam
  },
  // I · About: building agents and workflows (node → node → node)
  workflow(S) {
    island(S, -3, 15, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(7, 8, 1, 2, 4, 5, "#4A9AD8", "fx");
    S.box(9, 10, 1, 2, 4.0, 4, "#A9D3F5");
    S.box(11, 12, 1, 2, 4, 5, "#C8323A", "fx2");
    S.box(13, 14, 1, 2, 4, 5, "#2E8B57", "fx");
    S.box(9, 10, 1, 2, 5, 5, "#E1EFFA");
    S.box(8, 8, 1, 1, 0, 3, "#8A96A3");
    S.box(12, 12, 1, 1, 0, 3, "#8A96A3");
    meow(S, 10, -1, 6);
  },
  // II · Education: cap and books
  graduate(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 0, 0);
    S.box(-1, 4, -2, 3, 17, 17, "#1B1F2A", "who");
    S.box(4, 4, 3, 3, 14, 16, "#E8B931", "who");
    S.box(7, 11, 0, 2, 0, 1, "#4A9AD8");
    S.box(7, 11, 0, 2, 2, 3, "#C8323A");
    S.box(8, 11, 0, 2, 4, 5, "#F3F7FB");
    S.box(8, 10, 1, 1, 6, 6, "#2E8B57", "fx");
  },
  // II · Education: reading under a tree
  tree(S) {
    island(S, -3, 13, -3, 4);
    S.box(9, 10, 0, 1, 0, 8, "#8B5A2B");
    S.box(7, 12, -2, 3, 9, 12, "#6DBE7A", "fx");
    S.box(8, 11, -1, 2, 13, 14, "#86D293", "fx");
    aka(S, 1, 1, "hold");
    S.box(5, 7, 2, 3, 6, 7, "#F3F7FB", "who"); // open book
    meow(S, -2, 2);
  },
  // III · Seal Labs: chatbot robot
  robot(S) {
    island(S, -3, 14, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(8, 11, 0, 2, 0, 5, "#B8C4D0");
    S.box(8, 11, 0, 2, 6, 9, "#D5DEE7");
    S.box(8, 8, 3, 3, 8, 8, "#29C6FF", "fx");
    S.box(11, 11, 3, 3, 8, 8, "#29C6FF", "fx");
    S.box(9, 9, 1, 1, 10, 11, "#8A96A3");
    S.box(9, 9, 1, 1, 12, 12, "#C8323A", "fx2");
    S.box(12, 14, 0, 0, 11, 13, "#F3F7FB", "fx2"); // speech bubble
    S.box(13, 13, 0, 0, 12, 12, "#4A9AD8", "fx2");
  },
  // III · Seal Labs: coins and candles (on-chain analytics)
  onchain(S) {
    island(S, -3, 16, -2, 4);
    aka(S, 0, 0, "hold");
    S.box(7, 8, 1, 2, 0, 0, "#E8B931");
    S.box(7, 8, 1, 2, 1, 1, "#F5CD4C");
    S.box(7, 8, 1, 2, 2, 2, "#E8B931");
    S.box(7, 8, 1, 2, 4, 4, "#F5CD4C", "fx"); // hopping coin
    S.box(11, 11, 1, 1, 0, 3, "#2E8B57");
    S.box(13, 13, 1, 1, 1, 6, "#C8323A");
    S.box(15, 15, 1, 1, 0, 8, "#2E8B57", "fx2");
  },
  // III · Keppel Land: listening (speech bubbles)
  feedback(S) {
    island(S, -3, 14, -2, 4);
    aka(S, 0, 0, "hold");
    S.box(8, 10, 0, 0, 10, 12, "#F3F7FB", "fx");
    S.box(9, 9, 0, 0, 11, 11, "#C8323A", "fx");
    S.box(11, 13, 1, 1, 6, 8, "#F3F7FB", "fx2");
    S.box(12, 12, 1, 1, 7, 7, "#2E8B57", "fx2");
    S.box(10, 12, 0, 2, 0, 2, "#C9A06A");
    meow(S, 8, 2);
  },
  // III · Keppel Land: sorting into crates
  crates(S) {
    island(S, -3, 15, -2, 4);
    aka(S, 0, 0, "lift");
    S.box(-2, -1, 0, 1, 16, 17, "#F3F7FB", "who");
    S.box(7, 10, 0, 3, 0, 3, "#C9A06A");
    S.box(8, 9, 1, 2, 3, 3, "#F59AB8");
    S.box(12, 15, 0, 3, 0, 3, "#C9A06A");
    S.box(13, 14, 1, 2, 3, 3, "#7FD3FF");
    S.box(13, 13, 1, 1, 6, 6, "#7FD3FF", "fx");
  },
  // IV · Toolbox: crafting table
  craft(S) {
    island(S, -3, 15, -2, 4);
    aka(S, 0, 0);
    S.box(7, 11, 0, 3, 0, 3, "#8B5A2B");
    S.box(7, 11, 0, 3, 4, 4, "#B07A45");
    S.box(8, 8, 1, 1, 5, 5, "#3776AB", "fx"); // python blue
    S.box(9, 9, 2, 2, 5, 5, "#F5CD4C", "fx2"); // python yellow
    S.box(10, 10, 1, 1, 5, 5, "#EE4C2C", "fx"); // torch orange
    S.box(13, 14, 1, 2, 0, 1, "#EA4B71"); // n8n pink
    S.box(13, 14, 1, 2, 2, 3, "#9AA7B5");
  },
  // IV · Toolbox: the finished tool
  wrench(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 0, 0, "lift");
    S.box(-2, -1, 0, 1, 16, 21, "#9AA7B5", "who");
    S.box(-3, 0, 0, 1, 21, 22, "#9AA7B5", "who");
    S.box(-3, -3, 0, 1, 23, 23, "#9AA7B5", "who");
    S.box(0, 0, 0, 1, 23, 23, "#9AA7B5", "who");
    S.box(7, 7, 1, 1, 14, 14, "#FFE38A", "fx");
    meow(S, 8, 1);
  },
  // V · Milestones: parliament + trophy
  trophy(S) {
    island(S, -3, 17, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(7, 15, 0, 2, 0, 3, "#F3EAD7");
    S.box(10, 12, 0, 2, 4, 7, "#F3EAD7");
    S.box(11, 11, 1, 1, 8, 9, "#C8323A");
    S.box(7, 7, 0, 2, 4, 5, "#F3EAD7");
    S.box(15, 15, 0, 2, 4, 5, "#F3EAD7");
    S.box(16, 17, 2, 3, 0, 1, "#8A6D1E");
    S.box(16, 17, 2, 3, 2, 4, "#E8B931", "fx");
  },
  // V · Milestones: paper scroll + medal
  scroll(S) {
    island(S, -3, 15, -2, 4);
    aka(S, 0, 0, "hold");
    S.box(7, 12, 1, 2, 0, 0, "#F3EAD7");
    S.box(7, 7, 1, 2, 1, 1, "#E5D7B9");
    S.box(12, 12, 1, 2, 1, 1, "#E5D7B9");
    S.box(9, 10, 1, 2, 1, 1, "#4A9AD8");
    S.box(14, 15, 1, 1, 4, 6, "#C0C7D0", "fx");
    S.box(14, 15, 1, 1, 7, 9, "#4A9AD8");
  },
  // VI · Holo card: layer stack
  layers(S) {
    island(S, -3, 15, -2, 5);
    aka(S, 0, 1);
    S.box(8, 13, 0, 0, 1, 9, "#1F2A44");
    S.box(8, 13, 2, 2, 1, 9, "#7FD3FF", "fx");
    S.box(9, 12, 4, 4, 2, 8, "#F7A8D8", "fx2");
    S.box(10, 11, 5, 5, 3, 7, "#FFE38A", "fx");
  },
  // VI · Holo card: Aka lifts the card
  holo(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 1, 0, "lift");
    const H = ["#7FD3FF", "#F7A8D8", "#FFE38A", "#B9F2C9"];
    S.box(-1, 6, 1, 1, 16, 26, (x, _y, z) => (x === -1 || x === 6 || z === 16 || z === 26 ? "#E8B931" : H[(x + z) % 4]), "who");
    meow(S, 8, 1);
    S.box(10, 10, 0, 0, 10, 10, "#FFE38A", "fx");
  },
  // VI · Embryo: microscope
  microscope(S) {
    island(S, -3, 14, -2, 4);
    aka(S, 0, 0);
    S.box(7, 11, 0, 3, 0, 0, "#2A2F3A");
    S.box(11, 11, 0, 2, 1, 9, "#F3F7FB");
    S.box(8, 10, 0, 3, 3, 3, "#2A2F3A");
    S.box(9, 9, 1, 1, 5, 10, "#F3F7FB");
    S.box(10, 10, 1, 1, 9, 9, "#F3F7FB");
    S.box(9, 9, 1, 1, 11, 11, "#2A2F3A");
    S.box(9, 9, 2, 2, 4, 4, "#F59AB8", "fx");
  },
  // VI · Embryo: a cell divides (day 3 → day 5)
  cells(S) {
    island(S, -3, 16, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(7, 10, 0, 3, 0, 0, "#DCEEFB");
    S.box(8, 9, 1, 2, 1, 2, "#F59AB8", "fx");
    S.box(12, 16, 0, 3, 0, 0, "#DCEEFB");
    S.box(12, 13, 0, 1, 1, 2, "#F59AB8", "fx2");
    S.box(15, 16, 0, 1, 1, 2, "#F59AB8", "fx2");
    S.box(12, 13, 2, 3, 1, 2, "#F59AB8", "fx");
    S.box(15, 16, 2, 3, 1, 2, "#F59AB8", "fx");
  },
  // More on GitHub: backpack spilling repo blocks
  backpack(S) {
    island(S, -3, 15, -2, 4);
    aka(S, 0, 0);
    S.box(7, 10, 0, 2, 0, 5, "#C8323A");
    S.box(7, 10, 0, 2, 6, 6, "#A82A31");
    S.box(8, 9, 3, 3, 1, 3, "#A82A31");
    S.box(11, 12, 1, 2, 0, 1, "#4A9AD8", "fx");
    S.box(13, 14, 2, 3, 0, 1, "#2E8B57", "fx2");
    S.box(12, 13, 0, 1, 2, 3, "#E8B931", "fx");
    meow(S, -4, 3);
  },
  // Epilogue: envelope and paper plane
  farewell(S) {
    island(S, -3, 13, -2, 4);
    aka(S, 0, 0, "wave");
    S.box(-3, -2, 1, 2, 6, 8, "#F3F7FB", "who");
    meow(S, 7, 1);
    S.box(10, 13, 0, 0, 13, 13, "#FFFFFF", "fx");
    S.box(11, 12, 0, 0, 14, 14, "#DCEEFB", "fx");
    S.box(13, 13, 0, 0, 12, 12, "#4A9AD8", "fx");
  },
  // Back cover: walking away together
  walk(S) {
    island(S, -3, 12, -2, 3);
    aka(S, 0, 0);
    meow(S, 7, 0);
  },
};

const cache = new Map<string, SvgOut>();
export function sceneSvg(name: string): SvgOut {
  const hit = cache.get(name);
  if (hit) return hit;
  const build = BUILD[name];
  if (!build) throw new Error(`Unknown voxel scene: ${name}`);
  const S = new Scene();
  build(S);
  const out = toSvg(S);
  cache.set(name, out);
  return out;
}

export const SCENE_NAMES = Object.keys(BUILD);
