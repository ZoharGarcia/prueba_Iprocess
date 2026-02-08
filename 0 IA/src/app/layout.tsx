import { GoogleAnalytics } from '@next/third-parties/google';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <GoogleAnalytics gaId="G-J8GD11MG9X" />
      </body>
    </html>
  );
}