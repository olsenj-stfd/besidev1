import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import { Nav } from "@/components/nav";
import { CrisisFooter } from "@/components/crisis-footer";
import { SafetyCheckin } from "@/components/safety-checkin";
import { getCheckin } from "@/lib/checkin";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beside — you're not alone",
  description:
    "A quiet place for second patients to share, read, and feel less alone. Stories, grouped by theme.",
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
  themeColor: "#fdf3ee",
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
      className={`${cormorant.variable} ${courier.variable} h-full antialiased`}
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
