"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";
import styles from "./HomeBanner.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

export function HomeBanner() {
  const reducedMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const { content } = useLiveContent();
  const { hero, site } = content;

  return (
    <section id="top" className="portfolio-video-home bg-white px-3 pb-8 pt-3 text-[#0a1b33] md:px-6 md:pb-10 md:pt-5">
      <div className="relative flex h-[calc(100dvh-32px)] min-h-[640px] max-h-[760px] overflow-hidden rounded-[36px] border border-slate-200/50 bg-white shadow-[0_40px_100px_-20px_rgba(14,33,59,0.08)] md:rounded-[48px]">
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <div className={styles.fallback} aria-hidden="true">
            <img src="/hero-video-poster.png" alt="" />
          </div>
          <video
            className={`${styles.video} ${videoReady && !videoFailed ? styles.videoVisible : styles.videoHidden}`}
            src={VIDEO_URL}
            autoPlay={!reducedMotion}
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
          />
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        <div className="relative z-10 flex flex-1 flex-col items-start px-8 pt-12 md:px-16 md:pt-16 lg:px-20 lg:pt-20">
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 text-[12px] font-semibold tracking-[0.02em] text-slate-500 md:text-[13px]"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[760px] text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#0a1b33]"
          >
            {hero.title || site.name}
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.64, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[520px] text-[16px] font-medium leading-7 tracking-[-0.018em] text-slate-600 md:text-[18px] md:leading-8"
          >
            {hero.description}
          </motion.p>

          <motion.a
            href="#works"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reducedMotion ? undefined : { scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#0a152d] px-6 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(10,21,45,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a152d]"
          >
            {hero.primaryButton || "查看作品"}
            <ArrowDownRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
