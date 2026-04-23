import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export interface FranchiseBranding {
    id: string | null;
    name: string;
    lms_name: string;
    logo_url: string | null;
    favicon_url: string | null;
    primary_color: string;
    support_email: string | null;
    domain_verified: boolean;
    maintenance_mode: boolean;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    seo_og_title: string | null;
    seo_og_description: string | null;
    seo_og_image: string | null;
    seo_twitter_card: string | null;
    seo_twitter_handle: string | null;
    seo_technical_sitemap: boolean;
    seo_technical_robots_txt: boolean;
    seo_technical_schema_markup: boolean;
    seo_technical_canonical_tags: boolean;
    seo_custom_head_scripts: string | null;
}

const DEFAULT_BRANDING: FranchiseBranding = {
    id: null,
    name: "AI Shiksha",
    lms_name: "AI Shiksha",
    logo_url: null,
    favicon_url: null,
    primary_color: "#6366f1",
    support_email: null,
    domain_verified: false,
    maintenance_mode: false,
    seo_title: null,
    seo_description: null,
    seo_keywords: null,
    seo_og_title: null,
    seo_og_description: null,
    seo_og_image: null,
    seo_twitter_card: "summary_large_image",
    seo_twitter_handle: null,
    seo_technical_sitemap: true,
    seo_technical_robots_txt: true,
    seo_technical_schema_markup: true,
    seo_technical_canonical_tags: true,
    seo_custom_head_scripts: null,
};

interface FranchiseContextType {
    branding: FranchiseBranding;
    isLoading: boolean;
    refresh: () => void;
}

const FranchiseContext = createContext<FranchiseContextType>({
    branding: DEFAULT_BRANDING,
    isLoading: false,
    refresh: () => { },
});

