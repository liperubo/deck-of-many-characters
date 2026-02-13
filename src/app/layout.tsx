import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deck of Many Characters",
  description: "Design and manage your RPG characters with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
