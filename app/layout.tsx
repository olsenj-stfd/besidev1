import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Nav } from "@/components/nav";
import { CrisisFooter } from "@/components/crisis-footer";
import { SafetyCheckin } from "@/components/safety-checkin";
import { getCheckin } from "@/lib/checkin";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Beside — you're not alone",
  description:
    "A quiet place for families touched by addiction to share, read, and feel less alone. Stories, grouped by theme.",
  applicationName: "Beside",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Beside",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon-apple.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const checkin = await getCheckin();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Nav />
        <main className="flex-1 w-full max-w-[680px] mx-auto px-5 pt-6 pb-24">
          {children}
        </main>
        <CrisisFooter />
        {!checkin && <SafetyCheckin />}
      </body>
    </html>
  );
}
