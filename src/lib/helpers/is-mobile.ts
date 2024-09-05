import { headers } from 'next/headers';

export default function isMobile(): boolean {
  let userAgent: string;

  if (typeof window !== 'undefined') {
    // Client-side
    userAgent = window.navigator.userAgent;
  } else {
    // Server-side
    userAgent = headers().get('user-agent') || '';
  }

  const mobileKeywords = [
    'Android',
    'webOS',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Windows Phone',
    'Mobile',
  ];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}
