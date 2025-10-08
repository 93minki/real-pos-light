const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();
const enc = new TextEncoder();

export function addClient(c: ReadableStreamDefaultController<Uint8Array>) {
  clients.add(c);
}

export function removeClient(c: ReadableStreamDefaultController<Uint8Array>) {
  clients.delete(c);
}

export function broadcast(data = "update") {
  const chunk = enc.encode(`data: ${data}\n\n`);
  for (const c of clients) {
    try {
      c.enqueue(chunk);
    } catch {}
  }
}

export function pingAll() {
  const ping = enc.encode(`: keep-alive\n\n`);
  for (const c of clients) {
    try {
      c.enqueue(ping);
    } catch {}
  }
}
