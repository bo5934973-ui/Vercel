"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function ResumeDownload() {
  const { content } = useLiveContent();
  const resumeUrl = content.site.resumeUrl || "/Jason-Qiu-Resume.md";

  return (
    <section id="resume" className="bg-[#f5f5f7] px-6 pb-28 pt-8 text-[#1d1d1f] md:px-20 md:pb-36">
      <div className="mx-auto max-w-[980px] rounded-[8px] border border-black/[0.06] bg-white px-6 py-10 text-center shadow-[0_24px_80px_rgba(29,29,31,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_96px_rgba(29,29,31,0.12)] md:px-12 md:py-14">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] shadow-[0_12px_34px_rgba(29,29,31,0.08)] transition-all duration-300 hover:bg-[#1d1d1f] hover:text-white">
          <Download className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-[#6e6e73]">简历下载</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          获取更完整的经历与能力概览
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#6e6e73]">
          页面中的简历入口会先来到这里。确认需要查看完整简历后，再点击下方按钮下载文件。
        </p>
        <div className="mt-8">
          <Link
            href={resumeUrl}
            download
            className="inline-flex h-12 min-w-[132px] items-center justify-center rounded-full border border-black/10 bg-white px-7 text-base font-medium text-[#1d1d1f] shadow-[0_12px_34px_rgba(29,29,31,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#0071e3] hover:text-white hover:shadow-[0_18px_46px_rgba(0,113,227,0.18)] active:translate-y-0 active:scale-[0.98]"
          >
            下载简历
          </Link>
        </div>
      </div>
    </section>
  );
}
