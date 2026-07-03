"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileJson,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
  XCircle
} from "lucide-react";
import { siteContent } from "@/data/contentFallback";

const STORAGE_KEY = "jason-portfolio-admin-draft";
const LIVE_CONTENT_CACHE_KEY = "jason-portfolio-live-content-v6";
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

function NoticeDialog({ notice, onClose }) {
  if (!notice) return null;

  const isLoading = notice.type === "loading";
  const isError = notice.type === "error";
  const Icon = isLoading ? Loader2 : isError ? XCircle : CheckCircle2;

  return (
    <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4" role="status" aria-live="polite">
      <div className="flex w-full max-w-md items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 text-zinc-900 shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isLoading ? "animate-spin text-zinc-500" : isError ? "text-red-500" : "text-emerald-600"
          }`}
        />
        <p className="min-w-0 flex-1 text-sm leading-6">{notice.text}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="关闭提示"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function UploadButton({ label, disabled, onUpload, variant = "solid" }) {
  const base =
    "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:w-auto";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:bg-zinc-800"
      : "border border-black/10 bg-white text-zinc-900 hover:bg-zinc-50";

  return (
    <label className={`${base} ${styles} ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <ImagePlus className="h-4 w-4" />
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

function ImagePreview({ src, title = "图片预览" }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 bg-zinc-100">
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-400">
          <ImagePlus className="h-8 w-8" />
          <span className="text-xs">暂无图片</span>
        </div>
      )}
    </div>
  );
}

