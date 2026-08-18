import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "ClearFlow | Reconciliation Dashboard",
  description: "Monitor payment settlement accuracy, investigate unmatched records, and close reconciliation gaps in one focused workspace.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "ClearFlow | Reconciliation Dashboard",
    description: "Monitor settlement accuracy and resolve reconciliation breaks before close.",
    images: [{ url: "/og-reconciliation.png", width: 1200, height: 630, alt: "ClearFlow Reconciliation Dashboard" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-reconciliation.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
