import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useFranchise } from "@/contexts/FranchiseContext";

const EXCLUDED_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password", "/learn/", "/dashboard"];
const isExcluded = (p: string) => EXCLUDED_PREFIXES.some((x) => p.startsWith(x));

function extractId(html: string): string | null {
  return html.match(/[?&]id=(G-[A-Z0-9]+)/i)?.[1] ?? null;
}

declare global { interface Window { gtag?: (...a: any[]) => void; dataLayer?: any[]; } }

export function AnalyticsTracker() {
  const location = useLocation();
  const { branding } = useFranchise();
  const injected = useRef(false);
  const ready = useRef(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (injected.current || !branding.seo_custom_head_scripts) return;
    injected.current = true;

    // Step 1: Inject the raw script exactly as the user pasted it.
    // This is the proven-working approach (tag detected confirms it loads).
    // GA4 will auto-fire the initial page_view for the current page.
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

    // Record the initial path so we don't double-fire on SPA nav
    lastPath.current = window.location.pathname + window.location.search;

    // Step 2: After gtag.js loads, disable Enhanced Measurement's
    // automatic history-change tracking so /dashboard isn't auto-tracked.
    const id = extractId(branding.seo_custom_head_scripts);
    if (!id) { ready.current = true; return; }

    const waitForGtag = (attempts = 0) => {
      if (typeof window.gtag === "function") {
        // Re-configure: keeps the property active but stops auto page_view on history changes
        window.gtag("config", id, { send_page_view: false });
        ready.current = true;
      } else if (attempts < 20) {
        setTimeout(() => waitForGtag(attempts + 1), 200);
      }
    };
    waitForGtag();
  }, [branding.seo_custom_head_scripts]);

  // Step 3: Fire page_view manually on SPA navigations to public pages only
  useEffect(() => {
    const path = location.pathname + location.search;
    if (path === lastPath.current) return; // skip if same as last (or initial)
    lastPath.current = path;
    if (isExcluded(location.pathname) || !ready.current) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  return null;
}
