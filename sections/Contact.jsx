"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Contact() {
  const { content } = useLiveContent();
  const { contact } = content;

  return (
    <section id="contact" className="relative overflow-hidden bg-whiteBg px-6 py-24 md:px-20 md:py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(210,226,255,0.6),transparent_68%)] blur-3xl" />
      <div className="relative mx-auto max-w-[980px] text-center">
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-soft">
          <Mail className="h-5 w-5 text-textDark" />
        </div>
        <h2 className="text-5xl font-semibold leading-[1.05] tracking-normal text-textDark md:text-[64px]">
          {contact.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-textSoft">
          {contact.description}
        </p>
        <div className="mt-9">
          <Link
            href={`mailto:${contact.email}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-[#1d1d1f] px-7 text-base font-medium text-white shadow-[0_12px_34px_rgba(29,29,31,0.18)] transition hover:bg-black active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1d1d1f]/25 focus:ring-offset-2 focus:ring-offset-whiteBg"
          >
            {contact.buttonText}
          </Link>
        </div>
        <p className="mt-5 text-sm font-medium text-[#6e6e73]">{contact.email}</p>
      </div>
    </section>
  );
}
