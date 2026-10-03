// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwindcss,
// tsConfigPaths and (build-only) cloudflare — do NOT add them manually.
// On Vercel (VERCEL=1) the Cloudflare plugin is disabled and nitro emits a Vercel build output.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const onVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  cloudflare: onVercel ? false : undefined,
  vite: { plugins: onVercel ? [nitro({ preset: "vercel" })] : [] },
});
