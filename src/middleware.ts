import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export default async function middleware(request: NextRequest) {
  const session = await auth();

  if (session && request.nextUrl.pathname === '/') {
    const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL);
  }

  if (!session && request.nextUrl.pathname.includes('cloud')) {
    const absoluteURL = new URL('/sign-in', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL);
  }

  return NextResponse.next();
}
