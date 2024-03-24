import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export default async function middleware(request: NextRequest) {
  const session = await auth();

  if (session && request.nextUrl.pathname === '/') {
    const absoluteURL = new URL('/notes', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}