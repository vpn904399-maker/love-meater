import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeartSync — Love Meter",
  description:
    "Measure the romantic spark between two names with instant compatibility breakdown, date ideas, and Discord webhook delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden selection:bg-rose-200 selection:text-rose-950">
        {children}
      </body>
    </html>
  );
}

