import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuidedBarakah — Command Center",
  description: "Founder command surface for GuidedBarakah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-deep text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
