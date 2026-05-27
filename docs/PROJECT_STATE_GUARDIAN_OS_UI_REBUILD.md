# Guardian OS — Project State / UI Rebuild Brief

Date: 2026-05-27

## Current Situation

Guardian OS is deployed, but the current UI is not the intended product UI.

The current repository contains a working technical shell generated from a previous app scaffold. It has been pushed to GitHub and deployed to Cloudflare Workers, but it does not yet match the intended Scratch/Antigravity visual design.

Production URL:
https://guardian-os.hazeoska.workers.dev

Deploy target:
Cloudflare Workers via Wrangler.

## Product Intent

Guardian OS is not meant to be a generic text pipeline page.

It should become a mobile-first OS-style AI workspace built around five core agents:

1. Scanner
2. Analyst
3. Decision
4. Strategy
5. Risk

The app should feel like a compact mobile command center, not a desktop dashboard pasted into a browser.

## Core Concept

Input enters Guardian OS and flows through five specialized agents.

The product should communicate:

- control
- structured thinking
- risk awareness
- decision support
- strategy generation
- execution readiness

Guardian OS should feel like a personal AI operating layer for decisions, analysis, plans, risk checks, and project reasoning.

## Current Code Reality

The current implementation already has the five agent IDs and order:

- scanner
- analyst
- decision
- strategy
- risk

The current route is implemented in:

```text
src/routes/index.tsx
```

The current agent metadata is implemented in:

```text
src/lib/agents.ts
```

The current result rendering card is implemented in:

```text
src/components/AgentCard.tsx
```

The app invokes a Supabase Edge Function named:

```text
run-agent
```

Current history is saved locally in browser localStorage under:

```text
guardian-os.runs
```

## Main Problem

The current UI is not the intended Scratch/Antigravity Guardian OS UI.

It currently looks like a generic scaffold with:

- simple header
- textarea input
- agent toggles
- horizontal pipeline labels
- generic result cards
- side history panel

This is functional structure, but not the desired product interface.

## Target UI Direction

Rebuild the UI to match the Scratch/Antigravity visual design exactly.

The target should be:

- mobile-first
- app-like
- dark premium command-center aesthetic
- five-agent focused
- visually structured around Scanner, Analyst, Decision, Strategy, and Risk
- optimized for phone use
- polished enough for LinkedIn/product showcase
- aligned with the original Guardian OS image/design reference

## Design Source of Truth

The intended UI source of truth is the Scratch/Antigravity image/design that was created specifically for Guardian OS.

Do not invent a new random dashboard style.
Do not redesign the concept away from the reference.
Do not make it a generic SaaS dashboard.

The goal is to reproduce the intended Guardian OS interface as closely as possible.

## What Should Change

Primary rebuild target:

```text
src/routes/index.tsx
```

Likely supporting changes:

```text
src/components/AgentCard.tsx
src/lib/agents.ts
src/styles.css
```

The app should keep the existing agent concept, but the presentation should be rebuilt.

## What Should Not Be Broken

Do not break:

- TanStack route setup
- Cloudflare deploy compatibility
- Vite/TanStack Start build
- existing agent IDs
- existing five-agent flow
- existing Supabase function call unless intentionally replacing backend behavior

## Local Development Commands

```powershell
cd C:\OsaTechGPT\repos\guardian-os
npm install
npm run dev
```

Production build check:

```powershell
npm run build
```

Cloudflare deploy:

```powershell
npx wrangler deploy
```

## Current Deploy Status

Cloudflare Workers deploy succeeded.

Current production URL:

```text
https://guardian-os.hazeoska.workers.dev
```

Known browser issue observed shortly after deploy:

```text
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

Likely related to newly registered workers.dev subdomain propagation/certificate readiness, not necessarily app code.

## Local Git Warning

After deploy tooling changes, the local working tree showed modified files:

```text
.gitignore
package-lock.json
package.json
src/routeTree.gen.ts
```

These should be inspected before committing. Do not blindly commit them.

## Next Build Task

Use Antigravity/Scratch to rebuild the UI from the intended Guardian OS visual reference.

Recommended prompt direction:

- Preserve the existing React/TanStack project.
- Rebuild the home route UI to match the Guardian OS reference image exactly.
- Keep the five agents as the center of the product.
- Make the experience mobile-first and app-like.
- Keep the existing agent execution logic unless replacing it intentionally.
- After changes, run build and verify locally before deployment.

## Definition of Done

The UI rebuild is done when:

- local app visually matches the Guardian OS reference
- mobile layout feels like an app, not a desktop dashboard
- five agents are obvious and central
- input, pipeline, result, and risk/strategy areas are easy to use on phone
- `npm run build` passes
- Cloudflare deploy works
- production URL loads visually

