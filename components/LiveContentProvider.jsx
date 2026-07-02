"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { siteContent as fallbackContent } from "@/data/contentFallback";

const LIVE_CONTENT_CACHE_KEY = "jason-portfolio-live-content-v6";
const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || "/api/content";

const ContentContext = createContext({
  content: fallbackContent,
  isLiveContentLoading: false
});

export function LiveContentProvider({ initialContent = fallbackContent, children }) {
  const [content, setContent] = useState(initialContent);
  const [isLiveContentLoading, setIsLiveContentLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const showPage = () => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("content-pending");
      });
    };

    async function loadContent() {
      let hasCachedContent = false;

      try {
        const cachedContent = window.localStorage.getItem(LIVE_CONTENT_CACHE_KEY);
        if (cachedContent) {
          const parsedContent = JSON.parse(cachedContent);
          hasCachedContent = true;
          setContent(parsedContent);
          showPage();
        }
      } catch {
        window.localStorage.removeItem(LIVE_CONTENT_CACHE_KEY);
      }

      try {
        const response = await fetch(CONTENT_API_URL, {
          cache: "no-store"
        });
        const data = await response.json();
        if (isMounted && response.ok && data.content) {
          setContent(data.content);
          window.localStorage.setItem(LIVE_CONTENT_CACHE_KEY, JSON.stringify(data.content));
        }
      } catch {
        // Keep the built-in content if the live store is not available locally.
      } finally {
        if (isMounted) {
          setIsLiveContentLoading(false);
          if (!hasCachedContent) showPage();
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ content, isLiveContentLoading }),
    [content, isLiveContentLoading]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useLiveContent() {
  return useContext(ContentContext);
}
