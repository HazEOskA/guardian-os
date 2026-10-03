import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { handleRunAgent } from "./lib/run-agent.server";

const startFetch = createStartHandler(defaultStreamHandler);

export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/run-agent" && request.method === "POST") {
      return handleRunAgent(request, env);
    }

    if (url.pathname === "/api/run-agent" && request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return (startFetch as any)(request);
  },
};
