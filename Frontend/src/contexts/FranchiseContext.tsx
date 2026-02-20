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
