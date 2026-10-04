import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "改善 Kaizen — The Gentle Habit & Focus Companion",
  description: "Built for Siddharth to overcome diagnosed anxiety and task paralysis using open-source AI (TabPFN + Open-Weight LLMs)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfbf7] text-[#1e332d] antialiased selection:bg-[#dcfce7] selection:text-[#166534]">
        {children}
      </body>
    </html>
  );
}
