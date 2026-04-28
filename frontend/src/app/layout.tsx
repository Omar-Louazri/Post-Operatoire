import type { Metadata } from "next";
import "@fontsource/manrope/latin.css";
import "@fontsource/fraunces/latin.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "PostOps — Post Operator System",
  description:
    "Plateforme de suivi post-opératoire et de rééducation pour patients et équipes de soins.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
