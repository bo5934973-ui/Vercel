import siteContent from "../public/content/site.json";

export function normalizeSiteContent(value) {
  const incoming = value && typeof value === "object" ? value : {};
  const incomingGrowth =
    incoming.growth && typeof incoming.growth === "object" ? incoming.growth : {};
  const defaultGrowth = siteContent.growth;
  const incomingItems = Array.isArray(incomingGrowth.items) ? incomingGrowth.items : [];
  const growthItems = incomingItems.length
    ? incomingItems.map((item, index) => ({
        ...(defaultGrowth.items[index] || defaultGrowth.items[0]),
        ...(item && typeof item === "object" ? item : {}),
        focus: Array.isArray(item?.focus) ? item.focus : []
      }))
    : defaultGrowth.items;

  return {
    ...siteContent,
    ...incoming,
    site: { ...siteContent.site, ...(incoming.site || {}) },
    hero: { ...siteContent.hero, ...(incoming.hero || {}) },
    worksSection: { ...siteContent.worksSection, ...(incoming.worksSection || {}) },
    about: { ...siteContent.about, ...(incoming.about || {}) },
    growth: {
      ...defaultGrowth,
      ...incomingGrowth,
      items: growthItems
    },
    contact: { ...siteContent.contact, ...(incoming.contact || {}) },
    caseStudy: { ...siteContent.caseStudy, ...(incoming.caseStudy || {}) },
    works: Array.isArray(incoming.works) ? incoming.works : siteContent.works
  };
}

export { siteContent };
