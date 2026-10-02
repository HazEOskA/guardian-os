import { createFileRoute } from "@tanstack/react-router";
import { handleRunAgent } from "@/lib/run-agent.server";

export const Route = createFileRoute("/api/run-agent")({
  server: {
    handlers: {
      POST: ({ request }) => handleRunAgent(request, process.env as Record<string, string>),
    },
  },
});
