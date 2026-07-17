"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  const [activeHref, setActiveHref] = useState(navItems[0].href);
  const itemClass =
    "relative overflow-hidden rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] sm:px-4 sm:text-sm";

  useEffect(() => {
    const sections = navItems
      .map((item) => ({
        ...item,
        id: item.href.split("#")[1]
      }))
      .filter((item) => item.id);

    const syncFromLocation = () => {
      if (window.location.pathname.startsWith("/work")) {
        setActiveHref("/#works");
        return;
      }

      const hashItem = sections.find((item) => `#${item.id}` === window.location.hash);
      if (hashItem) setActiveHref(hashItem.href);
    };

    syncFromLocation();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const nextItem = sections.find((item) => item.id === visible.target.id);
        if (nextItem) setActiveHref(nextItem.href);
      },
      {
        rootMargin: "-32% 0px -58% 0px",
        threshold: [0.08, 0.18, 0.32, 0.48]
      }
    );

    sections.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    window.addEventListener("hashchange", syncFromLocation);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncFromLocation);
    };
  }, [navItems]);

  return (
    <motion.header
      initial={false}
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
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
            <motion.a
              key={item.href}
              whileTap={{ scale: 0.97 }}
              className={`${itemClass} ${
                isActive
                  ? "text-white shadow-[0_8px_24px_rgba(29,29,31,0.16)]"
                  : "text-[#1d1d1f] hover:bg-[#1d1d1f]/8"
              }`}
              href={item.href}
              onClick={() => setActiveHref(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-[#1d1d1f]"
                  transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{item.label}</span>
            </motion.a>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
