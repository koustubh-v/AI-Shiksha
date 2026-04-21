import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Link as LinkIcon } from "lucide-react";

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
  if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
  if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
  if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
  if (p.includes('github')) return <Github className="w-4 h-4" />;
  return <LinkIcon className="w-4 h-4" />;
};
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
      <footer className="w-full bg-[#0e0e0e] border-t border-[#484847]/15 py-12">
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-8 w-8 bg-[#262626] rounded"></div>
            <div className="h-6 w-32 bg-[#262626] rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-[#484847]/15 py-12">
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6 font-body text-xs tracking-tight">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={siteTitle} className="h-6 object-contain" />
            ) : branding.logo_url ? (
              <img src={branding.logo_url} alt={siteTitle} className="h-6 object-contain" />
            ) : null}
            <div className="font-headline font-bold text-[#d2ff9a] text-lg uppercase tracking-widest">{siteTitle}</div>
          </div>
          <p className="text-slate-500 text-center md:text-left max-w-sm">
            Leading the digital transformation of industrial safety training through authoritative AI and comprehensive learning management solutions.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            {customMenus.map((link, idx) => (
              <Link
                key={idx}
                to={link.url}
                className="text-[#d2ff9a] font-bold hover:text-[#21e6ff] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {showSupport && publishedPages.map((page) => (
              <Link
                key={page.slug}
                to={`/p/${page.slug}`}
                className="text-slate-500 hover:text-[#21e6ff] transition-colors"
              >
                {page.title}
              </Link>
            ))}
            
            {showSupport && publishedPages.length === 0 && (
              <Link to="/contact" className="text-slate-500 hover:text-[#21e6ff] transition-colors">
                Contact Us
              </Link>
            )}
          </div>
  
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1a1919] border border-white/10 flex items-center justify-center text-[10px] text-slate-400 hover:text-[#d2ff9a] hover:border-[#d2ff9a]/30 transition-all"
                  title={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
          
          <div className="text-slate-500 uppercase tracking-tighter opacity-80">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}
