import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "ChurchFlow CMS",
  description: "Church management system with public website, admin dashboard, and member portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
