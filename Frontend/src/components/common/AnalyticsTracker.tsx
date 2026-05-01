/**
 * AnalyticsTracker.tsx
 *
 * Injects GA4 with send_page_view: false (disables GA4's automatic
 * Enhanced Measurement history tracking), then manually fires page_view
 * ONLY for allowed public pages.
 *
 * Pages EXCLUDED from tracking:
 *   /login, /signup, /forgot-password, /reset-password
 *   /learn/*     — fullscreen lesson player
 *   /dashboard/* — all private admin & student pages
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useFranchise } from "@/contexts/FranchiseContext";

// ── Exclusion list ──────────────────────────────────────────────────────────
const EXCLUDED_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/learn/",
  "/dashboard",
];

const isExcluded = (pathname: string) =>
  EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

// ── Extract GA4 measurement ID from raw script HTML ──────────────────────--
// Supports: ?id=G-XXXXXXXX  (from gtag.js src URL)
function extractMeasurementId(html: string): string | null {
  const match = html.match(/[?&]id=(G-[A-Z0-9]+)/i);
  return match ? match[1] : null;
}

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
  const measurementId = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  // ── Inject GA4 with send_page_view:false ───────────────────────────────────
  useEffect(() => {
    if (scriptInjected.current) return;
    if (!branding.seo_custom_head_scripts) return;

    const id = extractMeasurementId(branding.seo_custom_head_scripts);
    if (!id) {
      // Fallback: inject raw script as-is (non-GA4 tags e.g. GTM, Hotjar)
      let container = document.getElementById("custom-head-scripts");
      if (!container) {
        container = document.createElement("div");
        container.id = "custom-head-scripts";
        document.head.appendChild(container);
      }
      const range = document.createRange();
      range.selectNode(container);
      const fragment = range.createContextualFragment(branding.seo_custom_head_scripts);
      container.innerHTML = "";
      container.appendChild(fragment);
      scriptInjected.current = true;
      return;
    }

    measurementId.current = id;

    // 1. Load the gtag.js async script
    if (!document.querySelector(`script[src*="${id}"]`)) {
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(gtagScript);
    }

    // 2. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());

    // 3. Configure with send_page_view: false
    //    This disables BOTH the initial auto page_view AND
    //    GA4 Enhanced Measurement's history-change tracking.
    window.gtag("config", id, {
      send_page_view: false,
    });

    scriptInjected.current = true;
  }, [branding.seo_custom_head_scripts]);

  // ── Manually fire page_view on every route change ─────────────────────────
  useEffect(() => {
    // Skip the very first render (we don't fire on load — gtag config handles that)
    if (isFirstRender.current) {
      isFirstRender.current = false;

      // Fire the initial page_view manually for the first page ONLY if it's public
      setTimeout(() => {
        if (!isExcluded(location.pathname) && typeof window.gtag === "function") {
          window.gtag("event", "page_view", {
            page_path: location.pathname + location.search,
            page_title: document.title,
            page_location: window.location.href,
          });
        }
      }, 200); // wait for gtag.js to finish loading
      return;
    }

    if (isExcluded(location.pathname)) return;

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
