export default async function onRequest(context) {
  const request = context.request;
  const incoming = new URL(request.url);
  const target = "https://lucky-semolina-a75311.netlify.app" + incoming.pathname + incoming.search;

  try {
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");
    headers.delete("origin");
    headers.delete("referer");

    const init = {
      method: request.method,
      headers,
      redirect: "follow"
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    const upstream = await fetch(target, init);
    const body = await upstream.text();
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.set("cache-control", "no-store");

    return new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "API proxy failed",
      message: String(error)
    }), {
      status: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
}
