"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Download, Sparkles } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";

const AgentCore = dynamic(
  () => import("@/components/AgentCore").then((module) => module.AgentCore),
  {
    ssr: false,
    loading: () => <div className="agent-core-loading" aria-hidden="true" />
  }
);

const SKILLS = [
  { label: "视觉设计", layer: "design", angle: 0 },
  { label: "品牌识别", layer: "design", angle: 120 },
  { label: "视觉策划", layer: "design", angle: 240 },
  { label: "Figma", layer: "tools", angle: 45 },
  { label: "Photoshop", layer: "tools", angle: 165 },
  { label: "Blender", layer: "tools", angle: 285 },
  { label: "3D 渲染", layer: "fields", angle: 0 },
  { label: "AI 创意", layer: "fields", angle: 90 },
  { label: "产品视觉", layer: "fields", angle: 180 },
  { label: "平面设计", layer: "fields", angle: 270 }
];

export function Hero() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const visualY = useTransform(scrollY, [0, 900], [0, reducedMotion ? 0 : 36]);
  const fade = useTransform(scrollY, [0, 720], [1, 0.86]);
  const { content } = useLiveContent();
  const { hero, site } = content;
  const resumeUrl = site.resumeUrl || hero.resumeUrl;

  return (
    <section className="apple-hero relative min-h-[100dvh] overflow-hidden bg-[#f5f5f7] px-5 pb-16 pt-24 text-[#1d1d1f] md:px-10 md:pb-20 md:pt-28">
      <div className="apple-hero-toplight pointer-events-none absolute inset-x-0 top-0 h-52" />
      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto grid min-h-[calc(100dvh-7rem)] max-w-[1440px] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-0">
        <div className="relative z-20 max-w-[650px] pb-4 lg:pb-16">
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#86868b]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#6b88b8]" />
            {hero.eyebrow || "Independent designer"}
          </motion.p>
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(4rem,8vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.075em]"
          >
            Jason Qiu
          </motion.h1>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[590px] text-xl font-medium leading-[1.45] tracking-[-0.025em] text-[#424245] md:text-[28px] md:leading-[1.28]"
          >
            视觉设计、渲染与品牌表达，专注于平面设计、视觉策划、品牌设计与 AI 创意。
          </motion.p>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a href="#works" className="apple-hero-primary inline-flex h-12 items-center gap-2 rounded-full bg-[#1d1d1f] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2">
              {hero.primaryButton || "查看作品"}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="inline-flex h-12 items-center rounded-full border border-[#d2d2d7] bg-white/60 px-6 text-sm font-semibold text-[#1d1d1f] transition hover:-translate-y-0.5 hover:border-[#86868b] hover:bg-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/15 focus:ring-offset-2">
              {hero.secondaryButton || "联系我"}
            </a>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#6e6e73] transition hover:text-[#1d1d1f]">
                <Download className="h-4 w-4" />
                下载简历
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: visualY }}
          className="agent-core-stage relative mx-auto h-[500px] w-full max-w-[720px] md:h-[620px] lg:h-[720px]"
          aria-label="设计能力展示"
        >
          <AgentCore />
        </motion.div>
      </motion.div>
    </section>
  );
}
