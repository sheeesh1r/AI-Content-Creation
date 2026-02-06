import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BFL Flux 2 Ad Generator",
  description: "Minimal Flux 2 wrapper prototype"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
