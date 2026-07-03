"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { siteContent as fallbackContent } from "@/data/contentFallback";

const LIVE_CONTENT_CACHE_KEY = "jason-portfolio-live-content-v6";
const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || "/api/content";
const CONTENT_REQUEST_TIMEOUT = 3500;

const ContentContext = createContext({
  content: fallbackContent,
  isLiveContentLoading: false
});

export function LiveContentProvider({ initialContent = fallbackContent, children }) {
  const [content, setContent] = useState(initialContent);
  const [isLiveContentLoading, setIsLiveContentLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), CONTENT_REQUEST_TIMEOUT);

    async function loadContent() {
      try {
        const cachedContent = window.localStorage.getItem(LIVE_CONTENT_CACHE_KEY);
        if (cachedContent) {
          const parsedContent = JSON.parse(cachedContent);
          if (isMounted) setContent(parsedContent);
        }
      } catch {
        window.localStorage.removeItem(LIVE_CONTENT_CACHE_KEY);
      }

      if (isMounted) setIsLiveContentLoading(true);

      try {
        const response = await fetch(CONTENT_API_URL, {
          cache: "no-store",
          signal: controller.signal
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
        }
        window.clearTimeout(timeout);
      }
    }

    loadContent();

    return () => {
      isMounted = false;
      controller.abort();
      window.clearTimeout(timeout);
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
