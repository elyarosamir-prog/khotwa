import './globals.css';
export const metadata = { title: 'خطوة', description: 'خطوة صغيرة كل يوم، سوا.', manifest: '/manifest.json' };
export const viewport = { themeColor: '#0B6E6E', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }) {
  return (<html lang="ar" dir="rtl"><body>{children}</body></html>);
}