function CoverImageEditor({ image, disabled, uploading, onChange, onUpload }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-[220px_1fr]">
        <ImagePreview src={image} title="封面预览" />
        <div className="flex min-w-0 flex-col justify-between gap-4">
          <Field label="封面图片路径" value={image} onChange={onChange} />
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <UploadButton
              label={uploading ? "正在更换..." : "更换封面图片"}
              disabled={disabled}
              onUpload={onUpload}
            />
            {image && (
              <a
                href={image}
                target="_blank"
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                打开原图
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryImageEditor({ images, disabled, uploadingKey, onChange, onUpload, onRemove }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3">
        <div className="mb-3 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">详情图片</p>
          <p className="mt-1 text-xs text-zinc-500">每张图都可以单独更换，新增图片会追加到最后。</p>
        </div>
        <UploadButton
          label={uploadingKey === "new" ? "正在添加..." : "添加详情图片"}
          disabled={disabled}
          onUpload={(file) => onUpload(file, "new")}
          variant="outline"
        />
      </div>

      <div className="space-y-3">
        {(images || []).map((image, imageIndex) => (
          <div key={`${image}-${imageIndex}`} className="grid gap-3 rounded-2xl bg-zinc-50 p-3 sm:grid-cols-[150px_1fr]">
            <ImagePreview src={image} title={`详情图 ${imageIndex + 1}`} />
            <div className="flex min-w-0 flex-col justify-between gap-3">
              <Field
                label={`详情图 ${imageIndex + 1} 路径`}
                value={image}
                onChange={(value) => onChange(imageIndex, value)}
              />
              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <UploadButton
                  label={uploadingKey === String(imageIndex) ? "正在更换..." : "更换这张图"}
                  disabled={disabled}
                  onUpload={(file) => onUpload(file, String(imageIndex))}
                  variant="outline"
                />
                {image && (
                  <a
                    href={image}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    打开
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(imageIndex)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!images || images.length === 0) && (
          <div className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
            还没有详情图片，点击“添加详情图片”上传第一张。
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [content, setContent] = useState(() => cloneContent(siteContent));
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState("");

  const showNotice = (text, type = "success") => {
    setNotice({ text, type, id: Date.now() });
  };

  useEffect(() => {
    if (!notice || notice.type === "loading") return undefined;
    const timer = window.setTimeout(() => setNotice(null), 3800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let isMounted = true;

    async function loadOnlineContent() {
      try {
        const response = await fetch(CONTENT_API_URL, { cache: "no-store" });
        const data = await response.json();
        if (isMounted && response.ok && data.content) {
          setContent(data.content);
          showNotice("已加载线上最新内容。");
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
          showNotice("线上内容暂时不可用，已加载本机草稿。");
        } catch {
          showNotice("线上内容暂时不可用，已使用内置内容。", "error");
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
    showNotice("已保存到本机浏览器草稿。");
  };

  const uploadImage = async (file, onUploaded, label) => {
    if (!password.trim()) {
      showNotice("上传图片前，请先在右侧输入后台密码。", "error");
      return;
    }

    setUploadingKey(label);
    showNotice(`正在上传图片：${file.name}`, "loading");

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
      showNotice("图片已更换。确认效果后，记得点击“保存到线上”。");
    } catch (error) {
      showNotice(error.message || "图片上传失败。", "error");
    } finally {
      setUploadingKey("");
    }
  };

  const saveOnline = async () => {
    if (!password.trim()) {
      showNotice("请先输入后台密码。", "error");
      return;
    }

    setIsSaving(true);
    showNotice("正在保存到线上...", "loading");

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
      showNotice("已保存到线上。刷新网站页面即可看到最新内容。");
    } catch (error) {
      showNotice(error.message || "保存失败，请稍后重试。", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const resetToOnline = async () => {
    setIsLoading(true);
    showNotice("正在重新加载线上内容...", "loading");
    try {
      const response = await fetch(CONTENT_API_URL, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.content) throw new Error();
      setContent(data.content);
      window.localStorage.setItem(LIVE_CONTENT_CACHE_KEY, JSON.stringify(data.content));
      showNotice("已恢复为线上最新内容。");
    } catch {
      setContent(cloneContent(siteContent));
      showNotice("线上内容暂时不可用，已恢复为内置内容。", "error");
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
    showNotice("已导出 site.json，可作为备份。");
  };

  const importJson = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      setContent(JSON.parse(text));
      showNotice("已导入内容文件，确认无误后可保存到线上。");
    } catch {
      showNotice("导入失败，请确认文件是正确的 JSON。", "error");
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
    showNotice("已新增作品，可以开始编辑。");
  };

  const removeWork = (workIndex) => {
    setContent((current) => ({
      ...current,
      works: current.works.filter((_, index) => index !== workIndex)
    }));
    showNotice("已删除该作品。保存到线上后才会正式生效。");
  };

  const updateWork = (workIndex, field, value) => {
    setContent((current) => ({
      ...current,
      works: current.works.map((work, index) =>
        index === workIndex ? { ...work, [field]: value } : work
      )
    }));
  };

  const updateGalleryImage = (workIndex, imageIndex, value) => {
    setContent((current) => ({
      ...current,
      works: current.works.map((work, index) => {
        if (index !== workIndex) return work;
        const images = [...(work.images || [])];
        images[imageIndex] = value;
        return { ...work, images };
      })
    }));
  };

  const removeGalleryImage = (workIndex, imageIndex) => {
    setContent((current) => ({
      ...current,
      works: current.works.map((work, index) =>
        index === workIndex
          ? { ...work, images: (work.images || []).filter((_, itemIndex) => itemIndex !== imageIndex) }
          : work
      )
    }));
    showNotice("已移除这张详情图。");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 pb-10 pt-16 text-zinc-950 sm:px-5 md:px-10 md:pb-16 md:pt-24">
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Portfolio Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal md:text-5xl">
              网站内容后台
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              可直接修改文字。更换图片时先输入右侧后台密码，再在作品卡片里点击“更换图片”。
            </p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-center text-sm font-medium">
              查看网站
            </Link>
            <button onClick={saveDraft} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              <Save className="h-4 w-4" />
              保存草稿
            </button>
            <button onClick={downloadJson} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              <Download className="h-4 w-4" />
              导出 JSON
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5 lg:space-y-6">
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
              action={
                <button onClick={addWork} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  新增作品
                </button>
              }
            >
              <div className="space-y-5">
                {content.works.map((work, index) => (
                  <div key={`${work.slug}-${index}`} className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{work.title || `作品 ${index + 1}`}</h3>
                        <p className="mt-1 text-xs text-zinc-500">封面用于作品列表，详情图片用于作品详情页。</p>
                      </div>
                      <button onClick={() => removeWork(index)} className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-sm text-red-600">
                        <Trash2 className="h-4 w-4" />
                        删除
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="标题" value={work.title} onChange={(value) => updateWork(index, "title", value)} />
                      <Field label="链接别名 slug" value={work.slug} onChange={(value) => updateWork(index, "slug", slugify(value))} />
                      <Field label="分类" value={work.category} onChange={(value) => updateWork(index, "category", value)} />
                      <Field label="年份" value={work.year} onChange={(value) => updateWork(index, "year", value)} />
                      <ArrayField label="标签（一行一个）" values={work.tags} onChange={(value) => updateWork(index, "tags", value)} />
                    </div>

                    <div className="mt-4">
                      <Field label="作品描述" value={work.description} onChange={(value) => updateWork(index, "description", value)} multiline />
                    </div>

                    <div className="mt-4 space-y-4">
                      <CoverImageEditor
                        image={work.coverImage}
                        disabled={Boolean(uploadingKey)}
                        uploading={uploadingKey === `cover-${index}`}
                        onChange={(value) => updateWork(index, "coverImage", value)}
                        onUpload={(file) =>
                          uploadImage(file, (url) => updateWork(index, "coverImage", url), `cover-${index}`)
                        }
                      />

                      <GalleryImageEditor
                        images={work.images}
                        disabled={Boolean(uploadingKey)}
                        uploadingKey={uploadingKey.startsWith(`gallery-${index}-`) ? uploadingKey.replace(`gallery-${index}-`, "") : ""}
                        onChange={(imageIndex, value) => updateGalleryImage(index, imageIndex, value)}
                        onRemove={(imageIndex) => removeGalleryImage(index, imageIndex)}
                        onUpload={(file, imageKey) =>
                          uploadImage(
                            file,
                            (url) => {
                              if (imageKey === "new") {
                                updateWork(index, "images", [...(work.images || []), url]);
                                return;
                              }
                              updateGalleryImage(index, Number(imageKey), url);
                            },
                            `gallery-${index}-${imageKey}`
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <aside className="order-first space-y-4 lg:order-none">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft sm:rounded-3xl sm:p-5 lg:sticky lg:top-20">
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isSaving ? "正在保存..." : "保存到线上"}
                </button>
                <button onClick={resetToOnline} className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium">
                  <RefreshCw className="h-4 w-4" />
                  重新加载线上内容
                </button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 text-center text-sm font-medium">
                  <FileJson className="h-4 w-4" />
                  导入 JSON
                  <input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} className="hidden" />
                </label>
              </div>
              <details className="mt-4 lg:open">
                <summary className="cursor-pointer rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700">
                  查看 JSON 预览
                </summary>
                <pre className="mt-3 max-h-[320px] overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-5 text-zinc-100 lg:max-h-[420px]">
                  {jsonPreview}
                </pre>
              </details>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-soft sm:rounded-3xl md:p-6">
      <div className="mb-4 grid gap-3 sm:mb-5 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
