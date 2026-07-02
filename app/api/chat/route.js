import { NextResponse } from "next/server";
import { siteContent } from "@/data/contentFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

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

function buildSiteKnowledgeText() {
  const works = siteContent.works
    .map(
      (work) =>
        `- ${work.title} (${work.year}, ${work.category}): ${work.description} Tags: ${(work.tags || []).join(", ")}`
    )
    .join("\n");

  return [
    `网站名称: ${siteContent.site.name}`,
    `职业描述: ${siteContent.site.role}`,
    `首页介绍: ${siteContent.hero.description}`,
    `关于: ${siteContent.about.description}`,
    `技能: ${(siteContent.about.skills || []).join(", ")}`,
    `联系邮箱: ${siteContent.contact.email}`,
    "",
    "作品:",
    works
  ].join("\n");
}

function fixedReply(message) {
  const text = message.toLowerCase();
  if (text.includes("邮箱") || text.includes("联系")) {
    return `可以通过邮箱联系：${siteContent.contact.email}`;
  }
  if (text.includes("作品") || text.includes("案例")) {
    return `网站目前展示了 ${siteContent.works.length} 个作品方向，包括 ${siteContent.works
      .map((work) => work.title)
      .join("、")}。`;
  }
  return "";
}

function buildSystemPrompt() {
  return [
    "你是这个个人作品集网站里的 AI 助手。请用自然、简洁、温和的中文回答。",
    "你可以介绍网站里的作品、服务方向、联系方式，也可以给访客一些设计和作品集建议。",
    "涉及网站主人、作品、联系方式时，只能依据下方网站资料回答；资料没有的信息不要编造。",
    "如果用户问实时新闻、价格、政策、天气等需要联网核实的信息，请说明当前助手没有联网搜索能力。",
    `当前北京时间: ${getChinaDateText()}`,
    "",
    "网站资料:",
    buildSiteKnowledgeText()
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

  const quickAnswer = fixedReply(messages[messages.length - 1].content);
  if (quickAnswer) {
    return json({ answer: quickAnswer });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return json({ error: "Server is missing DEEPSEEK_API_KEY." }, { status: 500 });
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
        temperature: 0.55,
        stream: false,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages]
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
    return json({ answer: answer || "我暂时没有找到合适的回答，可以换个问法试试。" });
  } catch {
    return json({ error: "AI 服务暂时连接不上。" }, { status: 502 });
  }
}
