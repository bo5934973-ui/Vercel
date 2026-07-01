import { siteContent } from "@/data/siteContent";

export const works = siteContent.works;

export function getWorkBySlug(slug) {
  return works.find((work) => work.slug === slug);
}
