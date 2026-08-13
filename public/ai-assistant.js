(function () {
  const functionPaths = Array.from(
    new Set([
      window.location.protocol === "file:"
        ? "http://127.0.0.1:3000/api/chat/"
        : "/api/chat/",
      `${window.location.origin}/api/chat/`,
      "http://127.0.0.1:3000/api/chat/"
    ])
  );
  const fallback = "目前网站资料中没有相关信息，可以通过联系方式进一步咨询 Jason。";
  const starters = ["我在做智能硬件，推荐案例", "帮我梳理产品发布视觉方向", "Jason 擅长什么？"];
  const state = {
    open: false,
    hidden: false,
    fullscreen: false,
    loading: false,
    messages: [
      {
        role: "assistant",
        content:
          "嗨，我是 Jason 的设计顾问。告诉我你的行业、产品阶段或设计难题，我会匹配相关案例，并给你可执行的下一步建议。"
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
      '<div class="jason-ai-head" data-drag-handle>',
      '<div><p class="jason-ai-title">Jason 的助手</p><p class="jason-ai-subtitle">设计、品牌与作品集咨询</p></div>',
      '<div class="jason-ai-actions">',
      '<button class="jason-ai-fullscreen" type="button" aria-label="全屏打开助手" title="全屏">⛶</button>',
      '<button class="jason-ai-hide" type="button" aria-label="隐藏助手" title="隐藏助手">−</button>',
      '<button class="jason-ai-close" type="button" aria-label="关闭助手" title="关闭">×</button>',
      "</div>",
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

    const reveal = createElement("button", "jason-ai-reveal");
    reveal.type = "button";
    reveal.setAttribute("aria-label", "显示 Jason 的助手");
    reveal.textContent = "AI";

    root.appendChild(panel);
    root.appendChild(launcher);
    root.appendChild(reveal);
    document.body.appendChild(root);

    const homeHero = document.querySelector(".portfolio-video-home");
    if (homeHero && "IntersectionObserver" in window) {
      const syncHeroVisibility = (visible) => {
        root.classList.toggle("is-hero-visible", visible);
      };
      const heroRect = homeHero.getBoundingClientRect();
      syncHeroVisibility(heroRect.bottom > 0 && heroRect.top < window.innerHeight);

      const heroObserver = new IntersectionObserver(
        ([entry]) => syncHeroVisibility(entry.isIntersecting),
        { threshold: 0.08 }
      );
      heroObserver.observe(homeHero);
    }

    const messages = root.querySelector(".jason-ai-messages");
    const input = root.querySelector(".jason-ai-input");
    const prompts = root.querySelector(".jason-ai-prompts");
    const fullscreenButton = root.querySelector(".jason-ai-fullscreen");
    const dragHandle = panel.querySelector("[data-drag-handle]");
    let suppressLauncherClick = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), Math.max(min, max));
    }

    function getDragBounds() {
      const launcherRect = launcher.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const gap = window.matchMedia("(max-width: 640px)").matches ? 62 : 68;
      const panelWidth = state.open ? panelRect.width : 0;
      const panelHeight = state.open ? panelRect.height : 0;

      return {
        minLeft: state.open ? panelWidth - launcherRect.width + 12 : 12,
        maxLeft: window.innerWidth - launcherRect.width - 12,
        minTop: state.open ? panelHeight + gap + 12 : 12,
        maxTop: window.innerHeight - launcherRect.height - 12
      };
    }

    function placeAssistant(left, top) {
      const bounds = getDragBounds();
      root.style.left = `${clamp(left, bounds.minLeft, bounds.maxLeft)}px`;
      root.style.top = `${clamp(top, bounds.minTop, bounds.maxTop)}px`;
      root.style.right = "auto";
      root.style.bottom = "auto";
    }

    function keepAssistantInView() {
      const launcherRect = launcher.getBoundingClientRect();
      placeAssistant(launcherRect.left, launcherRect.top);
    }

    function enableDrag(handle, preventClick) {
      handle.addEventListener("pointerdown", (event) => {
        if (
          (event.pointerType === "mouse" && event.button !== 0) ||
          (handle !== launcher && event.target.closest("button")) ||
          state.fullscreen
        ) return;

        const launcherRect = launcher.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const startLeft = launcherRect.left;
        const startTop = launcherRect.top;
        let moved = false;

        handle.setPointerCapture?.(event.pointerId);

        const move = (moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          if (!moved && Math.hypot(deltaX, deltaY) < 4) return;

          moved = true;
          root.classList.add("is-dragging");
          panel.classList.add("is-dragging");
          placeAssistant(startLeft + deltaX, startTop + deltaY);
        };

        const stop = () => {
          root.classList.remove("is-dragging");
          panel.classList.remove("is-dragging");
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", stop);
          handle.removeEventListener("pointercancel", stop);
          if (moved && preventClick) suppressLauncherClick = true;
        };

        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", stop);
        handle.addEventListener("pointercancel", stop);
      });
    }

    function syncPanelState() {
      panel.classList.toggle("is-open", state.open);
      panel.classList.toggle("is-fullscreen", state.fullscreen && state.open);
      launcher.querySelector(".jason-ai-icon").classList.toggle("is-open", state.open);
      fullscreenButton.setAttribute("aria-pressed", String(state.fullscreen));
      fullscreenButton.setAttribute("aria-label", state.fullscreen ? "退出全屏" : "全屏打开助手");
      fullscreenButton.textContent = state.fullscreen ? "⤢" : "⛶";
    }

    function openAssistant() {
      state.hidden = false;
      state.open = true;
      root.classList.remove("is-hidden");
      syncPanelState();
      window.requestAnimationFrame(keepAssistantInView);
      window.setTimeout(() => input.focus(), 80);
    }

    function closeAssistant() {
      state.open = false;
      syncPanelState();
    }

    function hideAssistant() {
      state.hidden = true;
      state.open = false;
      root.classList.add("is-hidden");
      syncPanelState();
    }

    starters.forEach((prompt) => {
      const chip = createElement("button", "jason-ai-chip", prompt);
      chip.type = "button";
      chip.addEventListener("click", () => sendMessage(prompt, root));
      prompts.appendChild(chip);
    });

    launcher.addEventListener("click", () => {
      if (suppressLauncherClick) {
        suppressLauncherClick = false;
        return;
      }
      if (state.open) closeAssistant();
      else openAssistant();
    });

    root.querySelector(".jason-ai-close").addEventListener("click", closeAssistant);
    root.querySelector(".jason-ai-hide").addEventListener("click", hideAssistant);
    reveal.addEventListener("click", () => {
      state.hidden = false;
      root.classList.remove("is-hidden");
    });
    fullscreenButton.addEventListener("click", () => {
      state.fullscreen = !state.fullscreen;
      syncPanelState();
    });

    enableDrag(launcher, true);
    enableDrag(dragHandle, false);
    window.addEventListener("resize", keepAssistantInView);

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.open) closeAssistant();
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

  function mount() {
    init();
    window.setTimeout(init, 120);
    window.setTimeout(init, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  window.addEventListener("load", init, { once: true });
})();
