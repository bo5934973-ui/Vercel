"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  CaseStudyGallery,
  CaseStudyNarrative
} from "@/components/CaseStudyShowcase";
import { Tag } from "@/components/Tag";
import { useLiveContent } from "@/components/LiveContentProvider";

export default function LiveWorkPage() {
  return (
    <Suspense fallback={<main className="work-page min-h-screen bg-whiteBg" />}>
      <LiveWorkContent />
    </Suspense>
  );
}

function LiveWorkContent() {
  const params = useSearchParams();
  const slug = params.get("slug");
  const { content } = useLiveContent();
  const work = content.works.find((item) => item.slug === slug) || content.works[0];
  const { caseStudy } = content;
  const detailBlocks = work.caseStudy || caseStudy.infoBlocks;

  if (!work) {
    return (
      <main className="work-page min-h-screen bg-whiteBg px-6 pt-28 text-textDark md:px-20">
        <div className="mx-auto max-w-[900px]">
          <h1 className="text-4xl font-semibold">作品不存在</h1>
          <Link href="/#works" className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white">
            返回作品列表
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="work-page bg-whiteBg text-textDark">
      <section className="bg-blackBg px-6 pb-20 pt-28 text-white md:px-20 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/#works"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {caseStudy.backText}
          </Link>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/42">
                {work.category}
              </p>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-normal md:text-[72px]">
                {work.title}
              </h1>
            </div>
            <p className="max-w-2xl text-xl leading-8 text-white/68">
              {work.description}
            </p>
          </div>
          <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-work border border-white/10 bg-white/[0.04]">
            <Image
              src={work.coverImage}
              alt={work.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CaseStudyNarrative blocks={detailBlocks} />
      <CaseStudyGallery images={work.images} title={work.title} />

      <section className="bg-blackBg px-6 py-20 text-white md:px-20 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/42">
              {caseStudy.summaryEyebrow}
            </p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              {caseStudy.summaryTitle}
            </h2>
          </div>
          <div>
            <p className="text-xl leading-9 text-white/68">
              {work.impact || caseStudy.summaryBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {work.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/#works"
                className="inline-flex rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-medium text-blackBg transition hover:bg-cool"
              >
                {caseStudy.backButton}
              </Link>
              <Link
                href="/#contact"
                className="inline-flex rounded-full border border-white/18 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {caseStudy.contactButton || "联系我"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
