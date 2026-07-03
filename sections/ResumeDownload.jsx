"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { useLiveContent } from "@/components/LiveContentProvider";

export function ResumeDownload() {
  const { content } = useLiveContent();
  const resumeUrl = content.site.resumeUrl || content.hero.resumeUrl || "/Jason-Qiu-Resume.pdf";
  const isPdf = resumeUrl.toLowerCase().includes(".pdf");
  const tags = ["Brand Visual", "Product Rendering", "Web Design", "AI Workflow"];

  return (
    <section id="resume" className="bg-[#f5f5f7] px-5 pb-28 pt-8 text-[#1d1d1f] md:px-20 md:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="group relative mx-auto max-w-6xl"
      >
        <div className="absolute inset-x-8 -bottom-8 h-24 rounded-full bg-[#0071e3]/10 blur-3xl transition-all duration-500 group-hover:inset-x-0 group-hover:bg-[#0071e3]/16" />
        <div className="relative grid overflow-hidden rounded-[28px] border border-white/80 bg-white/72 px-6 py-7 shadow-[0_28px_90px_rgba(29,29,31,0.10)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_34px_110px_rgba(29,29,31,0.14)] md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:px-10 md:py-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#0071e3]/12 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-[#0071e3]/18" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.70),rgba(255,255,255,0.24)_44%,rgba(0,113,227,0.05))]" />

          <div className="relative min-w-0">
            <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#0071e3] shadow-[0_14px_36px_rgba(0,113,227,0.14)] backdrop-blur-xl md:hidden">
              <Download className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-normal text-[#1d1d1f] md:text-5xl">
              下载我的完整简历
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#6e6e73] md:text-lg md:leading-8">
              包含品牌视觉、产品渲染、网页设计、AI 辅助创作与项目落地经验
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/[0.08] bg-white/62 px-3.5 py-2 text-sm font-medium text-[#424245] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-8 flex items-center gap-4 md:mt-0">
            <div className="hidden h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#0071e3] shadow-[0_18px_48px_rgba(0,113,227,0.14)] backdrop-blur-xl md:flex">
              <Download className="h-7 w-7" />
            </div>
            <Link
              href={resumeUrl}
              download={isPdf ? "Jason-Qiu-Resume.pdf" : true}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 text-base font-semibold text-white shadow-[0_16px_38px_rgba(0,113,227,0.24)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#0064c8] hover:shadow-[0_20px_52px_rgba(0,113,227,0.34)] active:scale-[0.98] sm:w-auto"
            >
              下载 PDF 简历
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
