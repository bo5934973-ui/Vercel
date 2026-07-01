import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blackBg px-6 text-center text-white">
      <div>
        <h1 className="text-5xl font-semibold">作品未找到</h1>
        <p className="mt-4 text-white/60">这个项目案例暂时不可访问。</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-medium text-blackBg"
        >
          返回作品
        </Link>
      </div>
    </main>
  );
}
