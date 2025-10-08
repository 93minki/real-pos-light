import { addClient, pingAll, removeClient } from "@/lib/sse";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const enc = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      addClient(controller);

      controller.enqueue(enc.encode(": connected\n\n"));

      const ka = setInterval(() => {
        pingAll();
      }, 15000);

      const onClose = () => {
        clearInterval(ka);
        removeClient(controller);
        try {
          controller.close();
        } catch {}
      };

      request.signal.addEventListener("abort", onClose);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
