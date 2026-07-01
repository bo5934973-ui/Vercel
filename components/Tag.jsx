export function Tag({ children, tone = "dark" }) {
  const isLight = tone === "light";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-[13px] leading-[18px]",
        isLight
          ? "border-black/10 bg-black/[0.04] text-textSoft"
          : "border-white/12 bg-white/[0.06] text-white/70"
      ].join(" ")}
    >
      {children}
    </span>
  );
}
