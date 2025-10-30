import type { Metadata } from "next";
import { Inter, Spectral } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spectral = Spectral({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "Mise - Let's make something out of nothing",
  description:
    "Turn what you already have into a meal with AI-powered recipe generation.",
  keywords: ["recipes", "cooking", "AI", "ingredients", "meal planning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spectral.variable}`}>
      <body className="font-inter bg-bone text-text-charcoal antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#F6F3EC",
              color: "#3C3C3A",
              border: "1px solid #BDB6A9",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
