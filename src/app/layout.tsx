import type { Metadata } from "next";
import { Providers } from "@/shared/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
  default: "Elevate Exam App",
  template: "%s | Elevate Exam App",
  },
  description: "Online Examination and Assessment System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en">
  <body className="min-h-screen antialiased bg-background text-foreground font-sans">
  <a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
  >
  Skip to content
  </a>
  <Providers>
  <div id="main-content">{children}</div>
  </Providers>
  </body>
  </html>
  );
}
