# hans-vandeneijnde-website

Modern English portfolio website for painter Hans van den Eijnde.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Artwork workflow

Drop images in `public/images/{category}/`, optionally add a sidecar `.json` for metadata, then run:

```bash
npm run sync-artworks
```

## Deploy on Vercel

The easiest way to deploy this Next.js app is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
