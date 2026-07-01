import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tag } from "@/components/Tag";
import { siteContent } from "@/data/siteContent";
import { getWorkBySlug, works } from "@/data/works";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export function generateMetadata({ params }) {
  const work = getWorkBySlug(params.slug);

  if (!work) {
    return {
      title: `作品未找到 - ${siteContent.site.name}`
    };
  }

  return {
    title: `${work.title} - ${siteContent.site.name}`,
    description: work.description
  };
}

export default function CaseStudyPage({ params }) {
  const work = getWorkBySlug(params.slug);
  const { caseStudy } = siteContent;

  if (!work) {
    notFound();
  }

  return (
    <main className="bg-whiteBg text-textDark">
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

      <section className="px-6 py-20 md:px-20 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-3">
          {caseStudy.infoBlocks.map((block) => (
            <InfoBlock key={block.title} title={block.title}>
              {block.body}
            </InfoBlock>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] space-y-8">
          {work.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-[16/9] overflow-hidden rounded-work bg-white shadow-soft"
            >
              <Image
                src={image}
                alt={`${work.title} 图片 ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

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
              {caseStudy.summaryBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {work.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <Link
              href="/#works"
              className="mt-10 inline-flex rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-medium text-blackBg transition hover:bg-cool"
            >
              {caseStudy.backButton}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="rounded-work border border-black/8 bg-white p-7 shadow-soft">
      <h2 className="text-2xl font-semibold leading-8">{title}</h2>
      <p className="mt-4 text-base leading-7 text-textSoft">{children}</p>
    </div>
  );
}
