"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useLiveContent } from "@/components/LiveContentProvider";

export function Contact() {
  const { content } = useLiveContent();
  const { contact } = content;
  const [wechatCopied, setWechatCopied] = useState(false);
  const copiedResetTimer = useRef(null);
  const wechatId = contact.wechat || contact.phone;
  const buttonClass =
    "inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-6 text-base font-medium text-textDark shadow-[0_12px_34px_rgba(29,29,31,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-white hover:shadow-[0_18px_46px_rgba(29,29,31,0.14)] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1d1d1f]/20 focus:ring-offset-2 focus:ring-offset-whiteBg";

  useEffect(
    () => () => {
      if (copiedResetTimer.current) {
        window.clearTimeout(copiedResetTimer.current);
      }
    },
    []
  );

  const copyWechat = async () => {
    if (!wechatId) return;

    try {
      await navigator.clipboard.writeText(wechatId);
    } catch {
      const input = document.createElement("textarea");
      input.value = wechatId;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setWechatCopied(true);
    if (copiedResetTimer.current) {
      window.clearTimeout(copiedResetTimer.current);
    }
    copiedResetTimer.current = window.setTimeout(() => setWechatCopied(false), 2200);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-black/[0.07] bg-white px-6 py-24 md:px-20 md:py-32"
    >
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
        <div className="mx-auto mt-9 grid max-w-[600px] grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href={`mailto:${contact.email}`} className={buttonClass}>
            {contact.buttonText}
          </Link>
          <Link href={`tel:${contact.phone}`} className={buttonClass}>
            拨打电话
          </Link>
          <button
            type="button"
            onClick={copyWechat}
            disabled={!wechatId}
            className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {wechatCopied ? "微信号已复制" : "添加微信"}
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {wechatCopied ? `微信号 ${wechatId} 已复制` : ""}
        </p>
        <p className="mt-5 text-sm font-medium text-[#6e6e73]">{contact.email}</p>
      </div>
    </section>
  );
}
