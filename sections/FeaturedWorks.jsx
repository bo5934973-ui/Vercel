"use client";

import { WorkCard } from "@/components/WorkCard";
import { useLiveContent } from "@/components/LiveContentProvider";

export function FeaturedWorks() {
  const { content } = useLiveContent();
  const { worksSection, works } = content;

  return (
    <section id="works" className="scroll-mt-24 overflow-hidden bg-white px-3 py-20 text-[#1d1d1f] md:px-5 md:py-28">
      <div className="mx-auto max-w-[1720px]">
        <div className="mx-auto mb-12 max-w-[1120px] px-2 text-center md:mb-16">
          <h2 className="text-[clamp(2.6rem,4.5vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#1d1d1f]">
            {worksSection.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {works.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
