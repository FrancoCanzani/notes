// Check if the user agent string indicates a mobile device
export default function isMobile(): boolean {
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;

    const mobileKeywords = [
      'Android',
      'iPhone',
      'iPad',
      'iPod',
      'Windows Phone',
    ];

    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
  }
  return false;
}
