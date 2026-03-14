import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { pagesService, Page } from "@/lib/api/pagesService";
import { ArrowLeft, Loader2, Link as LinkIcon, Share2 } from "lucide-react";
import UnifiedNavbar from "@/components/layout/UnifiedNavbar";
import Footer from "@/components/marketing/Footer";
import { Button } from "@/components/ui/button";

export default function PublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPage(slug);
    }
  }, [slug]);

  const loadPage = async (pageSlug: string) => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await pagesService.getPageBySlug(pageSlug);
      // Ensure only published pages are viewable by public
      if (!data.is_published) {
        setError(true);
      } else {
        setPage(data);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <UnifiedNavbar />
        <div className="flex flex-1 items-center justify-center pt-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <UnifiedNavbar />
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 pt-20 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
            <LinkIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Page Not Found</h1>
          <p className="text-slate-500 text-center max-w-md text-lg">
            The page you are looking for does not exist or might have been unpublished.
          </p>
          <Link to="/">
            <Button className="rounded-full shadow-sm mt-4" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900">
      <UnifiedNavbar />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-20 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold tracking-wide mb-2">
            Official Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {page.title}
          </h1>
          <p className="text-slate-500 text-base border-b border-slate-200 pb-8">
            Last updated on {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Please review these details carefully.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 -ml-3">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>

        {/* Document Content */}
        <article className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-10 mb-20">
          <div
            className="prose prose-slate max-w-none 
                       prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight 
                       prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                       prose-p:text-slate-600 prose-p:leading-relaxed 
                       prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-900 prose-strong:font-semibold
                       prose-li:text-slate-600 marker:text-slate-400
                       prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                       prose-hr:border-slate-100"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
