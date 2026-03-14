import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles, Image as ImageIcon, Mic, MessageSquare, Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';
import api from "@/lib/api";

// Initial greeting from Sentile AI
const INITIAL_MESSAGES = [
    { id: 1, role: "ai", content: "Hi! I'm **Sentile AI**, your personal learning assistant powered by Gemini. Ask me anything about your courses, topics you're studying, or anything you'd like to learn!" },
];

export default function AIAssistant() {
    const { user } = useAuth();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg = { id: messages.length + 1, role: "user", content: inputValue };
        setMessages([...messages, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const response = await api.post('/ai/assistant/chat', { message: userMsg.content });
            const data = response.data;
            
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    role: "ai",
                    content: data?.data?.response || data?.response || "I can assist you with that! Here is a detailed breakdown...",
                },
            ]);
        } catch (error: any) {
            console.error("AI Error:", error);
            const status = error.response?.status;
            const errorMessage = error.response?.data?.message || "";
            
            let finalErrorMsg = "Sorry, I am having trouble connecting right now.";
            if (status === 501 || errorMessage.includes("Configure Gemini Key")) {
                finalErrorMsg = "Ask the Admin to Configure Gemini Key";
            } else if (status === 403 && errorMessage.includes("disabled globally")) {
                finalErrorMsg = "AI Features are currently disabled by the Admin.";
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    role: "ai",
                    content: finalErrorMsg,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const ChatSidebar = () => (
        <div className="flex flex-col h-full bg-[#fcfcfc] border-r border-gray-200">
            <div className="p-4 border-b border-gray-100">
                <Button
                    onClick={() => setMessages(INITIAL_MESSAGES)}
                    className="w-full justify-start gap-3 bg-[#e8f0fe] text-lms-blue hover:bg-[#d2e3fc] border-none rounded-full h-11 shadow-none"
                >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">New Chat</span>
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-8 opacity-60">
                <Sparkles className="h-8 w-8 text-blue-400 mb-3" />
                <p className="text-sm text-gray-500 font-medium">Sentile AI</p>
                <p className="text-xs text-gray-400 mt-1">Your chats appear here</p>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">Sentile AI</p>
                        <p className="text-xs text-gray-500 truncate">Powered by Gemini</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <UnifiedDashboard title="AI Assistant" subtitle="Your personal learning companion">
            <div className="flex h-[calc(100vh-140px)] w-full max-w-[1600px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-sans">

                {/* Sidebar (Desktop) */}
                <div className={`${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full opacity-0"} hidden md:block transition-all duration-300 ease-in-out`}>
                    <ChatSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-white relative">

                    {/* Header / Toggle */}
                    <div className="absolute top-4 left-4 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:bg-gray-100 rounded-full hidden md:flex"
                        >
                            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        </Button>

                        {/* Mobile Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
                                    <PanelLeft className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <ChatSidebar />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1">
                        <div className="max-w-3xl mx-auto p-4 md:p-6 pt-16">
                            {messages.length === 1 ? (
                                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 opacity-0 animate-in fade-in duration-700 mt-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                                        <Sparkles className="h-12 w-12 text-lms-blue relative z-10" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 mb-4 tracking-tight">
                                            Hello, {user?.name?.split(" ")[0] || "Student"}
                                        </h1>
                                        <p className="text-xl md:text-2xl text-gray-400 font-light">How can I help you learn today?</p>
                                    </div>

                                    {/* Suggestion Chips */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                                        {[
                                            { icon: <MessageSquare className="h-4 w-4 text-blue-500" />, text: "Summarize my last lesson" },
                                            { icon: <Sparkles className="h-4 w-4 text-purple-500" />, text: "Create a study quiz for me" },
                                            { icon: <MessageSquare className="h-4 w-4 text-green-500" />, text: "Explain React Hooks simply" },
                                            { icon: <Sparkles className="h-4 w-4 text-rose-500" />, text: "Suggest Python projects" }
                                        ].map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInputValue(suggestion.text)}
                                                className="p-4 text-left bg-white hover:bg-gray-50 rounded-2xl transition-all border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md group flex flex-col gap-2"
                                            >
                                                <div className="bg-gray-50 p-2 w-fit rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                    {suggestion.icon}
                                                </div>
                                                <span className="text-sm font-semibold text-[#1F1F1F] group-hover:text-[#0056D2] transition-colors">{suggestion.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-4 md:gap-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            {msg.role === "ai" && (
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                                                    <Sparkles className="h-4 w-4 text-white" />
                                                </div>
                                            )}

                                            <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                                <div className={`text-[15px] md:text-base leading-relaxed ${msg.role === "user"
                                                    ? "bg-[#f0f4f9] px-5 py-3.5 rounded-3xl rounded-tr-sm text-[#1F1F1F]"
                                                    : "text-[#1F1F1F] py-2 prose prose-zinc max-w-none"
                                                    }`}>
                                                    {msg.role === "ai" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                                                </div>
                                            </div>

                                            {msg.role === "user" && (
                                                <Avatar className="h-8 w-8 mt-1 border border-gray-200">
                                                    <AvatarImage src={user?.avatar_url} />
                                                    <AvatarFallback className="bg-gray-100 text-gray-600">ME</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex gap-6">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 h-10">
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-0"></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 bg-white mt-auto">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-[#f0f4f9] rounded-[28px] p-2 hover:bg-[#e9eef6] transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md flex flex-col relative transition-all duration-200">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Ask anything..."
                                    className="bg-transparent border-none shadow-none focus-visible:ring-0 text-black placeholder:text-gray-600 h-12 text-base px-4"
                                />
                                <div className="flex justify-between items-center px-2 pb-1">
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="text-black hover:text-gray-700 rounded-full h-9 w-9">
                                            <ImageIcon className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-black hover:text-gray-700 rounded-full h-9 w-9">
                                            <Mic className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputValue.trim()}
                                        size="icon"
                                        className={`h-9 w-9 rounded-full transition-all ${inputValue.trim()
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-transparent text-gray-300 pointer-events-none"
                                            }`}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            AI can make mistakes. Check important info.
                        </p>
                    </div>

                </div>
            </div>
        </UnifiedDashboard>
    );
}
