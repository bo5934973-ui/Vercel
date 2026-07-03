import "@/styles/globals.css";
import Script from "next/script";
import { LiveContentProvider } from "@/components/LiveContentProvider";
import { siteContent } from "@/data/siteContent";

export const metadata = {
  title: "Jason Qiu - 产品 / UI / 视觉设计师",
  description:
    "Jason Qiu 的个人作品集，专注智能硬件、AI 产品、产品设计、UI / UX、视觉系统、3D / CGI 与产品发布沟通。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  keywords: [
    "Jason Qiu",
    "产品设计师",
    "视觉设计师",
    "UI 设计师",
    "智能硬件设计",
    "AI 产品设计",
    "3D CGI 产品视觉"
  ],
  openGraph: {
    title: "Jason Qiu - 产品 / UI / 视觉设计师",
    description:
      "面向智能硬件与 AI 产品方向的产品设计、视觉系统与商业发布作品集。",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="/ai-assistant.css?v=next-layout-1" />
      </head>
      <body>
        <LiveContentProvider initialContent={siteContent}>{children}</LiveContentProvider>
        <Script src="/ai-assistant.js?v=next-layout-1" strategy="afterInteractive" />
      </body>
    </html>
  );
}
