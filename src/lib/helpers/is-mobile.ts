// Check if the user agent string indicates a mobile device
export default function isMobile(): boolean {
  const userAgent = navigator.userAgent;
  const mobileKeywords = ['Android', 'iPhone', 'iPad', 'iPod', 'Windows Phone'];
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}
