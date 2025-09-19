import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:8080'

function buildTargetUrl(req: NextRequest, path?: string[]) {
  const pathname = (path ?? []).join('/')
  const qs = req.nextUrl.search || ''
  return `${BACKEND_ORIGIN}/api/v1/${pathname}${qs}`
}

function forwardHeaders(req: NextRequest): Headers {
  const headers = new Headers(req.headers)
  // Sanitize hop-by-hop headers and set correct host for upstream
  headers.delete('content-length')
  headers.delete('connection')
  headers.delete('accept-encoding')
  // Avoid triggering backend CORS on server-to-server proxy requests.
  // The browser already talks to our Next app on the same origin, so CORS is unnecessary upstream.
  headers.delete('origin')
  headers.delete('referer')
  try { headers.set('host', new URL(BACKEND_ORIGIN).host) } catch { }
  return headers
}

async function proxy(req: NextRequest, params: { path?: string[] }) {
  const url = buildTargetUrl(req, params.path)
  const method = req.method
  const headers = forwardHeaders(req)
  const body = method === 'GET' || method === 'HEAD' ? undefined : req.body

  const upstream = await fetch(url, {
    method,
    headers,
    body,
    redirect: 'manual',
  })

  // Build response, pass through headers and status
  const respHeaders = new Headers()
  // Preserve important headers
  const copyHeaders = ['content-type', 'cache-control', 'location', 'vary']
  for (const [k, v] of upstream.headers) {
    const key = k.toLowerCase()
    if (key === 'set-cookie') continue
    if (copyHeaders.includes(key)) {
      respHeaders.set(key, v)
    }
  }

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  })

  // Forward multiple Set-Cookie headers if present (undici extension)
  const anyHeaders = upstream.headers as any
  const setCookies: string[] | undefined = anyHeaders.getSetCookie?.() || anyHeaders.raw?.()['set-cookie']
  if (Array.isArray(setCookies)) {
    for (const c of setCookies) res.headers.append('set-cookie', c)
  } else {
    const single = upstream.headers.get('set-cookie')
    if (single) res.headers.append('set-cookie', single)
  }

  return res
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}

export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, await ctx.params)
}
