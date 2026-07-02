"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Contact() {
  const { content } = useLiveContent();
  const { contact } = content;
  const buttonClass =
    "inline-flex h-12 min-w-[132px] items-center justify-center rounded-full border border-black/10 bg-white px-7 text-base font-medium text-textDark shadow-[0_12px_34px_rgba(29,29,31,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-white hover:shadow-[0_18px_46px_rgba(29,29,31,0.14)] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1d1d1f]/20 focus:ring-offset-2 focus:ring-offset-whiteBg";

  return (
    <section id="contact" className="relative overflow-hidden bg-whiteBg px-6 py-24 md:px-20 md:py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(210,226,255,0.6),transparent_68%)] blur-3xl" />
      <div className="relative mx-auto max-w-[860px] text-center">
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(29,29,31,0.14)]">
          <Mail className="h-5 w-5 text-textDark" />
        </div>
        <h2 className="text-4xl font-semibold leading-[1.08] tracking-normal text-textDark md:text-[56px]">
          {contact.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-textSoft">
          {contact.description}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={`mailto:${contact.email}`} className={buttonClass}>
            {contact.buttonText}
          </Link>
          <Link href="#resume" className={buttonClass}>
            查看简历
          </Link>
        </div>
        <p className="mt-5 text-sm font-medium text-[#6e6e73]">{contact.email}</p>
      </div>
    </section>
  );
}
