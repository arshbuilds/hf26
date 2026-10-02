import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "改善 Kaizen — The Gentle Habit & Focus Companion",
  description: "Built for Alex to overcome task paralysis and burnout using open-source AI (TabPFN + Llama 3.2)",
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
