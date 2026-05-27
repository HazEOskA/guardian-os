# Guardian OS — Cloudflare Workers Deploy Session

Date: 2026-05-27

## Result

Guardian OS was successfully deployed to Cloudflare Workers.

Production URL:
https://guardian-os.hazeoska.workers.dev

Current Version ID:
5e9ff0ac-97a9-46ef-9cb4-6dd25ed9c2dd

## Deploy Target

Cloudflare Workers.

## Why Cloudflare

The project builds as a TanStack Start / SSR-style app, producing:

- `dist/client`
- `dist/server`
- `dist/server/wrangler.json`

A Vercel static deploy produced `404: NOT_FOUND` because the app was not a plain static Vite frontend.

## Working Commands

```powershell
cd C:\OsaTechGPT\repos\guardian-os
npm run build
npx wrangler deploy
npx wrangler deployments list
```

## Deploy Notes

Workers.dev subdomain registered:

```text
hazeoska.workers.dev
```

Final app URL:

```text
https://guardian-os.hazeoska.workers.dev
```

Wrangler used redirected deploy configuration:

```text
Configuration being used: dist\server\wrangler.json
Original user's configuration: wrangler.jsonc
Deploy configuration file: .wrangler\deploy\config.json
```

Uploaded worker:

```text
Uploaded guardian-os
Deployed guardian-os triggers
```

## Validation Status

- Build: passed
- Asset upload: passed
- Worker deploy: passed
- Deployment listing: confirmed
- Public URL: created
- Browser/manual UI check: pending

## Known Issue / Lesson

Vercel deployment created a `404: NOT_FOUND` because Guardian OS is not currently a simple static frontend. The correct production target is Cloudflare Workers via Wrangler.

## Rollback / Safety

Use Wrangler deployments to inspect previous versions:

```powershell
cd C:\OsaTechGPT\repos\guardian-os
npx wrangler deployments list
```

If future changes break production, redeploy the last known-good version or roll back from Cloudflare dashboard.

## Next Step

Open the production URL and confirm that the UI loads correctly:

https://guardian-os.hazeoska.workers.dev
