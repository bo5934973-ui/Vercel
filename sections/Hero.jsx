"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll
} from "framer-motion";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";
import styles from "./Hero.module.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4";

const DOCK_ITEMS = [
  { href: "#about", label: "关于" },
  { href: "#contact", label: "联系" },
  { href: "#resume", label: "简历" }
];

function ProjectTile({ work, duplicate = false }) {
  return (
    <Link
      href={`/work/?slug=${encodeURIComponent(work.slug)}`}
      className="group relative flex h-20 w-60 shrink-0 items-center gap-3 overflow-hidden rounded-[22px] border border-slate-200/60 bg-white px-3 pr-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_36px_rgba(37,64,97,0.10)] active:translate-y-0 active:scale-[0.99]"
      aria-hidden={duplicate ? "true" : undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <span className={styles.tileWash} aria-hidden="true" />
      <img
        src={work.coverImage}
        alt=""
        className="relative z-10 h-14 w-14 shrink-0 rounded-[15px] object-cover ring-1 ring-black/[0.05] transition-transform duration-500 group-hover:scale-105"
      />
      <span className="relative z-10 min-w-0">
        <strong className="block truncate text-[13px] font-semibold text-[#0a1b33]">
          {work.title}
        </strong>
        <small className="mt-1 block truncate text-[11px] font-medium text-slate-500">
          {work.category}
        </small>
      </span>
      <ChevronRight
        className="relative z-10 ml-auto h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0a1b33]"
        strokeWidth={2}
        aria-hidden="true"
      />
    </Link>
  );
}

function ProjectMarquee({ works }) {
  return (
    <div className="mt-7 md:mt-9" aria-label="精选项目快捷入口">
      <div className={styles.marqueeViewport}>
        <div className={styles.marqueeTrack}>
          <div className={styles.projectSet}>
            {works.map((work) => (
              <ProjectTile key={work.slug} work={work} />
            ))}
          </div>
          <div className={styles.projectSet} aria-hidden="true">
            {works.map((work) => (
              <ProjectTile key={`${work.slug}-duplicate`} work={work} duplicate />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveDockGlass() {
  return (
    <motion.span
      layoutId="hero-dock-active"
      className={styles.dockActive}
      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.72 }}
      aria-hidden="true"
    />
  );
}

function HeroDock({ siteName, activeHref }) {
  return (
    <nav
      aria-label="首页导航"
      className={`${styles.liquidDock} flex items-center p-1.5`}
    >
      <Link
        href="#top"
        aria-label={`${siteName} 首页`}
        aria-current={activeHref === "#top" ? "page" : undefined}
        className={`${styles.dockHome} grid h-9 w-9 shrink-0 place-items-center text-base text-[#0a1b33] transition-transform active:scale-95`}
      >
        {activeHref === "#top" && <ActiveDockGlass />}
        <span className="relative z-10">✦</span>
      </Link>
      {DOCK_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={activeHref === item.href ? "page" : undefined}
          className={`${styles.dockLink} whitespace-nowrap px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors hover:text-[#0a1b33] focus-visible:text-[#0a1b33] sm:px-4`}
        >
          {activeHref === item.href && <ActiveDockGlass />}
          <span className="relative z-10">{item.label}</span>
        </Link>
      ))}
      <Link
        href="#works"
        aria-current={activeHref === "#works" ? "page" : undefined}
        className={`${styles.dockCta} inline-flex items-center gap-1 whitespace-nowrap px-4 py-2 text-[12px] font-semibold text-[#0a1b33] transition-all active:scale-[0.98] sm:px-5`}
      >
        {activeHref === "#works" && <ActiveDockGlass />}
        <span className="relative z-10">查看作品</span>
        <ChevronRight className="relative z-10 h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </Link>
    </nav>
  );
}

export function Hero() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [dockAtTop, setDockAtTop] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");
  const { content } = useLiveContent();
  const { hero, site, works } = content;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setDockAtTop((current) => {
      if (!current && progress > 0.72) return true;
      if (current && progress < 0.58) return false;
      return current;
    });
  });

  useEffect(() => {
    const sectionIds = ["top", "works", "about", "contact", "resume"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current?.target?.id) setActiveHref(`#${current.target.id}`);
      },
      {
        rootMargin: "-32% 0px -58% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="portfolio-video-home overflow-hidden bg-[#f9fafb] px-3 pb-8 pt-3 text-[#0a1b33] md:px-6 md:pb-10 md:pt-5"
    >
      <div className="w-full">
        <div className="relative flex h-[calc(100dvh-32px)] min-h-[640px] max-h-[760px] flex-col overflow-hidden rounded-[36px] border border-slate-200/50 bg-white shadow-[0_40px_100px_-20px_rgba(14,33,59,0.08)] md:rounded-[48px]">
          <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
            <video
              className={`${styles.heroVideo} h-full w-full object-cover`}
              src={VIDEO_URL}
              poster="/works/dalingring-smart-ring.png"
              autoPlay={!reducedMotion}
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          </div>
          <div className={styles.videoScrim} aria-hidden="true" />

          <div className="relative z-20 flex flex-1 flex-col items-start px-8 pt-12 md:px-16 md:pt-16 lg:px-20 lg:pt-20">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 text-[12px] font-semibold tracking-[0.02em] text-slate-500 md:text-[13px]"
            >
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[760px] text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#0a1b33]"
            >
              {hero.title || site.name}
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.64, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[520px] text-[16px] font-medium leading-7 tracking-[-0.018em] text-slate-600 md:text-[18px] md:leading-8"
            >
              {hero.description}
            </motion.p>

            <motion.a
              href="#works"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
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

        <ProjectMarquee works={works} />
      </div>

      <motion.div
        layout
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, scale: dockAtTop ? 0.92 : 1 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 0.45, delay: 0.2 },
                y: { duration: 0.45, delay: 0.2 },
                scale: { type: "spring", stiffness: 330, damping: 30 },
                layout: { type: "spring", stiffness: 300, damping: 32, mass: 0.72 }
              }
        }
        className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center ${
          dockAtTop ? "top-4 md:top-5" : "bottom-8 md:bottom-10"
        }`}
      >
        <div className="pointer-events-auto">
          <HeroDock siteName={site.name} activeHref={activeHref} />
        </div>
      </motion.div>
    </section>
  );
}
