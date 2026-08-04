"use client";

import { WorkCard } from "@/components/WorkCard";
import { useLiveContent } from "@/components/LiveContentProvider";

export function FeaturedWorks() {
  const { content } = useLiveContent();
  const { worksSection, works } = content;
  const workGridClass =
    works.length === 1
      ? "mx-auto max-w-[467px] grid-cols-1"
      : works.length === 2 || works.length === 4
        ? "mx-auto max-w-[955px] grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="works" className="overflow-hidden border-t border-black/[0.07] bg-white px-5 py-20 text-[#1d1d1f] md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-normal text-[#1d1d1f] md:text-5xl lg:text-6xl">
            {worksSection.title}
          </h2>
        </div>
        <div className={`grid gap-5 ${workGridClass}`}>
          {works.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
