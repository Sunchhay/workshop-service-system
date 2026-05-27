import { type NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api-workshop.sunchhay.com/api';
// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function proxy(req: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const url = `${API_BASE}/${path.join('/')}${req.nextUrl.search}`;

  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? req.body : undefined;

  const fetchOptions: RequestInit = { method: req.method, headers, body };
  if (hasBody) {
    // Node.js fetch requires duplex:'half' when the request body is a ReadableStream.
    // The property is missing from the TypeScript RequestInit type, so we cast.
    (fetchOptions as Record<string, unknown>).duplex = 'half';
  }

  const upstream = await fetch(url, fetchOptions);

  const responseHeaders: Record<string, string> = {
    'content-type': upstream.headers.get('content-type') ?? 'application/json',
  };
  const disposition = upstream.headers.get('content-disposition');
  if (disposition) responseHeaders['content-disposition'] = disposition;

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
  proxy(req, params);
export const POST = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
  proxy(req, params);
export const PUT = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
  proxy(req, params);
export const PATCH = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
  proxy(req, params);
export const DELETE = (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) =>
  proxy(req, params);
