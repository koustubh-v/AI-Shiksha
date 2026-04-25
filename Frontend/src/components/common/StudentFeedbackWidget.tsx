import { useState } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Feedback } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Public routes where the widget should NOT appear
const PUBLIC_ROUTES = ['/', '/about', '/pricing', '/contact', '/terms', '/privacy', '/courses', '/login', '/signup', '/forgot-password', '/reset-password'];

export function StudentFeedbackWidget() {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Only show for logged-in students on non-public pages
    if (!user || user.role.toLowerCase() !== 'student') return null;
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/course/'))) return null;

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            await Feedback.submit(content);
            toast({ title: "Feedback Submitted", description: "Thank you for your feedback!" });
            setContent("");
            setOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit feedback", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button 
                        size="icon" 
                        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    align="end" 
                    sideOffset={16} 
                    className="w-80 p-0 overflow-hidden shadow-xl"
                >
                    <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                        <div>
                            <h4 className="font-medium text-sm">Send Feedback</h4>
                            <p className="text-xs opacity-90">What's on your mind?</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4 space-y-4">
                        <Textarea 
                            placeholder="Tell us about any difficulties you are facing..."
                            className="min-h-[120px] resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button 
                            className="w-full gap-2" 
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Submit Feedback
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
