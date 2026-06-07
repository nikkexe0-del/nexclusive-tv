# ExclusiveTV

Premium live TV streaming. Built with React + Vite + Shaka Player.

## Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, SF Pro fonts
- **Player**: Shaka Player (HLS/DASH + DRM)
- **API proxy**: Express serverless functions (Vercel)
- **Deploy**: Vercel (zero-config)

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to the local Express server automatically via `vite.config.ts`.

## Deploy to Vercel

1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. No environment variables needed for basic operation
4. Click Deploy — done

The `vercel.json` routes `/api/*` to the serverless function in `api/index.ts` and all other routes to the SPA.

## Project Structure

```
exclusive-tv/
├── api/
│   └── index.ts          # Vercel serverless API (channels + cookies proxy)
├── src/
│   ├── components/
│   │   └── ShakaPlayer.tsx
│   ├── lib/
│   │   └── livechannels.ts
│   ├── pages/
│   │   └── LiveTV.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vercel.json
├── vite.config.ts
└── tailwind.config.js
```

## Credits

Built by **Nikshep Doggalli** · [@nikkk.exe](https://instagram.com/nikkk.exe)
