export default function onRequest() {
  return new Response(JSON.stringify({
    ok: true,
    service: "star-homework-edge-function"
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
