/**
 * AnalyticsTracker.tsx
 *
 * Fires a GA4 page_view event on every React Router navigation.
 * Must be rendered inside <BrowserRouter> and <FranchiseProvider>.
 *
 * Pages excluded from tracking (auth + fullscreen lesson player):
 *   /login, /signup, /forgot-password, /reset-password, /learn/*
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useFranchise } from "@/contexts/FranchiseContext";

// Paths that should NOT be tracked (auth pages & lesson player)
const EXCLUDED_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/learn/",
];

const isExcluded = (pathname: string) =>
  EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function AnalyticsTracker() {
  const location = useLocation();
  const { branding } = useFranchise();
  const scriptInjected = useRef(false);

  // ── Step 1: Inject the custom head script once when branding loads ─────────
  useEffect(() => {
    if (scriptInjected.current) return;
    if (!branding.seo_custom_head_scripts) return;

    let container = document.getElementById("custom-head-scripts");
    if (!container) {
      container = document.createElement("div");
      container.id = "custom-head-scripts";
      document.head.appendChild(container);
    }

    // createContextualFragment executes <script> tags correctly
    const range = document.createRange();
    range.selectNode(container);
    const fragment = range.createContextualFragment(branding.seo_custom_head_scripts);
    container.innerHTML = "";
    container.appendChild(fragment);
    scriptInjected.current = true;
  }, [branding.seo_custom_head_scripts]);

  // ── Step 2: Fire page_view on every route change ──────────────────────────
  useEffect(() => {
    if (isExcluded(location.pathname)) return;

    // Wait a tick so the new page's <title> has updated
    const timer = setTimeout(() => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: location.pathname + location.search,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
