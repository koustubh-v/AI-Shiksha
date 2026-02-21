import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Sparkles, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import api from "@/lib/api";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatbotProps {
    endpoint: string; // The API endpoint to hit (e.g. /api/ai/assistant/chat or /api/ai/public/chat)
    courseId?: string; // Optional courseId for Lesson Player context
    isOpen?: boolean;
    onClose?: () => void;
    className?: string; // Additional classes
    embedded?: boolean; // If true, it renders without absolute positioning
}

export function Chatbot({ endpoint, courseId, isOpen = true, onClose, className, embedded = false }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I am your AI Assistant. How can I help you today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorConfig, setErrorConfig] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        setErrorConfig(null);

        try {
            const payload: any = { message: userMsg.content };
            if (courseId) {
                payload.courseId = courseId;
            }

            // Using the centralized api.ts client which handles auth tokens & domain headers
            const response = await api.post(endpoint, payload);
            const data = response.data;

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.data.response
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error: any) {
            const status = error.response?.status;
            const errorMessage = error.response?.data?.message || "";

            if (status === 501 || errorMessage.includes("Configure Gemini Key")) {
                setErrorConfig("Ask the Admin to Configure Gemini Key");
            } else if (status === 403 && errorMessage.includes("disabled globally")) {
                setErrorConfig("AI Features are currently disabled by the Admin.");
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: "system",
                    content: "Sorry, I encountered an error. Please try again."
                }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const ChatLayout = (
        <div className={cn(
            "flex flex-col bg-background border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 origin-bottom-right",
            embedded ? "h-full w-full" : "w-[calc(100vw-2rem)] sm:w-[380px] h-[600px] max-h-[calc(100vh-7rem)] fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50",
            className
        )}>
            {/* Header */}
            <div className="bg-primary p-4 shrink-0 flex items-center justify-between text-primary-foreground relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                    <div className="h-10 w-10 bg-primary-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-foreground/30 shadow-inner">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary-foreground tracking-wide">Sentinel AI</h3>
                        <p className="text-primary-foreground/80 text-xs font-medium">Always here to help</p>
                    </div>
                </div>

                {!embedded && onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full shrink-0 relative z-10">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Configuration Error State */}
            {errorConfig && (
                <div className="bg-destructive/10 p-3 flex items-start gap-3 border-b border-destructive/20 shrink-0">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <p className="text-sm font-medium text-destructive leading-tight">{errorConfig}</p>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth bg-gray-50/50 dark:bg-black/20" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                            msg.role === "system" && "mx-auto max-w-full justify-center"
                        )}
                    >
                        {msg.role !== "system" && (
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                            )}>
                                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                        )}

                        <div className={cn(
                            "px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed text-[0.95rem]",
                            msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : msg.role === "system"
                                    ? "bg-muted text-muted-foreground text-xs text-center italic rounded-lg"
                                    : "bg-white dark:bg-zinc-900 border text-foreground rounded-tl-none prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:rounded-xl"
                        )}>
                            {msg.role === "assistant" ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 mr-auto max-w-[85%] animate-in fade-in">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-background border-t shrink-0">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="relative flex items-center"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={errorConfig ? "AI is currently disabled..." : "Ask me anything..."}
                        className="pr-12 py-6 rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-inner"
                        disabled={isLoading || !!errorConfig}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading || !!errorConfig}
                        className={cn(
                            "absolute right-1.5 h-9 w-9 rounded-full transition-all duration-300",
                            input.trim() && !isLoading ? "bg-primary hover:bg-primary/90 hover:scale-105 shadow-md" : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    );

    return ChatLayout;
}
