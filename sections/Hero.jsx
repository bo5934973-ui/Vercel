"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Hero() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const visualY = useTransform(scrollY, [0, 900], [0, reducedMotion ? 0 : 84]);
  const fade = useTransform(scrollY, [0, 720], [1, 0.72]);
  const { content } = useLiveContent();
  const { hero, works } = content;
  const heroWorks = works.slice(0, 3);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#f5f5f7] px-5 pb-20 pt-24 text-[#1d1d1f] md:px-10 md:pb-28 md:pt-28 lg:pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0))]" />
      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center text-center">
        <div className="max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-semibold leading-none tracking-normal md:text-7xl lg:text-8xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-3xl text-2xl font-medium leading-9 text-[#1d1d1f] md:mt-5 md:text-4xl md:leading-[1.18]"
          >
            {hero.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#works"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0071e3] px-7 text-base font-medium text-white transition hover:bg-[#0077ed] active:scale-[0.98]"
            >
              {hero.primaryButton}
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#0071e3] px-7 text-base font-medium text-[#0071e3] transition hover:bg-[#0071e3] hover:text-white active:scale-[0.98]"
            >
              {hero.secondaryButton}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: visualY }}
          className="relative mt-12 h-[420px] w-full max-w-[1180px] md:mt-16 md:h-[540px] lg:h-[620px]"
        >
          <div className="absolute inset-x-6 bottom-0 h-24 rounded-[50%] bg-black/10 blur-3xl" />
          {heroWorks.map((work, index) => (
            <a
              key={work.slug}
              href={`/work/?slug=${encodeURIComponent(work.slug)}`}
              className={[
                "group absolute overflow-hidden rounded-[28px] bg-white shadow-[0_34px_90px_rgba(30,36,48,0.18)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(30,36,48,0.24)]",
                index === 0 ? "bottom-0 left-1/2 z-30 h-[86%] w-[40%] -translate-x-1/2" : "",
                index === 1 ? "bottom-8 left-[3%] z-20 h-[62%] w-[26%] rotate-[-4deg]" : "",
                index === 2 ? "bottom-10 right-[3%] z-20 h-[60%] w-[26%] rotate-[4deg]" : ""
              ].join(" ")}
              aria-label={work.title}
            >
              <img
                src={`${work.coverImage}?v=apple-home-1`}
                alt={work.title}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_46%,rgba(0,0,0,0.08))]" />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
