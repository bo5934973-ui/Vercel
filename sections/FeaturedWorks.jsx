"use client";

import { WorkCard } from "@/components/WorkCard";
import { useLiveContent } from "@/components/LiveContentProvider";

export function FeaturedWorks() {
  const { content } = useLiveContent();
  const { worksSection, works } = content;

  return (
    <section id="works" className="overflow-hidden bg-[#f5f5f7] px-5 py-20 text-[#1d1d1f] md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-20">
          <p className="mb-4 text-sm font-medium text-[#6e6e73]">
            {worksSection.eyebrow}
          </p>
          <h2 className="text-4xl font-semibold leading-[1.06] tracking-normal text-[#1d1d1f] md:text-6xl lg:text-7xl">
            {worksSection.title}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
