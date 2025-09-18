import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ path: string[] }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'DELETE');
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PATCH');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const backendOrigin = process.env.BACKEND_ORIGIN;
  
  if (!backendOrigin) {
    return NextResponse.json(
      { error: 'Backend origin not configured' },
      { status: 500 }
    );
  }

  const path = params.path.join('/');
  const url = new URL(`/api/v1/${path}`, backendOrigin);
  
  // Copy search params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers();
  
  // Copy relevant headers
  request.headers.forEach((value, key) => {
    if (
      key.toLowerCase() !== 'host' &&
      key.toLowerCase() !== 'x-forwarded-for' &&
      key.toLowerCase() !== 'x-forwarded-proto' &&
      key.toLowerCase() !== 'x-vercel-id'
    ) {
      headers.set(key, value);
    }
  });

  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.arrayBuffer();
    } catch (error) {
      console.error('Error reading request body:', error);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    const responseHeaders = new Headers();
    
    // Copy response headers
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // Handle response body
    const contentType = response.headers.get('content-type') || '';
    let responseBody: BodyInit;

    if (contentType.includes('application/json')) {
      const data = await response.json();
      responseBody = JSON.stringify(data);
    } else {
      responseBody = await response.arrayBuffer();
    }

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 502 }
    );
  }
}