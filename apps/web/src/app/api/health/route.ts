export async function GET(request: Request) {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
