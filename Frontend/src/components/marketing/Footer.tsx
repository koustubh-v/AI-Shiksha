import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useFranchise } from "@/contexts/FranchiseContext";
import { footerSettingsService, FooterSetting } from "@/lib/api/footerSettingsService";
import { pagesService, Page } from "@/lib/api/pagesService";

export default function Footer() {
  const { branding } = useFranchise();
  const [settings, setSettings] = useState<FooterSetting | null>(null);
  const [publishedPages, setPublishedPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [footerData, pagesData] = await Promise.all([
          footerSettingsService.getSettings(),
          pagesService.getPages(),
        ]);
        setSettings(footerData);
        setPublishedPages(pagesData.filter((p) => p.is_published));
      } catch (error) {
        console.error("Failed to load footer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const siteTitle = settings?.site_title || branding.name || "LearnAI";
  const copyrightText = settings?.copyright_text || `© ${new Date().getFullYear()} ${siteTitle} Inc. All rights reserved.`;
  const customMenus = settings?.menus || [];
  const socialLinks = settings?.social_links || [];
  const showSupport = settings?.show_support_section ?? true; // Default true if null

  if (isLoading) {
    return (
      <footer className="bg-coursera-navy text-white">
        <div className="container-coursera py-12 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded"></div>
            <div className="h-6 w-32 bg-white/20 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-coursera-navy text-white">
      <div className="container-coursera py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={siteTitle} className="h-8 object-contain" />
              ) : branding.logo_url ? (
                <img src={branding.logo_url} alt={siteTitle} className="h-8 object-contain" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-coursera-blue">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-lg font-bold">{siteTitle}</span>
            </Link>
            <p className="text-sm text-white/60 mb-4 max-w-sm">
              Empowering learners with world-class education. Discover knowledge that transforms your career and life.
            </p>
            {/* Social Links under description if any */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 mt-6">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white capitalize text-sm"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {customMenus.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {customMenus.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.url}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support Section */}
          {showSupport && (
            <div>
              <h3 className="font-semibold mb-4">Support & Legal</h3>
              <ul className="space-y-2">
                {publishedPages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      to={`/p/${page.slug}`}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
                {/* Fallback minimums if none generated yet */}
                {publishedPages.length === 0 && (
                  <>
                    <li>
                      <Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">{copyrightText}</p>
            
            {showSupport && publishedPages.length > 0 && (
              <div className="flex items-center gap-6 flex-wrap justify-center">
                {publishedPages.slice(0, 3).map((page) => (
                  <Link key={page.slug} to={`/p/${page.slug}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
