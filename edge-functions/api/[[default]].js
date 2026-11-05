export default async function onRequest(context) {
  const { request } = context;
  const incoming = new URL(request.url);
  const target = new URL(
    incoming.pathname + incoming.search,
    "https://star-homework-club-julie.julieye1021.chatgpt.site"
  );

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  try {
    const upstream = await fetch(target.toString(), init);
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new Response(upstream.body, {
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
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
}
