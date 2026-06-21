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

## Deploy on a VPS (Nginx)

This site is a **fully static export** — no Node.js or PM2 is needed in production.

```bash
# On the VPS (build on Linux, not on Windows then copy)
git clone https://github.com/mark1971-creator/hans-vandeneijnde-website.git
cd hans-vandeneijnde-website
npm ci
npm run build          # must create out/index.html (build fails otherwise)

# Point Nginx at out/ — see deploy/nginx-hans-portfolio.conf
sudo cp deploy/nginx-hans-portfolio.conf /etc/nginx/sites-available/hans-portfolio
sudo ln -s /etc/nginx/sites-available/hans-portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Or use the helper script: `./deploy/deploy.sh /var/www/hans-portfolio`

Preview the static build locally: `npm run build && npm start`

**Do not use `next start`** — it is incompatible with `output: "export"`. Use `npm start` (serves the `out/` folder) or Nginx in production.

## Deploy on Vercel

The easiest way to deploy this Next.js app is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
