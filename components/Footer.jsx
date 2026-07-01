"use client";

import { useLiveContent } from "@/components/LiveContentProvider";

export function Footer() {
  const { content } = useLiveContent();
  const { site } = content;

  return (
    <footer className="border-t border-black/10 bg-whiteBg px-6 py-8 text-sm text-textSoft md:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span>{site.footerLeft}</span>
        <span>{site.footerRight}</span>
      </div>
    </footer>
  );
}
