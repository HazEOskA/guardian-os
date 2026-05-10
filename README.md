# Guardian OS

Mobile-first multi-agent workspace for structured analysis, decisions, strategy, and risk control.

Guardian OS routes an input through specialized AI agents and returns a structured output for faster reasoning, validation, planning, and risk review.

## Agent pipeline

- Scanner — extracts intent, context, signals, and initial risks.
- Analyst — separates facts, assumptions, risks, opportunities, and missing data.
- Decision — compares options and recommends a direction.
- Strategy — turns the decision into a step-by-step plan.
- Risk — scores scam/manipulation/operational risk and explains the red flags.

## Tech stack

- React
- TanStack Start / Router
- Vite
- Tailwind CSS
- Supabase
- Supabase Edge Function: `run-agent`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill the Supabase variables before running the real agent pipeline.

## Repository rules

Do not commit `.env`, `.env.local`, generated build output, `.workspace`, or provider-specific temporary files.

## Product direction

This repository is the clean Guardian OS codebase. It is separate from any memory-controller, PMC, or supervisor-style product.
