import type { Metadata } from "next";
import { Header } from "@/components/header";
import { TabNav } from "@/components/tab-nav";
import { LocalDataProvider } from "@/components/local-data-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Social media analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-terracotta-dark via-terracotta to-terracotta-dark" />
        <div className="px-9 pt-7">
          <Header />
          <TabNav />
        </div>
        <main>
          <LocalDataProvider>{children}</LocalDataProvider>
        </main>
      </body>
    </html>
  );
}