export function FranchiseProvider({ children }: { children: ReactNode }) {
    const [branding, setBranding] = useState<FranchiseBranding>(DEFAULT_BRANDING);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBranding = async () => {
        try {
            const response = await api.get("/franchises/branding");
            if (response.data) {
                const data = response.data;
                setBranding({
                    id: data.id || null,
                    name: data.name || DEFAULT_BRANDING.name,
                    lms_name: data.lms_name || data.name || DEFAULT_BRANDING.lms_name,
                    logo_url: data.logo_url || null,
                    favicon_url: data.favicon_url || null,
                    primary_color: data.primary_color || DEFAULT_BRANDING.primary_color,
                    support_email: data.support_email || null,
                    domain_verified: data.domain_verified || false,
                    maintenance_mode: data.maintenance_mode || false,
                    seo_title: data.seo_title || null,
                    seo_description: data.seo_description || null,
                    seo_keywords: data.seo_keywords || null,
                    seo_og_title: data.seo_og_title || null,
                    seo_og_description: data.seo_og_description || null,
                    seo_og_image: data.seo_og_image || null,
                    seo_twitter_card: data.seo_twitter_card || "summary_large_image",
                    seo_twitter_handle: data.seo_twitter_handle || null,
                    seo_technical_sitemap: data.seo_technical_sitemap ?? true,
                    seo_technical_robots_txt: data.seo_technical_robots_txt ?? true,
                    seo_technical_schema_markup: data.seo_technical_schema_markup ?? true,
                    seo_technical_canonical_tags: data.seo_technical_canonical_tags ?? true,
                    seo_custom_head_scripts: data.seo_custom_head_scripts || null,
                });

                // Apply primary color as CSS variable
                if (data.primary_color) {
                    applyPrimaryColor(data.primary_color);
                }

                // Update document title
                const titleToUse = data.seo_title || data.lms_name || data.name || "AI Shiksha";
                document.title = titleToUse;

                // Update Favicon reliably by forcing DOM recreation
                if (data.favicon_url) {
                    const iconUrl = getImageUrl(data.favicon_url);

                    // Remove all existing icon links (including the initial placeholder one)
                    document.querySelectorAll("link[rel~='icon'], link[rel='shortcut icon']").forEach(e => e.remove());

                    // Create purely fresh link node
                    const newLink = document.createElement('link');
                    newLink.id = 'dynamic-favicon';
                    newLink.rel = 'icon';
                    newLink.href = `${iconUrl}?v=${new Date().getTime()}`;

                    document.getElementsByTagName('head')[0].appendChild(newLink);
                }

                // Update meta description
                if (data.seo_description) {
                    let metaDescription = document.querySelector('meta[name="description"]');
                    if (!metaDescription) {
                        metaDescription = document.createElement('meta');
                        metaDescription.setAttribute('name', 'description');
                        document.head.appendChild(metaDescription);
                    }
                    metaDescription.setAttribute('content', data.seo_description);
                }

                // Update meta keywords
                if (data.seo_keywords) {
                    let metaKeywords = document.querySelector('meta[name="keywords"]');
                    if (!metaKeywords) {
                        metaKeywords = document.createElement('meta');
                        metaKeywords.setAttribute('name', 'keywords');
                        document.head.appendChild(metaKeywords);
                    }
                    metaKeywords.setAttribute('content', data.seo_keywords);
                }

                // Update Open Graph tags
                const setMetaTag = (property: string, content: string | null, isNameAttr = false) => {
                    const attr = isNameAttr ? 'name' : 'property';
                    let meta = document.querySelector(`meta[${attr}="${property}"]`);
                    if (content) {
                        if (!meta) {
                            meta = document.createElement('meta');
                            meta.setAttribute(attr, property);
                            document.head.appendChild(meta);
                        }
                        meta.setAttribute('content', content);
                    } else if (meta) {
                        meta.remove();
                    }
                };

                setMetaTag('og:title', data.seo_og_title || titleToUse);
                setMetaTag('og:description', data.seo_og_description || data.seo_description);
                if (data.seo_og_image) {
                    setMetaTag('og:image', getImageUrl(data.seo_og_image));
                }
                setMetaTag('twitter:card', data.seo_twitter_card || 'summary_large_image', true);
                if (data.seo_twitter_handle) {
                    setMetaTag('twitter:site', data.seo_twitter_handle, true);
                }

                // Canonical tags
                if (data.seo_technical_canonical_tags) {
                    let canonical = document.querySelector('link[rel="canonical"]');
                    if (!canonical) {
                        canonical = document.createElement('link');
                        canonical.setAttribute('rel', 'canonical');
                        document.head.appendChild(canonical);
                    }
                    canonical.setAttribute('href', window.location.href.split('?')[0]);
                }

                // Custom head scripts
                if (data.seo_custom_head_scripts) {
                    let scriptContainer = document.getElementById('custom-head-scripts');
                    if (!scriptContainer) {
                        scriptContainer = document.createElement('div');
                        scriptContainer.id = 'custom-head-scripts';
                        document.head.appendChild(scriptContainer);
                    }
                    // Insert raw HTML (Note: scripts added via innerHTML do not execute,
                    // but for meta tags and valid tracking pixels it can work.
                    // For full <script> execution we need a slightly more robust approach)
                    const range = document.createRange();
                    range.selectNode(scriptContainer);
                    const documentFragment = range.createContextualFragment(data.seo_custom_head_scripts);
                    scriptContainer.innerHTML = '';
                    scriptContainer.appendChild(documentFragment);
                }

                if (data.favicon_url) {
                    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                    if (link) {
                        link.href = data.favicon_url;
                    } else {
                        const newLink = document.createElement('link');
                        newLink.rel = 'icon';
                        newLink.href = data.favicon_url;
                        document.head.appendChild(newLink);
                    }
                }
            }
        } catch {
            // Silently fall back to defaults — franchise branding is non-critical
            setBranding(DEFAULT_BRANDING);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranding();
    }, []);

    return (
        <FranchiseContext.Provider value={{ branding, isLoading, refresh: fetchBranding }}>
            {children}
        </FranchiseContext.Provider>
    );
}

export function useFranchise() {
    return useContext(FranchiseContext);
}

/**
 * Converts a hex color to HSL and applies it as --primary CSS variable.
 * This allows Tailwind's `text-primary`, `bg-primary`, etc. to use franchise colors.
 */
function applyPrimaryColor(hex: string) {
    try {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        const hDeg = Math.round(h * 360);
        const sPct = Math.round(s * 100);
        const lPct = Math.round(l * 100);

        document.documentElement.style.setProperty('--primary', `${hDeg} ${sPct}% ${lPct}%`);
    } catch {
        // Ignore color conversion errors
    }
}
