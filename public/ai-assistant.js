(function () {
  const functionPaths = Array.from(
    new Set([
      window.location.protocol === "file:"
        ? "http://127.0.0.1:5173/.netlify/functions/chat"
        : "/.netlify/functions/chat",
      `${window.location.origin}/.netlify/functions/chat`,
      "http://127.0.0.1:5173/.netlify/functions/chat"
    ])
  );
  const fallback = "目前网站资料中没有相关信息，可以通过联系方式进一步咨询 Jason。";
  const starters = ["随便聊聊", "帮我想个海报方向", "看看我的想法"];
  const state = {
    open: false,
    loading: false,
    messages: [
      {
        role: "assistant",
        content:
          "嗨，我是 Jason的助手。你可以问我 Jason 的设计服务，也可以直接丢一个想法、图片方向或灵感问题过来，我会尽量像个真实的设计搭子一样陪你聊。"
      }
    ]
  };

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function renderMessages(container) {
    container.innerHTML = "";
    state.messages.forEach((message) => {
      const item = createElement("div", `jason-ai-message ${message.role}`, message.content);
      container.appendChild(item);
    });

    if (state.loading) {
      container.appendChild(createElement("div", "jason-ai-message assistant", "正在整理网站资料..."));
    }

    if (state.error) {
      container.appendChild(createElement("div", "jason-ai-error", state.error));
    }

    container.scrollTop = container.scrollHeight;
  }

  function setLoading(value, root) {
    state.loading = value;
    root.querySelector(".jason-ai-send").disabled = value;
    root.querySelectorAll(".jason-ai-chip").forEach((button) => {
      button.disabled = value;
    });
    renderMessages(root.querySelector(".jason-ai-messages"));
  }

  async function sendMessage(text, root) {
    const content = text.trim();
    if (!content || state.loading) return;

    const input = root.querySelector(".jason-ai-input");
    state.error = "";
    state.messages.push({ role: "user", content });
    input.value = "";
    setLoading(true, root);

    try {
      let response;
      let data;
      let lastError;
      const payload = JSON.stringify({
        messages: state.messages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent
        }))
      });

      for (const path of functionPaths) {
        try {
          response = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
          });
          data = await response.json();
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response) {
        throw lastError || new Error("无法连接聊天服务。");
      }
      if (!response.ok) throw new Error(data.error || "聊天服务暂时不可用。");
      state.messages.push({ role: "assistant", content: data.answer || fallback });
    } catch (error) {
      state.error = error.message || "聊天服务暂时不可用。";
    } finally {
      setLoading(false, root);
      input.focus();
    }
  }

  function init() {
    if (document.getElementById("jason-ai-assistant")) return;

    const root = createElement("div");
    root.id = "jason-ai-assistant";

    const panel = createElement("div", "jason-ai-panel jason-ai-glass");
    panel.innerHTML = [
      '<div class="jason-ai-head">',
      '<div><p class="jason-ai-title">Jason的助手</p><p class="jason-ai-subtitle">设计、品牌与作品集咨询</p></div>',
      '<button class="jason-ai-close" type="button" aria-label="关闭 Jason的助手">×</button>',
      "</div>",
      '<div class="jason-ai-messages"></div>',
      '<div class="jason-ai-composer">',
      '<div class="jason-ai-prompts"></div>',
      '<form class="jason-ai-form">',
      '<textarea class="jason-ai-input" placeholder="问问 Jason 的设计服务..."></textarea>',
      '<button class="jason-ai-send" type="submit" aria-label="发送消息">➤</button>',
      "</form>",
      "</div>"
    ].join("");

    const launcher = createElement("button", "jason-ai-launcher jason-ai-glass");
    launcher.type = "button";
    launcher.setAttribute("aria-label", "打开 Jason的助手");
    launcher.innerHTML = [
      '<span class="jason-ai-icon" aria-hidden="true">',
      '<svg viewBox="0 0 24 24" focusable="false">',
      '<path d="M8.1 7.1c.9-2.15 2.65-3.18 4.9-2.86 1.85.26 3.02 1.22 3.76 2.9" />',
      '<circle cx="12" cy="8.55" r="3.22" />',
      '<path d="M6.05 19.5c.9-3.35 2.85-5.05 5.95-5.05s5.05 1.7 5.95 5.05" />',
      '<path d="M15.85 14.9l3.25-3.25 1.25 1.25-3.25 3.25-1.75.5.5-1.75Z" />',
      "</svg>",
      '</span><span class="jason-ai-label">Jason的助手</span>'
    ].join("");

    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    const messages = root.querySelector(".jason-ai-messages");
    const input = root.querySelector(".jason-ai-input");
    const prompts = root.querySelector(".jason-ai-prompts");

    starters.forEach((prompt) => {
      const chip = createElement("button", "jason-ai-chip", prompt);
      chip.type = "button";
      chip.addEventListener("click", () => sendMessage(prompt, root));
      prompts.appendChild(chip);
    });

    launcher.addEventListener("click", () => {
      state.open = !state.open;
      panel.classList.toggle("is-open", state.open);
      launcher.querySelector(".jason-ai-icon").classList.toggle("is-open", state.open);
      if (state.open) window.setTimeout(() => input.focus(), 80);
    });

    root.querySelector(".jason-ai-close").addEventListener("click", () => {
      state.open = false;
      panel.classList.remove("is-open");
      launcher.querySelector(".jason-ai-icon").classList.remove("is-open");
    });

    root.querySelector(".jason-ai-form").addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value, root);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(input.value, root);
      }
    });

    renderMessages(messages);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
