"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Mail } from "lucide-react";
import { PortfolioOrbitVisual } from "@/components/PortfolioOrbitVisual";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const visualY = useTransform(scrollY, [0, 760], [0, reducedMotion ? 0 : 28]);
  const { content } = useLiveContent();
  const { hero, works } = content;

  return (
    <section className="portfolio-hero relative min-h-[100dvh] overflow-hidden bg-white px-5 pb-4 pt-20 text-[#17171a] md:px-10 md:pb-20 md:pt-24">
      <div className="portfolio-hero-wash pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-6rem)] max-w-[1440px] items-center gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
        <div className="relative z-10 max-w-[650px] py-8 lg:py-0">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 text-sm font-medium tracking-[-0.01em] text-[#65656b]"
          >
            {hero.eyebrow || "视觉设计师 / AI 创意"}
          </motion.p>

          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[10ch] text-[clamp(4rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]"
          >
            Jason Qiu
          </motion.h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[560px] text-xl font-medium leading-[1.45] tracking-[-0.028em] text-[#44444a] md:text-[27px] md:leading-[1.3]"
          >
            以视觉系统、3D 渲染与 AI 工作流，把产品概念转化为清晰、可信的商业表达。
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#works"
              className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-[#17171a] px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#2b2b30] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#17171a]/25 focus:ring-offset-2"
            >
              查看作品
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-[#17171a] shadow-[0_10px_34px_rgba(23,23,26,0.07)] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_14px_40px_rgba(23,23,26,0.11)] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#17171a]/20 focus:ring-offset-2"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              联系我
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: visualY }}
          className="relative mx-auto aspect-square w-full max-w-[720px]"
        >
          <PortfolioOrbitVisual works={works} />
        </motion.div>
      </div>
    </section>
  );
}
