# MRK Simulator

Telegram NFT Gifts trading simulator (educational).

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## GitHub Pages

1. Create repo on GitHub: `mrkt-simulator`
2. Push this folder:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/winway113/mrkt-simulator.git
   git push -u origin main
   ```
3. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. After workflow finishes: `https://winway113.github.io/mrkt-simulator/`

Images: primary `api.changes.tg`, fallback `nft.fragment.com` if API unavailable.
