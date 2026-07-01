"use client";

import { Tag } from "@/components/Tag";
import { useLiveContent } from "@/components/LiveContentProvider";

export function About() {
  const { content } = useLiveContent();
  const { about } = content;

  return (
    <section id="about" className="bg-blackBg px-6 py-24 text-white md:px-20 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[0.72fr_1fr] md:gap-20">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-white/42">
            {about.eyebrow}
          </p>
          <h2 className="text-5xl font-semibold leading-[1.08] tracking-normal md:text-[64px]">
            {about.title}
          </h2>
        </div>
        <div className="max-w-3xl">
          <p className="text-2xl leading-10 text-white/76 md:text-[32px] md:leading-[48px]">
            {about.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {about.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
