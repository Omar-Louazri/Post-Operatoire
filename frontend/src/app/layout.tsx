import type { Metadata } from "next";
import "@fontsource/manrope/latin.css";
import "@fontsource/fraunces/latin.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Suivi post-operatoire",
  description:
    "Plateforme de suivi post-operatoire et de reeducation pour patients et equipes de soins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
