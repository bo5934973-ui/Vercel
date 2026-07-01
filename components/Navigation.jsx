"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useEffect, useState } from "react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Navigation() {
  const { content } = useLiveContent();
  const { site } = content;
  const [activeHref, setActiveHref] = useState("/#works");
  const mouseX = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 26, mass: 0.35 });
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const navItems = [
    { href: "/#works", label: "作品" },
    { href: "/#about", label: "关于" },
    { href: "/#contact", label: "联系" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveHref(`/#${visible.target.id}`);
        }
      },
      { threshold: [0.28, 0.44, 0.62], rootMargin: "-18% 0px -44% 0px" }
    );

    navItems.forEach((item) => {
      const node = document.getElementById(item.href.replace("/#", ""));
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

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
        className="group relative mx-auto flex h-14 max-w-[1040px] items-center justify-between gap-4 overflow-hidden rounded-full border border-black/[0.08] bg-white/78 px-4 text-sm text-[#1d1d1f]/72 shadow-[0_20px_70px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-2xl md:px-5"
        aria-label="主导航"
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 h-44 w-44 rounded-full bg-[#0071e3]/12 blur-3xl"
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
          className="relative z-10 min-w-0 shrink truncate rounded-full px-2 py-2 font-medium tracking-[0.01em] text-[#1d1d1f] transition hover:text-black"
        >
          {site.name}
        </Link>
        <div className="relative z-10 flex shrink-0 items-center gap-1 rounded-full border border-black/[0.07] bg-white/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveHref(item.href)}
              className="relative rounded-full px-3 py-1.5 text-xs transition sm:px-4 sm:text-sm"
              style={{ color: activeHref === item.href ? "#ffffff" : "#1d1d1f" }}
              href={item.href}
            >
              {activeHref === item.href ? (
                <motion.span
                  layoutId="floating-nav-active"
                  className="absolute inset-0 rounded-full bg-[#1d1d1f] shadow-[0_8px_26px_rgba(0,0,0,0.18)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10 whitespace-nowrap">{item.label}</span>
            </motion.a>
          ))}
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
            <Link
              className="block whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition"
              style={{ color: "#1d1d1f" }}
              href="/admin/"
            >
            管理
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
