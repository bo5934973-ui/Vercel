"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useMemo } from "react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Navigation() {
  const { content } = useLiveContent();
  const { site } = content;
  const mouseX = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 26, mass: 0.35 });
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const navItems = useMemo(
    () => [
      { href: "/#works", label: "作品" },
      { href: "/#about", label: "关于" },
      { href: "/#contact", label: "联系" },
      { href: "/#resume", label: "简历" }
    ],
    []
  );
  const itemClass =
    "relative rounded-full px-3 py-1.5 text-xs font-medium text-[#1d1d1f] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-white hover:shadow-[0_8px_24px_rgba(29,29,31,0.16)] active:translate-y-0 active:scale-[0.97] sm:px-4 sm:text-sm";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5"
    >
      <nav
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          mouseX.set(event.clientX - rect.left);
        }}
        className="group relative mx-auto flex h-14 max-w-[720px] items-center justify-between gap-3 overflow-hidden rounded-full border border-black/[0.08] bg-white/78 px-4 text-sm text-[#1d1d1f]/72 shadow-[0_20px_70px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-2xl md:px-5"
        aria-label="主导航"
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 h-44 w-44 rounded-full bg-[#0071e3]/0 blur-3xl transition-colors duration-300 group-hover:bg-[#0071e3]/12"
          style={{ x: glowX }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.68),transparent_34%,rgba(255,255,255,0.28)_64%,transparent)] opacity-75"
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px bg-[#0071e3]/52"
          style={{ width: progressWidth }}
        />
        <Link
          href="/"
          className="relative z-10 shrink-0 rounded-full px-2 py-2 font-medium tracking-[0.01em] text-[#1d1d1f] transition-colors hover:text-black"
        >
          {site.name}
        </Link>
        <div className="relative z-10 flex shrink-0 items-center gap-1 rounded-full border border-black/[0.07] bg-white/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              whileTap={{ scale: 0.97 }}
              className={itemClass}
              href={item.href}
            >
              <span className="relative z-10 whitespace-nowrap">{item.label}</span>
            </motion.a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
