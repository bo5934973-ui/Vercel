"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function WorkCard({ work, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.72, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/work/?slug=${encodeURIComponent(work.slug)}`}
        className="group flex h-full flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_18px_50px_rgba(29,29,31,0.07)] ring-1 ring-black/[0.04] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(29,29,31,0.12)]"
      >
        <div className="relative aspect-[1.12] overflow-hidden bg-[#ececf0]">
          <img
            src={`${work.coverImage}?v=apple-home-1`}
            alt={work.title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent_22%,rgba(255,255,255,0.24)_50%,transparent_74%)] opacity-0 transition duration-700 group-hover:translate-x-[120%] group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/14 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col bg-[#fbfbfd] p-6 md:p-7">
          <div className="flex items-center justify-between gap-4 text-[13px] font-medium leading-[18px] text-[#6e6e73]">
            <span className="truncate">{work.category}</span>
            <span>{work.year}</span>
          </div>
          <h3 className="mt-8 text-[28px] font-semibold leading-[1.08] tracking-normal text-[#1d1d1f] md:text-[32px]">
            {work.title}
          </h3>
          <p className="mt-4 text-base leading-7 text-[#515154] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
            {work.description}
          </p>
          <div className="mt-7 flex items-center justify-between border-t border-black/[0.06] pt-5">
            <span className="text-sm font-medium text-[#86868b]">{work.cardNote || "查看案例逻辑"}</span>
            <span className="text-sm font-medium text-[#0071e3] transition group-hover:translate-x-1">
              进入项目
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
