# Deploy — Alpha Radar Fundamentals (Vercel)

Production build passes and the app is deploy-ready. The only thing I can't do for
you is authenticate to **your** Vercel account. Two options — CLI is fastest.

## Important: do NOT commit the key
`.env.local` is gitignored and must stay that way. Set `OPENDART_API_KEY` as a
**Vercel environment variable** instead (steps below). The key shared in chat can be
re-issued at https://opendart.fss.or.kr if you prefer a fresh one.

## Option A — Vercel CLI (fastest)
Run these in the project folder (`/Users/leesangyoon/Desktop/kr-stock-dashboard`).
In this chat you can prefix a line with `!` to run it here.

```bash
vercel login            # opens browser; sign in (GitHub/email)
vercel link             # create/link a project (accept defaults; framework = Next.js)
# add the OpenDART key to all environments (paste the key when prompted):
vercel env add OPENDART_API_KEY production
vercel env add OPENDART_API_KEY preview
vercel env add OPENDART_API_KEY development
vercel --prod           # build + deploy to production → prints your live URL
```

## Option B — GitHub → Vercel (nicer for a portfolio)
1. Create a repo and push (needs your approval to commit/push):
   ```bash
   gh repo create alpha-radar-fundamentals --private --source . --remote origin
   git add -A && git commit -m "Alpha Radar Fundamentals"   # (approve first)
   git push -u origin main
   ```
2. On vercel.com → **Add New → Project → Import** the repo.
3. Project Settings → **Environment Variables** → add `OPENDART_API_KEY` (Production/Preview/Dev).
4. Deploy. Auto-deploys on every push afterward.

## After deploy
- Open the live URL, hard-refresh, and check `/fundamentals/005930` shows "OpenDART 재무".
- Put the URL in `PORTFOLIO.md` (and your résumé/LinkedIn).
- Note: serverless function regions matter for latency to Yahoo/OpenDART, but defaults are fine.

## Notes / limits
- Node/runtime: Vercel auto-detects Next.js 16; no extra config needed.
- The OpenDART + Yahoo calls run server-side in Vercel Functions (fine on the free tier
  for a demo; both are rate-limited — sample fallback keeps the UI working if a call fails).
- Free tier is enough for a portfolio demo. No paid services required.
