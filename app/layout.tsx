import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Noto_Sans_KR } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: "variable",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE_URL = "https://alpha-radar.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alpha Radar Fundamentals — 한국 주식 펀더멘털 리서치 터미널",
    template: "%s · Alpha Radar Fundamentals",
  },
  description:
    "Alpha Radar Fundamentals는 한국 상장기업의 핵심 재무비율, 3개년 추이, 밸류에이션, 리스크를 한 화면에 정리하는 OpenDART 연동형 리서치 터미널입니다. A Korean equity research terminal — financial ratios, 3-year trends, valuation, and risk. Educational portfolio demo, not investment advice.",
  keywords: [
    "한국 주식",
    "재무제표",
    "재무비율",
    "밸류에이션",
    "OpenDART",
    "KOSPI",
    "KOSDAQ",
    "equity research",
    "fundamentals",
    "fintech portfolio",
  ],
  authors: [{ name: "Alpha Radar" }],
  applicationName: "Alpha Radar Fundamentals",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "Alpha Radar Fundamentals",
    title: "Alpha Radar Fundamentals — 한국 주식 펀더멘털 리서치 터미널",
    description:
      "한국 상장기업의 재무비율·3개년 추이·밸류에이션·리스크를 한눈에. OpenDART 연동형 리서치 터미널 (포트폴리오 데모, 투자 자문 아님).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Radar Fundamentals",
    description:
      "한국 주식 펀더멘털 리서치 터미널 · A Korean equity research terminal. Portfolio demo.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#1a1d23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${noto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
