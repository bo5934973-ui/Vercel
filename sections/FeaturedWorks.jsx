"use client";

import { WorkCard } from "@/components/WorkCard";
import { useLiveContent } from "@/components/LiveContentProvider";

export function FeaturedWorks() {
  const { content } = useLiveContent();
  const { worksSection, works } = content;

  return (
    <section id="works" className="scroll-mt-24 overflow-hidden bg-white px-5 py-20 text-[#1d1d1f] md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 max-w-[920px] md:mb-16">
          <h2 className="text-[clamp(2.6rem,4.5vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#1d1d1f]">
            {worksSection.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 xl:grid-cols-3">
          {works.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
