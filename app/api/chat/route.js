import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { siteContent as fallbackContent } from "@/data/contentFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const CONTENT_PATH = "content/site.json";
const CONTENT_CACHE_TTL = 60 * 1000;
const DOMAIN_TERMS = [
  "智能硬件",
  "智能穿戴",
  "智能戒指",
  "产品设计",
  "产品视觉",
  "视觉系统",
  "3d",
  "cgi",
  "产品渲染",
  "电商",
  "转化",
  "品牌",
  "视觉识别",
  "海报",
  "活动",
  "ai",
  "界面",
  "ui",
  "ux",
  "发布",
  "作品集",
  "求职"
];

let cachedContent = null;
let cachedAt = 0;

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {})
    }
  });
}

function normalizeMessages(input) {
  if (!Array.isArray(input.messages)) return [];

  return input.messages
    .filter(
      (message) =>
        ["user", "assistant"].includes(message?.role) &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1600)
    }));
}

function isValidContent(content) {
  return content && typeof content === "object" && Array.isArray(content.works);
}

async function getChatContent() {
  if (cachedContent && Date.now() - cachedAt < CONTENT_CACHE_TTL) {
    return cachedContent;
  }

  try {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    const blob = blobs.find((item) => item.pathname === CONTENT_PATH) || blobs[0];

    if (blob?.url) {
      const response = await fetch(blob.url, { cache: "no-store" });
      const content = response.ok ? await response.json() : null;
      if (isValidContent(content)) {
        cachedContent = content;
        cachedAt = Date.now();
        return content;
      }
    }
  } catch {
    // Vercel Blob is optional in local development and preview deployments.
  }

  cachedContent = fallbackContent;
  cachedAt = Date.now();
  return fallbackContent;
}

