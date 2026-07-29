import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veridion | AI Regulatory Version Intelligence",
  description:
    "Track document versions, compare legislative changes, and guide users to correct form sections using multi-agent RAG.",
  keywords: [
    "AI Compliance",
    "Regulatory Intelligence",
    "LangGraph",
    "FastAPI",
    "Multi-Agent RAG",
    "pgvector",
  ],
  authors: [{ name: "Veridion Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Veridion | AI Regulatory Version Intelligence",
    description:
      "Track document versions, compare legislative changes, and guide users to correct form sections using multi-agent RAG.",
    url: "http://localhost:3000",
    siteName: "Veridion",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veridion | AI Regulatory Version Intelligence",
    description:
      "Track document versions, compare legislative changes, and guide users to correct form sections using multi-agent RAG.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}