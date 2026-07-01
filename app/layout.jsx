import "@/styles/globals.css";
import Script from "next/script";
import { LiveContentProvider } from "@/components/LiveContentProvider";
import { siteContent } from "@/data/siteContent";

export const metadata = {
  title: "Jason Qiu - 视觉设计师作品集",
  description:
    "Jason Qiu 的个人作品集，展示品牌视觉、电商设计、产品渲染与 AI 视觉创作。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  keywords: [
    "Jason Qiu",
    "视觉设计师",
    "品牌视觉设计",
    "电商视觉设计",
    "产品渲染",
    "AI 视觉创作"
  ],
  openGraph: {
    title: "Jason Qiu - 视觉设计师作品集",
    description:
      "展示品牌视觉、电商设计、产品渲染与 AI 视觉创作的个人作品集。",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="content-pending">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html.content-pending body{opacity:0}body{transition:opacity .16s ease}"
          }}
        />
        <link rel="stylesheet" href="/ai-assistant.css?v=next-layout-1" />
      </head>
      <body>
        <LiveContentProvider initialContent={siteContent}>{children}</LiveContentProvider>
        <Script src="/ai-assistant.js?v=next-layout-1" strategy="afterInteractive" />
      </body>
    </html>
  );
}
