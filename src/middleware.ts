import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/notes(.*)', '/calendar(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const url = req.nextUrl.clone();

  if (isProtectedRoute(req)) auth().protect();

  // Check if the current path is '/' and the user is authenticated
  if (url.pathname === '/' && userId) {
    // Redirect to '/notes'
    url.pathname = '/notes';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
