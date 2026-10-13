/**
 * Single source of truth for the book AND the /read page.
 * Every fact comes from Aka's CV, his corrections, or his public GitHub READMEs.
 */

export const person = {
  name: "Phan Quang Huy",
  nickname: "Aka",
  role: "AI & Automation Engineer",
  email: "akaphan2302@gmail.com",
  github: "https://github.com/Katechnology",
  githubHandle: "Katechnology",
  cv: "/cv/phan-quang-huy-cv.pdf",
  years: "2021 — 2026",
};

export const about = {
  summary:
    "AI-focused Computer Science graduate with practical experience in machine learning, LLM deployment, data annotation, and automation workflow development.",
  diary: [
    "I like building AI that actually gets used: models that are trained, evaluated and deployed, and workflows that remove the boring steps from someone's day.",
    "I work mostly in Python, from model building and evaluation to deployment, and I build with modern AI development tools every day.",
  ],
  tools: ["OpenClaw", "Codex", "Claude Code"],
  interests:
    "Practical AI solutions, better development workflows, and machine learning and automation applied to real business and technical problems.",
};

export const education = [
  { school: "Ton Duc Thang University", detail: "Bachelor of Computer Science", years: "2021 – 2025", kind: "degree" },
  { school: "University of Science – VNUHCM", detail: "Data Science and Machine Learning Certificate", years: "2023 – 2024", kind: "certificate" },
  { school: "Hai Ba Trung High School", detail: "High school", years: "2017 – 2020", kind: "school" },
] as const;

export const experience = [
  {
    id: "seal-labs",
    company: "Seal Labs",
    role: "R&D Assistant",
    dates: "01/2025 – 03/2026",
    notes: [
      "Research and development on Large Language Models and chatbots, to extend what conversational AI systems can do.",
      "Analysed BTC/ETH trends, stablecoin flows, ETF and regulatory updates, and on-chain activity.",
      "Built automated workflows with Dune, RPC data, spreadsheets and dashboards to track liquidity, CEX flows, whale wallets, liquidation risk, AMM performance and yield strategies.",
      "Created simple backtests for mean-reversion strategies and turned crypto data into clear market insights.",
    ],
    sketch: { title: "What I tracked", items: ["Liquidity", "CEX flows", "Whale wallets", "Liquidation risk", "AMM performance", "Yield strategies"] },
  },
  {
    id: "keppel-land",
    company: "Keppel Land Viet Nam",
    role: "Data Analyst Intern",
    dates: "06/2024 – 12/2024",
    notes: [
      "Supported the collection, analysis and interpretation of customer feedback to find trends, pain points and opportunities to improve service.",
      "Worked with cross-functional teams to put service improvements in place that raised customer satisfaction and operational efficiency.",
    ],
    sketch: { title: "Feedback loop", items: ["Collect", "Analyse", "Find pain points", "Improve with the teams"] },
  },
] as const;

export const skills: { group: string; items: { name: string; note?: string }[] }[] = [
  { group: "Languages", items: [{ name: "Python", note: "good" }, { name: "Java", note: "medium" }] },
  { group: "AI & LLMs", items: [{ name: "Build and deploy LLMs" }, { name: "OpenClaw · Codex · Claude Code", note: "skills, workflows" }] },
  { group: "Automation", items: [{ name: "n8n" }, { name: "OpenClaw" }] },
  { group: "Machine learning", items: [{ name: "PyTorch" }, { name: "Keras" }, { name: "Computer vision", note: "focus" }] },
];

export const milestones = [
  { stamp: "K&H HACK3", title: "Consultant on an award-winning project", detail: "K&H HACK3 hybrid hackathon, Budapest, Hungary" },
  {
    stamp: "ICLR 2024",
    title: "Co-author of two deep-learning papers",
    detail: "One published at Tiny Papers @ ICLR 2024:",
    paper: {
      title: "Mask2Tasks: Leveraging segmentation to enhance classification performance in histopathological colorectal images",
      url: "https://openreview.net/forum?id=WMxXuVTzFm",
    },
  },
  { stamp: "4th", title: "4th prize", detail: "Cross Value Chain Global Hackathon, Vietnam" },
] as const;

export const projects = {
  holo: {
    name: "thunder-meow-holo-card",
    url: "https://github.com/Katechnology/thunder-meow-holo-card",
    tagline: "A layered 3D holographic trading card for the browser.",
    stack: ["three.js", "custom GLSL", "Vite", "headless-Chrome checks"],
    layers: ["Background", "Stencil window", "Character", "Holo foil + glitter", "Frame (metal, foil, gems)"],
    features: [
      "Real depth: background and character sit behind the card surface, seen through a stencil window.",
      "A prismatic foil sweep, glitter that flashes toward the light, and arc lightning traced from a signed distance field.",
      "Tilt, drag with inertia, flip, zoom and keyboard; honours reduced motion and survives WebGL context loss.",
    ],
    poster: "/img/holo-front.jpg",
  },
  embryo: {
    name: "EfficientNet_Embryo_DL",
    url: "https://github.com/Katechnology/EfficientNet_Embryo_DL",
    title: "A deep learning approach to embryo quality assessment",
    role: "I ran the training experiments and analysed the results across the baseline and tuned models.",
    abstract:
      "Embryo quality assessment at the cleavage stage (day 3) and blastocyst stage (day 5), on images from a Vietnamese hospital. The proposed approach outperformed traditional classification methods by a margin of at least 9.3% and won the annual international competition in ISODS's Kaggle challenge 2023.",
    baselines: ["ResNet-50", "Swin Transformer", "ViT-B/16", "EfficientNet-B5"],
    final: ["EfficientNet-B5", "Class weights", "Test-time augmentation"],
    authors: "Minh H Le, Viet V Truong, Pham Le Phu, Huy Phan, Toan Le, Hieu Nguyen, Van Dai Pham, Hieu Le",
  },
};

/** Shown on the "More on GitHub" page; live facts are added at build time. */
export const moreRepos = [
  { name: "research-report-agent", note: "Multi-agent research reports with citations." },
  { name: "doctor-booking-site", note: "Built entirely by an OpenClaw + Codex + Stitch workflow." },
  { name: "Summarize-Video-Tool", note: "YouTube captions into timestamped recaps." },
  { name: "Mask2Task", note: "Code for the Mask2Tasks paper." },
  { name: "eth-perp-dashboard", note: "ETH perpetuals dashboard." },
  { name: "handheld-fan", note: "Interactive isometric figure of a handheld fan." },
] as const;

export type ChapterId = "cover" | "prologue" | "about" | "education" | "experience" | "toolbox" | "milestones" | "portfolio" | "epilogue";

export const chapters: { id: ChapterId; numeral: string; title: string }[] = [
  { id: "about", numeral: "I", title: "About me" },
  { id: "education", numeral: "II", title: "Education" },
  { id: "experience", numeral: "III", title: "Experience" },
  { id: "toolbox", numeral: "IV", title: "Toolbox" },
  { id: "milestones", numeral: "V", title: "Milestones" },
  { id: "portfolio", numeral: "VI", title: "Portfolio" },
  { id: "epilogue", numeral: "", title: "Epilogue" },
];
