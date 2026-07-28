"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
  FileJson,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
  Upload,
  X,
  XCircle
} from "lucide-react";
import { normalizeSiteContent, siteContent } from "@/data/contentFallback";

const STORAGE_KEY = "jason-portfolio-admin-draft";
const LIVE_CONTENT_CACHE_KEY = "jason-portfolio-live-content-v6";
const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || "/api/content";
const MEDIA_API_URL = process.env.NEXT_PUBLIC_MEDIA_API_URL || "/api/media";

const EDITOR_SECTIONS = [
  { id: "hero", label: "首页首屏", hint: "标题、简介与按钮" },
  { id: "works", label: "作品管理", hint: "作品内容与图片" },
  { id: "about", label: "关于我", hint: "介绍与技能标签" },
  { id: "growth", label: "成长历程", hint: "年份、阶段与能力标签" },
  { id: "contact", label: "联系方式", hint: "邮箱与行动按钮" },
  { id: "site", label: "网站设置", hint: "名称、页脚与简历" }
];

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

function isValidContent(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.site &&
      value.hero &&
      value.worksSection &&
      value.about &&
      value.contact &&
      Array.isArray(value.works)
  );
}

function Field({ label, value, onChange, multiline = false, placeholder = "", type = "text", autoComplete }) {
  const className =
    "admin-field-input mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition";

  return (
    <label className="block">
      <span className="admin-field-label text-xs font-semibold tracking-[0.04em]">
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
          type={type}
          autoComplete={autoComplete}
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
      <div className="admin-notice flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-4 text-zinc-900">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isLoading ? "animate-spin text-zinc-500" : isError ? "text-red-500" : "text-emerald-600"
          }`}
        />
        <p className="min-w-0 flex-1 text-sm leading-6">{notice.text}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-zinc-400 transition hover:bg-[#eef5ff] hover:text-[#1d1d1f]"
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
    "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition active:scale-[0.98] sm:w-auto";
  const styles =
    variant === "solid"
      ? "admin-primary-button"
      : "admin-secondary-button border";

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

function ResumeUploadButton({ disabled, uploading, onUpload }) {
  return (
    <label
      className={`admin-primary-button inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition active:scale-[0.98] sm:w-auto ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Upload className="h-4 w-4" />
      {uploading ? "正在上传 PDF..." : "上传简历 PDF"}
      <input
        type="file"
        accept="application/pdf,.pdf"
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
    <div className="admin-image-preview relative aspect-[4/3] overflow-hidden rounded-2xl border">
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
    <div className="admin-surface-card rounded-2xl border p-3">
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
                className="admin-secondary-button inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium"
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
    <div className="admin-surface-card rounded-2xl border p-3">
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
          <div key={`${image}-${imageIndex}`} className="admin-subtle-panel grid gap-3 rounded-2xl p-3 sm:grid-cols-[150px_1fr]">
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
                    className="admin-secondary-button inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium"
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
          <div className="admin-subtle-panel rounded-2xl px-4 py-8 text-center text-sm text-zinc-500">
            还没有详情图片，点击“添加详情图片”上传第一张。
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [content, setContent] = useState(() => normalizeSiteContent(siteContent));
  const [savedContentJson, setSavedContentJson] = useState(() =>
    JSON.stringify(normalizeSiteContent(siteContent))
  );
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(0);
  const [mobilePane, setMobilePane] = useState("edit");
  const previewRef = useRef(null);

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
          const normalizedContent = normalizeSiteContent(data.content);
          setContent(normalizedContent);
          setSavedContentJson(JSON.stringify(normalizedContent));
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
          setContent(normalizeSiteContent(JSON.parse(saved)));
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

  useEffect(() => {
    const sendPreviewContent = () => {
      previewRef.current?.contentWindow?.postMessage(
        { type: "portfolio-preview-content", content },
        "*"
      );
    };

    sendPreviewContent();
    const receivePreviewReady = (event) => {
      if (event.data?.type === "portfolio-preview-ready") sendPreviewContent();
    };
    window.addEventListener("message", receivePreviewReady);
    return () => window.removeEventListener("message", receivePreviewReady);
  }, [content]);

  useEffect(() => {
    if (selectedWorkIndex >= content.works.length) {
      setSelectedWorkIndex(Math.max(0, content.works.length - 1));
    }
  }, [content.works.length, selectedWorkIndex]);

  useEffect(() => {
    if (selectedJourneyIndex >= content.growth.items.length) {
      setSelectedJourneyIndex(Math.max(0, content.growth.items.length - 1));
    }
  }, [content.growth.items.length, selectedJourneyIndex]);

  const jsonPreview = useMemo(() => JSON.stringify(content, null, 2), [content]);
  const contentJson = useMemo(() => JSON.stringify(content), [content]);
  const isDirty = contentJson !== savedContentJson;

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

    if (!file.type.startsWith("image/") || file.size > 12 * 1024 * 1024) {
      showNotice("图片必须是支持的格式，且不能超过 12MB。", "error");
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

  const uploadResumePdf = async (file) => {
    if (!password.trim()) {
      showNotice("上传 PDF 前，请先在右侧输入后台密码。", "error");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      showNotice("请上传 PDF 格式的简历文件。", "error");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showNotice("PDF 不能超过 12MB。", "error");
      return;
    }

    setUploadingKey("resume-pdf");
    showNotice(`正在上传简历 PDF：${file.name}`, "loading");

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
          contentType: "application/pdf",
          data: dataUrl
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "简历 PDF 上传失败。");
      }

      setContent((current) => ({
        ...current,
        site: { ...current.site, resumeUrl: data.url },
        hero: { ...current.hero, resumeUrl: data.url }
      }));
      showNotice("简历 PDF 已上传并写入下载链接，确认后请保存到线上。");
    } catch (error) {
      showNotice(error.message || "简历 PDF 上传失败。", "error");
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
      setSavedContentJson(JSON.stringify(content));
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
      const normalizedContent = normalizeSiteContent(data.content);
      setContent(normalizedContent);
      setSavedContentJson(JSON.stringify(normalizedContent));
      window.localStorage.setItem(
        LIVE_CONTENT_CACHE_KEY,
        JSON.stringify(normalizedContent)
      );
      showNotice("已恢复为线上最新内容。");
    } catch {
      setContent(normalizeSiteContent(siteContent));
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
      const importedContent = JSON.parse(text);
      if (!isValidContent(importedContent)) throw new Error("invalid-content");
      setContent(normalizeSiteContent(importedContent));
      showNotice("已导入内容文件，确认无误后可保存到线上。");
    } catch {
      showNotice("导入失败，请确认文件是正确的 JSON。", "error");
    }
  };

  const addWork = () => {
    const title = "New Project";
    setSelectedWorkIndex(content.works.length);
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
    if (!window.confirm("确定删除这个作品吗？保存到线上后才会正式生效。")) return;
    setSelectedWorkIndex((current) => {
      if (current > workIndex) return current - 1;
      if (current === workIndex) return Math.max(0, current - 1);
      return current;
    });
    setContent((current) => ({
      ...current,
      works: current.works.filter((_, index) => index !== workIndex)
    }));
    showNotice("已删除该作品。保存到线上后才会正式生效。");
  };

  const addJourneyItem = () => {
    setContent((current) => {
      const nextItems = [
        ...current.growth.items,
        {
          year: String(new Date().getFullYear()),
          chapter: "新阶段",
          title: "新的成长节点",
          description: "补充这一阶段的主要经历、能力变化和代表性成果。",
          focus: ["能力标签"]
        }
      ];
      setSelectedJourneyIndex(nextItems.length - 1);
      return {
        ...current,
        growth: { ...current.growth, items: nextItems }
      };
    });
    showNotice("已新增一段成长历程。");
  };

  const updateJourneyItem = (journeyIndex, field, value) => {
    setContent((current) => ({
      ...current,
      growth: {
        ...current.growth,
        items: current.growth.items.map((item, index) =>
          index === journeyIndex ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeJourneyItem = (journeyIndex) => {
    if (content.growth.items.length <= 1) {
      showNotice("成长历程至少保留一项。", "error");
      return;
    }
    if (!window.confirm("确定删除这段成长历程吗？保存到线上后才会正式生效。")) {
      return;
    }
    setContent((current) => ({
      ...current,
      growth: {
        ...current.growth,
        items: current.growth.items.filter((_, index) => index !== journeyIndex)
      }
    }));
    setSelectedJourneyIndex((current) => Math.max(0, current - 1));
    showNotice("已删除这段成长历程。");
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
    <main className="portfolio-admin-page admin-shell min-h-[100dvh] px-3 pb-24 pt-3 text-[#1d1d1f] sm:px-4 sm:pt-4 xl:h-[100dvh] xl:overflow-hidden xl:pb-4">
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />

      <div className="mx-auto max-w-[1800px]">
        <div className="admin-topbar mb-3 flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#0071e3]">
              JASON QIU · CONTENT STUDIO
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">
              网站内容后台
            </h1>
            <p className="mt-1 hidden max-w-2xl text-xs leading-5 text-zinc-500 lg:block">
              可直接修改文字。更换图片时先输入右侧后台密码，再在作品卡片里点击“更换图片”。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium ${isDirty ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              <span className={`mr-2 h-1.5 w-1.5 rounded-full ${isDirty ? "bg-amber-500" : "bg-emerald-500"}`} />
              {isDirty ? "有未发布修改" : "内容已同步"}
            </span>
            <Link href="/" className="admin-secondary-button rounded-xl border px-3 py-2 text-center text-sm font-medium transition active:scale-[0.98]">
              查看网站
            </Link>
            <button onClick={saveDraft} className="admin-secondary-button inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition active:scale-[0.98]">
              <Save className="h-4 w-4" />
              保存草稿
            </button>
            <button onClick={downloadJson} className="admin-secondary-button hidden items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition active:scale-[0.98] sm:inline-flex">
              <Download className="h-4 w-4" />
              导出 JSON
            </button>
          </div>
        </div>

        <div className="admin-section-tabs mb-3 flex gap-1 overflow-x-auto rounded-2xl border p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-6">
          {EDITOR_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                setActiveSection(section.id);
                setMobilePane("edit");
              }}
              className={`min-w-[116px] rounded-xl px-3 py-2 text-left transition sm:min-w-0 ${
                activeSection === section.id
                  ? "admin-section-tab-active text-white"
                  : "text-zinc-600 hover:bg-[#eef5ff] hover:text-[#1d1d1f]"
              }`}
            >
              <span className="block whitespace-nowrap text-sm font-semibold">{section.label}</span>
              <span className={`mt-0.5 hidden text-[11px] lg:block ${activeSection === section.id ? "text-white/55" : "text-zinc-400"}`}>
                {section.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 xl:h-[calc(100dvh-166px)] xl:grid-cols-[minmax(420px,560px)_minmax(0,1fr)]">
          <div className={`${mobilePane === "preview" ? "hidden" : "block"} admin-editor-panel min-h-[520px] overflow-hidden rounded-[24px] border xl:block xl:h-full`}>
            <div className="h-full space-y-5 overflow-y-auto p-4 pb-24 sm:p-6 xl:pb-8">
            <SectionCard title="网站设置" sectionId="site" activeSection={activeSection}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="网站名称" value={content.site.name} onChange={(value) => setPath(["site", "name"], value)} />
                <Field label="职业描述" value={content.site.role} onChange={(value) => setPath(["site", "role"], value)} />
                <Field label="页脚左侧" value={content.site.footerLeft} onChange={(value) => setPath(["site", "footerLeft"], value)} />
                <Field label="页脚右侧" value={content.site.footerRight} onChange={(value) => setPath(["site", "footerRight"], value)} />
              </div>
              <div className="admin-subtle-panel mt-4 rounded-2xl border p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Field
                    label="简历 PDF 下载链接"
                    value={content.site.resumeUrl}
                    onChange={(value) => {
                      setPath(["site", "resumeUrl"], value);
                      setPath(["hero", "resumeUrl"], value);
                    }}
                    placeholder="/Jason-Qiu-Resume.pdf"
                  />
                  <ResumeUploadButton
                    disabled={Boolean(uploadingKey)}
                    uploading={uploadingKey === "resume-pdf"}
                    onUpload={uploadResumePdf}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>上传 PDF 后请点击“保存到线上”，访客下载按钮会使用这里的链接。</span>
                  {content.site.resumeUrl && (
                    <a
                      href={content.site.resumeUrl}
                      target="_blank"
                      className="admin-secondary-button inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium text-zinc-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      打开当前文件
                    </a>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="首页首屏" sectionId="hero" activeSection={activeSection}>
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

            <SectionCard title="作品区标题" sectionId="works" activeSection={activeSection}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="小标题" value={content.worksSection.eyebrow} onChange={(value) => setPath(["worksSection", "eyebrow"], value)} />
                <Field label="大标题" value={content.worksSection.title} onChange={(value) => setPath(["worksSection", "title"], value)} />
              </div>
            </SectionCard>

            <SectionCard title="关于我" sectionId="about" activeSection={activeSection}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="小标题" value={content.about.eyebrow} onChange={(value) => setPath(["about", "eyebrow"], value)} />
                <Field label="标题" value={content.about.title} onChange={(value) => setPath(["about", "title"], value)} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="介绍文字" value={content.about.description} onChange={(value) => setPath(["about", "description"], value)} multiline />
                <ArrayField label="技能标签（一行一个）" values={content.about.skills} onChange={(value) => setPath(["about", "skills"], value)} />
              </div>
            </SectionCard>

            <SectionCard
              title="成长历程"
              sectionId="growth"
              activeSection={activeSection}
              action={
                <button
                  type="button"
                  onClick={addJourneyItem}
                  className="admin-primary-button inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  新增历程
                </button>
              }
            >
              <div className="admin-growth-overview mb-5 grid gap-4 rounded-2xl border p-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-[#0071e3]">
                    前台模块文案
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    下方内容会同步到首页的成长历程模块，右侧预览会即时更新。
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="顶部小标题"
                    value={content.growth.eyebrow}
                    onChange={(value) => setPath(["growth", "eyebrow"], value)}
                  />
                  <Field
                    label="主标题"
                    value={content.growth.title}
                    onChange={(value) => setPath(["growth", "title"], value)}
                  />
                  <Field
                    label="强调标题"
                    value={content.growth.highlight}
                    onChange={(value) => setPath(["growth", "highlight"], value)}
                  />
                  <Field
                    label="统计标签"
                    value={content.growth.summaryLabel}
                    onChange={(value) => setPath(["growth", "summaryLabel"], value)}
                  />
                </div>
                <Field
                  label="模块说明"
                  value={content.growth.description}
                  onChange={(value) => setPath(["growth", "description"], value)}
                  multiline
                />
                <Field
                  label="统计说明"
                  value={content.growth.summaryText}
                  onChange={(value) => setPath(["growth", "summaryText"], value)}
                />
              </div>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {content.growth.items.map((item, index) => (
                  <button
                    key={`journey-tab-${index}`}
                    type="button"
                    onClick={() => setSelectedJourneyIndex(index)}
                    aria-pressed={selectedJourneyIndex === index}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedJourneyIndex === index
                        ? "admin-section-tab-active text-white"
                        : "admin-secondary-button border text-zinc-600"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")} · {item.year || "未填写年份"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {content.growth.items.map((item, index) => (
                  <div
                    key={`journey-editor-${index}`}
                    className={`${
                      selectedJourneyIndex === index ? "block" : "hidden"
                    } admin-growth-item rounded-2xl border p-4`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.08em] text-[#0071e3]">
                          阶段 {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">
                          {item.title || "未命名成长节点"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeJourneyItem(index)}
                        disabled={content.growth.items.length <= 1}
                        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field
                        label="年份"
                        value={item.year}
                        onChange={(value) => updateJourneyItem(index, "year", value)}
                      />
                      <Field
                        label="阶段名称"
                        value={item.chapter}
                        onChange={(value) => updateJourneyItem(index, "chapter", value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Field
                        label="阶段标题"
                        value={item.title}
                        onChange={(value) => updateJourneyItem(index, "title", value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Field
                        label="阶段说明"
                        value={item.description}
                        onChange={(value) =>
                          updateJourneyItem(index, "description", value)
                        }
                        multiline
                      />
                    </div>
                    <div className="mt-4">
                      <ArrayField
                        label="能力标签（一行一个）"
                        values={item.focus}
                        onChange={(value) => updateJourneyItem(index, "focus", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="联系方式" sectionId="contact" activeSection={activeSection}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="标题" value={content.contact.title} onChange={(value) => setPath(["contact", "title"], value)} />
                <Field label="邮箱" value={content.contact.email} onChange={(value) => setPath(["contact", "email"], value)} />
                <Field label="按钮文字" value={content.contact.buttonText} onChange={(value) => setPath(["contact", "buttonText"], value)} />
                <Field label="说明文字" value={content.contact.description} onChange={(value) => setPath(["contact", "description"], value)} />
              </div>
            </SectionCard>

            <SectionCard
              title="作品列表"
              sectionId="works"
              activeSection={activeSection}
              action={
                <button onClick={addWork} className="admin-primary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium active:scale-[0.98]">
                  <Plus className="h-4 w-4" />
                  新增作品
                </button>
              }
            >
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {content.works.map((work, index) => (
                  <button
                    key={`${work.slug}-tab-${index}`}
                    type="button"
                    onClick={() => setSelectedWorkIndex(index)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedWorkIndex === index
                        ? "admin-section-tab-active text-white"
                        : "admin-secondary-button border text-zinc-600"
                    }`}
                  >
                    {index + 1}. {work.title || "未命名作品"}
                  </button>
                ))}
              </div>
              <div className="space-y-5">
                {content.works.map((work, index) => (
                  <div
                    key={`${work.slug}-${index}`}
                    className={`${selectedWorkIndex === index ? "block" : "hidden"} admin-subtle-panel rounded-2xl border p-4`}
                  >
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
          </div>

          <aside className={`${mobilePane === "edit" ? "hidden" : "flex"} min-h-[620px] flex-col gap-3 xl:flex xl:h-full xl:min-h-0`}>
            <div className="admin-preview-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-white/55" />
                  <span className="text-sm font-medium">实时网站预览 · 1:1</span>
                </div>
                <Link href="/" target="_blank" className="inline-flex items-center gap-1 text-xs text-white/60 transition hover:text-white">
                  新窗口打开 <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="h-[calc(100dvh-210px)] min-h-[520px] flex-1 bg-white xl:h-auto xl:min-h-0">
                <iframe
                  ref={previewRef}
                  src="/?admin-preview=1"
                  title="网站实时预览"
                  onLoad={() =>
                    previewRef.current?.contentWindow?.postMessage(
                      { type: "portfolio-preview-content", content },
                      "*"
                    )
                  }
                  className="h-full w-full border-0 bg-white xl:h-[200%] xl:w-[200%] xl:origin-top-left xl:scale-50"
                />
              </div>
            </div>

            <div className="admin-publish-card shrink-0 rounded-2xl border p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-zinc-500" />
                <h2 className="text-base font-semibold">发布更改</h2>
              </div>
              <Field
                label="后台密码"
                value={password}
                onChange={setPassword}
                placeholder="输入 ADMIN_PASSWORD"
                type="password"
                autoComplete="current-password"
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <button
                  onClick={saveOnline}
                  disabled={isSaving || isLoading || !isDirty}
                  className="admin-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isSaving ? "正在保存..." : "保存到线上"}
                </button>
                <button onClick={resetToOnline} className="admin-secondary-button inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition active:scale-[0.98]">
                  <RefreshCw className="h-4 w-4" />
                  重新加载线上内容
                </button>
                <button onClick={saveDraft} className="admin-secondary-button inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition active:scale-[0.98]">
                  <Save className="h-4 w-4" />
                  本机草稿
                </button>
                <label className="admin-secondary-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition active:scale-[0.98]">
                  <FileJson className="h-4 w-4" />
                  导入 JSON
                  <input type="file" accept="application/json" onChange={(event) => importJson(event.target.files?.[0])} className="hidden" />
                </label>
              </div>
              <details className="mt-2">
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

        <div className="admin-mobile-dock fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-1 rounded-2xl border p-1.5 backdrop-blur-xl xl:hidden">
          <button
            type="button"
            onClick={() => setMobilePane("edit")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${mobilePane === "edit" ? "admin-section-tab-active text-white" : "text-zinc-600"}`}
          >
            <Settings2 className="h-4 w-4" />
            编辑内容
          </button>
          <button
            type="button"
            onClick={() => setMobilePane("preview")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${mobilePane === "preview" ? "admin-section-tab-active text-white" : "text-zinc-600"}`}
          >
            <Eye className="h-4 w-4" />
            网站预览
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionCard({ title, action, children, sectionId, activeSection }) {
  return (
    <section
      className={`${sectionId && sectionId !== activeSection ? "hidden" : "block"}`}
    >
      <div className="admin-section-heading mb-5 grid gap-3 border-b pb-4 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
