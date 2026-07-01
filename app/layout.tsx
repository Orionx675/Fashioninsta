import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/navbar";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Icy — Your Personal Outfit Curator",
  description:
    "A personality-aware wardrobe organizer: seasonal boards, MBTI-matched outfit suggestions, 2026 trends, and shopping links for your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-6">
            {children}
          </main>
          <footer className="w-full py-8 text-center text-xs text-muted-foreground/70">
            ❄ Icy — curated by season, styled by personality
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
