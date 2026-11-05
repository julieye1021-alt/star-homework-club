export default async function onRequest(context) {
  const request = context.request;
  const incoming = new URL(request.url);
  const target = "https://star-homework-club-julie.julieye1021.chatgpt.site" + incoming.pathname + incoming.search;

  try {
    const init = {
      method: request.method,
      headers: request.headers
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    const upstream = await fetch(target, init);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstream.headers
    });
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      stage: "edge-proxy",
      error: String(error)
    }), {
      status: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
}
