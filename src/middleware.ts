import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export default async function middleware(request: NextRequest) {
  const session = await auth();

  if (session && request.nextUrl.pathname === '/') {
    const absoluteURL = new URL('/notes', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL);
  }

  if (!session && request.nextUrl.pathname.includes('notes')) {
    const absoluteURL = new URL('/', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL);
  }

  return NextResponse.next();
}
