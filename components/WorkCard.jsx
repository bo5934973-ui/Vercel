"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function WorkCard({ work, index }) {
  const darkCards = new Set([
    "dalingring-smart-ring-visual",
    "world-cup-campaign-poster",
    "ai-visual-experiments",
  ]);
  const isDark = darkCards.has(work.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.72, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0"
    >
      <Link
        href={`/work/?slug=${encodeURIComponent(work.slug)}`}
        aria-label={`查看项目：${work.title}`}
        className={`group relative block h-full min-h-[570px] overflow-hidden rounded-[4px] transition-[filter] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 md:min-h-[680px] md:rounded-[6px] ${
          isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
        }`}
      >
        <img
          src={`${work.coverImage}?v=apple-home-2`}
          alt={work.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.018]"
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-[1] h-[64%] bg-gradient-to-b ${
            isDark
              ? "from-black via-black/94 to-transparent"
              : "from-[#f5f5f7] via-[#f5f5f7]/94 to-transparent"
          }`}
        />

        <div className="relative z-10 flex min-h-[220px] flex-col items-center px-6 pb-7 pt-10 text-center md:min-h-[250px] md:px-10 md:pb-8 md:pt-12">
          <div
            className={`flex items-center gap-2 text-[12px] font-medium tracking-[0.02em] ${
              isDark ? "text-white/58" : "text-[#6e6e73]"
            }`}
          >
            <span>{work.category}</span>
            <span aria-hidden="true">·</span>
            <span>{work.year}</span>
          </div>
          <h3 className="mt-4 max-w-[620px] text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[40px]">
            {work.title}
          </h3>
          <p
            className={`mt-3 max-w-[580px] text-[15px] leading-6 md:text-[17px] md:leading-7 ${
              isDark ? "text-white/72" : "text-[#515154]"
            }`}
          >
            {work.description}
          </p>
          <span className="mt-5 inline-flex h-9 items-center rounded-full bg-[#0071e3] px-5 text-sm font-medium text-white transition duration-300 group-hover:bg-[#0064c8] group-hover:shadow-[0_8px_22px_rgba(0,113,227,0.28)]">
            查看案例 <span aria-hidden="true" className="ml-1">›</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
