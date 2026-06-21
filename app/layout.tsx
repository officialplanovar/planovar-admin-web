import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planovar Admin Console",
  description: "Planovar Operations & Administration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
