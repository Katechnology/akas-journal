# Aka's Journal

The portfolio of **Phan Quang Huy (Aka)**, AI & Automation Engineer, told as a red hardcover journal you open and read page by page.

**Live:** https://akas-journal.vercel.app

- A closed 3D book on a light-blue desk (cover, spine, page block) that swings to face you and opens.
- Real page curls with corner dragging, swipes, clicks, arrow keys and chapter ribbons ([StPageFlip](https://github.com/Nodlik/StPageFlip)).
- Text "inks in" line by line while each page is still turning.
- A small isometric voxel scene at the bottom of every page: Aka and Meow walk through the story.
- `/read`: the same content as one plain, accessible, indexable page.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in ./out (deploy anywhere: Vercel, Netlify, GitHub Pages, S3)
```

Preview the production build: `cd out && python3 -m http.server 4780`.

## Where things live

| Path | What |
|---|---|
| `content/journal.ts` | All text, from the CV and Aka's corrections. Edit content here; the book and `/read` both use it. |
| `components/JournalPages.tsx` | Page layouts, in book order (22 pages incl. covers). `CHAPTER_PAGES` maps chapters to pages. |
| `components/Book.tsx` | Desk, closed 3D model, open/close sequence, ribbons, keyboard, status. |
| `lib/bookEngine.ts` | The only file that knows the page-flip library. Clones pages into its own root, owns ink + live states. |
| `lib/voxel.ts`, `lib/scenes.ts` | Voxel kit (boxes → isometric SVG on the server) and the 21 scenes. |
| `app/read/page.tsx` | Linear "read as a page" version. |
| `public/cv/` | Public CV, phone number removed (text, tags and bookmarks). |

## Notes

- **page-flip** (StPageFlip 2.0.7, MIT) has not had a release since 2021. It is wrapped in `lib/bookEngine.ts` so it can be swapped. The open spread stays frontal on purpose: the library maps pointer positions with `getBoundingClientRect`, which breaks on a 3D-tilted book. The tilt only happens while the book is closed.
- **Holo card**: the book shows a photo of the real card and links to the repo. A live, playable card can be added back once the real artwork can be shipped (the repo only contains placeholder art).
- **Reduced motion**: short page turns, no ink delay, no figure animation, no cover tilt.