function getChinaDateText() {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function getSearchText(work) {
  return [
    work.title,
    work.category,
    work.description,
    work.problem,
    work.role,
    work.output,
    work.result,
    work.impact,
    ...(work.tags || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findRelatedWorks(message, content) {
  const query = message.toLowerCase();

  return (content.works || [])
    .map((work) => {
      const searchable = getSearchText(work);
      let score = 0;

      DOMAIN_TERMS.forEach((term) => {
        if (query.includes(term) && searchable.includes(term)) score += 4;
      });

      [work.title, work.category, ...(work.tags || [])].forEach((term) => {
        const normalized = String(term || "").toLowerCase();
        if (normalized && query.includes(normalized)) score += 8;
      });

      if (query.includes("硬件") && /硬件|穿戴|戒指/.test(searchable)) score += 4;
      if (query.includes("渲染") && /3d|cgi|渲染|材质/.test(searchable)) score += 4;
      if (query.includes("品牌") && /品牌|识别|字体/.test(searchable)) score += 4;
      if (query.includes("电商") && /电商|转化|购买/.test(searchable)) score += 4;
      if (query.includes("海报") && /海报|活动|传播/.test(searchable)) score += 4;

      return { ...work, score };
    })
    .filter((work) => work.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

function describeWork(work) {
  return `${work.title}（${work.category}，${work.year}）：${work.description}`;
}

function buildRelatedWorkText(works) {
  return works.map((work) => `- ${describeWork(work)}\n  相关价值：${work.impact || work.result || work.output}`).join("\n");
}

function buildSiteKnowledgeText(content) {
  const works = (content.works || []).map(describeWork).join("\n");

  return [
    `网站名称: ${content.site?.name || "Jason Qiu"}`,
    `职业描述: ${content.site?.role || "产品 / UI / 视觉设计师"}`,
    `首页介绍: ${content.hero?.description || ""}`,
    `关于: ${content.about?.description || ""}`,
    `技能: ${(content.about?.skills || []).join("、")}`,
    `联系邮箱: ${content.contact?.email || ""}`,
    `联系电话: ${content.contact?.phone || ""}`,
    `求职方向: ${content.hero?.seeking || ""}`,
    "",
    "全部作品摘要:",
    works
  ].join("\n");
}

function directReply(message, content, relatedWorks) {
  const text = message.toLowerCase();
  const contact = content.contact || {};

  if (/(邮箱|邮件|联系|沟通|合作|找他|找你)/.test(text)) {
    const channels = [contact.email && `邮箱：${contact.email}`, contact.phone && `电话：${contact.phone}`]
      .filter(Boolean)
      .join("；");
    return `可以直接联系 Jason，${channels}。如果方便，也可以先简单说明项目类型、目标和预计交付时间。`;
  }

  if (/(微信|wechat)/.test(text) && contact.wechat) {
    return `Jason 的微信是 ${contact.wechat}。如果是项目或岗位沟通，附上项目背景或岗位方向会更高效。`;
  }

  if (/(简历|resume|履历)/.test(text)) {
    return `完整简历可以在网站的“简历”区域下载：${content.site?.resumeUrl || content.hero?.resumeUrl || "/Jason-Qiu-Resume.md"}。`;
  }

  if (/(求职|招聘|岗位|应聘)/.test(text)) {
    return `${content.hero?.seeking || content.site?.role || "Jason 专注产品、UI 与视觉设计。"} 如有匹配岗位，可通过 ${contact.email || "网站联系方式"} 发送岗位信息与团队背景。`;
  }

  if (relatedWorks.length && /(作品|案例|项目|做过|推荐|有没有|硬件|渲染|品牌|电商|海报|ai|ui|ux)/.test(text)) {
    const prefix = relatedWorks.length > 1 ? "比较匹配的案例有：" : "最匹配的案例是：";
    return `${prefix}\n${relatedWorks.map((work) => `• ${describeWork(work)}`).join("\n")}\n如果你告诉我你的行业、产品阶段或想解决的问题，我可以继续帮你挑更合适的参考方向。`;
  }

  return "";
}

function buildOfflineReply(message, content, relatedWorks) {
  if (relatedWorks.length) {
    return `我会优先建议你看这${relatedWorks.length > 1 ? "些" : "个"}案例：\n${relatedWorks
      .map((work) => `• ${describeWork(work)}`)
      .join("\n")}\n如果你愿意，可以补充一下你的产品类型、目标用户和现在最卡住的环节，我会按这个思路给你拆解。`;
  }

  return `Jason 的优势集中在 ${(content.about?.skills || ["产品设计", "UI / UX", "视觉系统", "3D / CGI"])
    .slice(0, 4)
    .join("、")}。你可以说说你正在做的产品或项目，我会先帮你梳理适合的设计方向。`;
}

function buildSystemPrompt(content, relatedWorks) {
  return [
    "你是 Jason Qiu 个人作品集网站里的 AI 顾问。请用自然、清晰、有判断力的中文回答。",
    "你的首要任务是理解访客意图：作品匹配、能力判断、设计建议、岗位沟通或联系方式。",
    "回答控制在 2 到 5 句；先直接回答，再在确实需要时追问一个具体问题。不要泛泛地说“可以帮忙”。",
    "谈作品时，说明它为什么与访客的问题相关；谈设计建议时，给可执行的下一步；谈岗位或合作时，引导访客提供必要背景。",
    "涉及 Jason、作品、联系方式和履历时，只能依据下面资料，不能编造报价、可入职时间、客户、项目成果或未展示的经历。",
    "如果用户问新闻、价格、政策、天气等实时信息，请明确说明当前助手不能联网核实。",
    `当前北京时间: ${getChinaDateText()}`,
    "",
    "与当前问题最相关的案例:",
    relatedWorks.length ? buildRelatedWorkText(relatedWorks) : "未找到强匹配案例；请基于完整资料回答，并坦诚说明匹配度。",
    "",
    "网站完整资料:",
    buildSiteKnowledgeText(content)
  ].join("\n");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = normalizeMessages(body);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "Please send a user message." }, { status: 400 });
  }

  const content = await getChatContent();
  const latestMessage = messages[messages.length - 1].content;
  const relatedWorks = findRelatedWorks(latestMessage, content);
  const immediateAnswer = directReply(latestMessage, content, relatedWorks);

  if (immediateAnswer) {
    return json({ answer: immediateAnswer, relatedWorks: relatedWorks.map(({ title, slug }) => ({ title, slug })) });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return json({ answer: buildOfflineReply(latestMessage, content, relatedWorks) });
  }

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        temperature: 0.35,
        stream: false,
        messages: [{ role: "system", content: buildSystemPrompt(content, relatedWorks) }, ...messages]
      })
    });

    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return json(
        { error: data?.error?.message || "AI 服务暂时不可用。" },
        { status: upstream.status }
      );
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    return json({ answer: answer || buildOfflineReply(latestMessage, content, relatedWorks) });
  } catch {
    return json({ answer: buildOfflineReply(latestMessage, content, relatedWorks) });
  }
}
