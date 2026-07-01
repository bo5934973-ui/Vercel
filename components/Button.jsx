import Link from "next/link";

const styles = {
  primary:
    "border-white/20 bg-white text-blackBg shadow-glow hover:bg-cool hover:text-textDark",
  secondary:
    "border-white/15 bg-white/5 text-white backdrop-blur-xl hover:border-white/35 hover:bg-white/12"
};

export function Button({ href, children, variant = "primary", className = "" }) {
  const classNames = [
    "inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition duration-300",
    "focus:outline-none focus:ring-2 focus:ring-white/35 focus:ring-offset-2 focus:ring-offset-blackBg",
    styles[variant],
    className
  ].join(" ");

  if (href) {
    return (
      <Link className={classNames} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={classNames}>{children}</button>;
}
