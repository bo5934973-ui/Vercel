"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/data/contentFallback";

const STORAGE_KEY = "jason-portfolio-admin-draft";
const LIVE_CONTENT_CACHE_KEY = "jason-portfolio-live-content";
const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || "/api/content";
const MEDIA_API_URL = process.env.NEXT_PUBLIC_MEDIA_API_URL || "/api/media";

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || `work-${Date.now()}`
  );
}

function updateAtPath(source, path, nextValue) {
  const copy = cloneContent(source);
  let target = copy;
  for (let index = 0; index < path.length - 1; index += 1) {
    target = target[path[index]];
  }
  target[path[path.length - 1]] = nextValue;
  return copy;
}

function Field({ label, value, onChange, multiline = false, placeholder = "" }) {
  const className =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/40";

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${className} resize-y`}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

function ArrayField({ label, values, onChange }) {
  return (
    <Field
      label={label}
      value={(values || []).join("\n")}
      onChange={(value) =>
        onChange(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))
      }
      multiline
    />
  );
}

function UploadButton({ label, disabled, onUpload }) {
  return (
    <label className={`inline-flex cursor-pointer rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      {label}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onUpload(file);
        }}
      />
    </label>
  );
}

export default function AdminPage() {
  const [content, setContent] = useState(() => cloneContent(siteContent));
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOnlineContent() {
      try {
        const response = await fetch(CONTENT_API_URL, { cache: "no-store" });
        const data = await response.json();
        if (isMounted && response.ok && data.content) {
          setContent(data.content);
          setMessage("已加载线上最新内容。");
          return;
        }
      } catch {
        // Fall through to local draft or built-in content.
      } finally {
        if (isMounted) setIsLoading(false);
      }

      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && isMounted) {
        try {
          setContent(JSON.parse(saved));
          setMessage("线上内容暂时不可用，已加载本机草稿。");
        } catch {
          setMessage("线上内容暂时不可用，已使用内置内容。");
        }
      }
    }

    loadOnlineContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const jsonPreview = useMemo(() => JSON.stringify(content, null, 2), [content]);

  const setPath = (path, value) => {
    setContent((current) => updateAtPath(current, path, value));
  };

  const saveDraft = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setMessage("已保存到本机浏览器草稿。");
  };

  const uploadImage = async (file, onUploaded, label) => {
    if (!password.trim()) {
      setMessage("上传图片前，请先在右侧输入后台密码。");
      return;
    }

    setUploadingKey(label);
    setMessage(`正在上传图片：${file.name}`);

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(MEDIA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          filename: file.name,
          contentType: file.type,
          data: dataUrl
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "图片上传失败。");
      }

      onUploaded(data.url);
      setMessage("图片已上传，并已写入图片路径。记得点击“保存到线上”。");
    } catch (error) {
      setMessage(error.message || "图片上传失败。");
    } finally {
      setUploadingKey("");
    }
  };

  const saveOnline = async () => {
    if (!password.trim()) {
      setMessage("请先输入后台密码。");
      return;
    }

    setIsSaving(true);
    setMessage("正在保存到线上...");

    try {
      const response = await fetch(CONTENT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, content })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "保存失败。");
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      window.localStorage.setItem(LIVE_CONTENT_CACHE_KEY, JSON.stringify(content));
      setMessage("已保存到线上。刷新网站页面即可看到最新内容。");
    } catch (error) {
      setMessage(error.message || "保存失败，请稍后重试。");
    } finally {
      setIsSaving(false);
    }
  };

  const resetToOnline = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(CONTENT_API_URL, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.content) throw new Error();
      setContent(data.content);
      window.localStorage.setItem(LIVE_CONTENT_CACHE_KEY, JSON.stringify(data.content));
      setMessage("已恢复为线上最新内容。");
    } catch {
      setContent(cloneContent(siteContent));
      setMessage("线上内容暂时不可用，已恢复为内置内容。");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonPreview], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("已导出 site.json，可作为备份。");
  };

  const importJson = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      setContent(JSON.parse(text));
      setMessage("已导入内容文件，确认无误后可保存到线上。");
    } catch {
      setMessage("导入失败，请确认文件是正确的 JSON。");
    }
  };

  const addWork = () => {
    const title = "New Project";
    setContent((current) => ({
      ...current,
      works: [
        ...current.works,
        {
          title,
          category: "Project Category",
          year: "2026",
          description: "Project description.",
          coverImage: "/works/dalingring-smart-ring.png",
          images: ["/works/dalingring-smart-ring.png"],
          tags: ["Tag"],
          slug: slugify(title)
        }
      ]
    }));
  };

  const removeWork = (workIndex) => {
    setContent((current) => ({
      ...current,
      works: current.works.filter((_, index) => index !== workIndex)
    }));
  };

  const updateWork = (workIndex, field, value) => {
    setContent((current) => ({
      ...current,
      works: current.works.map((work, index) =>
        index === workIndex ? { ...work, [field]: value } : work
      )
    }));
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 pb-16 pt-24 text-zinc-950 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Portfolio Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal md:text-5xl">
              网站内容后台
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              可直接修改文字，也可以上传作品图片。图片上传后会自动填入路径，最后点击保存到线上。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              查看网站
            </Link>
            <button onClick={saveDraft} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              保存草稿
            </button>
            <button onClick={downloadJson} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              导出 JSON
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <SectionCard title="基础信息">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="网站名称" value={content.site.name} onChange={(value) => setPath(["site", "name"], value)} />
                <Field label="职业描述" value={content.site.role} onChange={(value) => setPath(["site", "role"], value)} />
                <Field label="页脚左侧" value={content.site.footerLeft} onChange={(value) => setPath(["site", "footerLeft"], value)} />
                <Field label="页脚右侧" value={content.site.footerRight} onChange={(value) => setPath(["site", "footerRight"], value)} />
              </div>
            </SectionCard>

            <SectionCard title="首页首屏">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="小标题" value={content.hero.eyebrow} onChange={(value) => setPath(["hero", "eyebrow"], value)} />
                <Field label="大标题" value={content.hero.title} onChange={(value) => setPath(["hero", "title"], value)} />
                <Field label="主按钮" value={content.hero.primaryButton} onChange={(value) => setPath(["hero", "primaryButton"], value)} />
                <Field label="副按钮" value={content.hero.secondaryButton} onChange={(value) => setPath(["hero", "secondaryButton"], value)} />
                <Field label="右侧卡片标题" value={content.hero.visualTitle} onChange={(value) => setPath(["hero", "visualTitle"], value)} />
                <Field label="右侧卡片说明" value={content.hero.visualSubtitle} onChange={(value) => setPath(["hero", "visualSubtitle"], value)} />
              </div>
              <div className="mt-4">
                <Field label="简介" value={content.hero.description} onChange={(value) => setPath(["hero", "description"], value)} multiline />
              </div>
            </SectionCard>

            <SectionCard title="作品区">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="小标题" value={content.worksSection.eyebrow} onChange={(value) => setPath(["worksSection", "eyebrow"], value)} />
                <Field label="大标题" value={content.worksSection.title} onChange={(value) => setPath(["worksSection", "title"], value)} />
              </div>
            </SectionCard>

            <SectionCard title="关于我">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="小标题" value={content.about.eyebrow} onChange={(value) => setPath(["about", "eyebrow"], value)} />
                <Field label="标题" value={content.about.title} onChange={(value) => setPath(["about", "title"], value)} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="介绍文字" value={content.about.description} onChange={(value) => setPath(["about", "description"], value)} multiline />
                <ArrayField label="技能标签（一行一个）" values={content.about.skills} onChange={(value) => setPath(["about", "skills"], value)} />
              </div>
            </SectionCard>

            <SectionCard title="联系方式">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="标题" value={content.contact.title} onChange={(value) => setPath(["contact", "title"], value)} />
                <Field label="邮箱" value={content.contact.email} onChange={(value) => setPath(["contact", "email"], value)} />
                <Field label="按钮文字" value={content.contact.buttonText} onChange={(value) => setPath(["contact", "buttonText"], value)} />
                <Field label="说明文字" value={content.contact.description} onChange={(value) => setPath(["contact", "description"], value)} />
              </div>
            </SectionCard>

            <SectionCard
              title="作品列表"
              action={<button onClick={addWork} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">新增作品</button>}
            >
              <div className="space-y-5">
                {content.works.map((work, index) => (
                  <div key={`${work.slug}-${index}`} className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{work.title || `作品 ${index + 1}`}</h3>
                      <button onClick={() => removeWork(index)} className="rounded-full border border-red-200 bg-white px-3 py-1 text-sm text-red-600">
                        删除
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="标题" value={work.title} onChange={(value) => updateWork(index, "title", value)} />
                      <Field label="链接别名 slug" value={work.slug} onChange={(value) => updateWork(index, "slug", slugify(value))} />
                      <Field label="分类" value={work.category} onChange={(value) => updateWork(index, "category", value)} />
                      <Field label="年份" value={work.year} onChange={(value) => updateWork(index, "year", value)} />
                      <Field label="封面图片路径" value={work.coverImage} onChange={(value) => updateWork(index, "coverImage", value)} />
                      <ArrayField label="标签（一行一个）" values={work.tags} onChange={(value) => updateWork(index, "tags", value)} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <UploadButton
                        label={uploadingKey === `cover-${index}` ? "上传中..." : "上传封面图"}
                        disabled={Boolean(uploadingKey)}
                        onUpload={(file) =>
                          uploadImage(file, (url) => updateWork(index, "coverImage", url), `cover-${index}`)
                        }
                      />
                      {work.coverImage && (
                        <a href={work.coverImage} target="_blank" className="text-xs text-zinc-500 underline">
                          预览封面
                        </a>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Field label="作品描述" value={work.description} onChange={(value) => updateWork(index, "description", value)} multiline />
                      <ArrayField label="详情图片路径（一行一个）" values={work.images} onChange={(value) => updateWork(index, "images", value)} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <UploadButton
                        label={uploadingKey === `gallery-${index}` ? "上传中..." : "上传详情图"}
                        disabled={Boolean(uploadingKey)}
                        onUpload={(file) =>
                          uploadImage(
                            file,
                            (url) => updateWork(index, "images", [...(work.images || []), url]),
                            `gallery-${index}`
                          )
                        }
                      />
                      <span className="text-xs text-zinc-500">详情图会追加到图片列表最后一行。</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-20 rounded-3xl border border-black/10 bg-white p-5 shadow-soft">
              <h2 className="text-lg font-semibold">线上保存</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                后台密码来自 Netlify 环境变量 ADMIN_PASSWORD。上传图片或保存内容都需要这个密码。
              </p>
              <Field
                label="后台密码"
                value={password}
                onChange={setPassword}
                placeholder="输入 ADMIN_PASSWORD"
              />
              <div className="mt-4 grid gap-2">
                <button
                  onClick={saveOnline}
                  disabled={isSaving || isLoading}
                  className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isSaving ? "正在保存..." : "保存到线上"}
                </button>
                <button onClick={resetToOnline} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium">
                  重新加载线上内容
                </button>
                <label className="cursor-pointer rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 text-center text-sm font-medium">
                  导入 JSON
                  <input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} className="hidden" />
                </label>
              </div>
              <pre className="mt-5 max-h-[420px] overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-5 text-zinc-100">
                {jsonPreview}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
