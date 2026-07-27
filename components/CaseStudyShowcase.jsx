"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function CaseStudyNarrative({ blocks }) {
  const narrative = blocks
    .map((block) => block.body?.trim())
    .filter(Boolean)
    .join(" ");

  return (
    <section className="px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-[980px] border-y border-black/10 py-10 md:py-16">
        <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-textDark md:mb-9 md:text-5xl">
          概述
        </h2>
        <p className="text-[22px] font-medium leading-[1.75] tracking-[-0.025em] text-textDark md:text-[32px] md:leading-[1.65]">
          {narrative}
        </p>
      </div>
    </section>
  );
}

export function CaseStudyGallery({ images, title }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;

    setActiveIndex(
      Math.min(
        images.length - 1,
        Math.max(0, Math.round(track.scrollLeft / track.clientWidth))
      )
    );
  }, [images.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => track.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const goTo = (index) => {
    const nextIndex = Math.min(images.length - 1, Math.max(0, index));
    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative pb-16 md:pb-28">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${title} 作品图片`}
      >
        {images.map((image, index) => (
          <figure
            key={`${image}-${index}`}
            className="relative aspect-[4/3] min-w-full snap-center overflow-hidden bg-black/5 sm:aspect-[16/10] md:aspect-[16/9]"
          >
            <Image
              src={image}
              alt={`${title} 图片 ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[4/3] items-center justify-between px-3 sm:aspect-[16/10] md:aspect-[16/9] md:px-7">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="查看上一张图片"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-black/25 text-white shadow-[0_10px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-black/45 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:h-12 md:w-12"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === images.length - 1}
          aria-label="查看下一张图片"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-black/25 text-white shadow-[0_10px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-black/45 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:h-12 md:w-12"
        >
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[4/3] items-end justify-center pb-4 sm:aspect-[16/10] md:aspect-[16/9] md:pb-6">
        <div className="flex gap-1.5 rounded-full bg-black/20 p-1.5 backdrop-blur-xl">
          {images.map((image, index) => (
            <span
              key={`${image}-indicator`}
              className={`block h-1 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前为第 {activeIndex + 1} 张，共 {images.length} 张
      </p>
    </section>
  );
}
