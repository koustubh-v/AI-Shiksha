import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Search, Megaphone, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Announcements as announcementsApi } from "@/lib/api";

interface Announcement {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

export function StudentNavbar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await announcementsApi.getStudentActive();
            // Optional: you can sort them if they aren't sorted by API
            // data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setAnnouncements(data);
        } catch (error) {
            console.error('Error loading announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between w-full">
            {/* Search Bar (Left) */}
            <div className="relative w-full max-w-[200px] md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search..."
                    className="pl-10 h-10 bg-white border-0 shadow-sm ring-1 ring-inset ring-gray-200 focus-visible:ring-2 focus-visible:ring-lms-blue/20 w-full"
                />
            </div>

            {/* Announcements (Right) */}
            <div className="flex items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="relative bg-white border-gray-200 hover:bg-gray-50 h-10 w-10 rounded-full shadow-sm">
                            <Bell className="h-5 w-5 text-gray-600" />
                            {announcements.length > 0 && (
                                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white transform translate-x-0.5 -translate-y-0.5 animate-pulse"></span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Megaphone className="h-4 w-4 text-lms-blue" />
                                Announcements
                            </h3>
                            {announcements.length > 0 && (
                                <span className="text-xs text-muted-foreground bg-gray-200 px-2 py-0.5 rounded-full">{announcements.length} new</span>
                            )}
                        </div>
                        <ScrollArea className="h-[300px]">
                            {loading ? (
                                <div className="flex justify-center items-center h-full py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : announcements.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                    <Bell className="h-8 w-8 mb-2 opacity-20" />
                                    <p className="text-sm">No new announcements</p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {announcements.map((item, index) => (
                                        <div key={item.id}>
                                            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-medium text-[#1F1F1F] leading-snug">{item.title}</h4>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>
                                            </div>
                                            {index < announcements.length - 1 && <Separator />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        {announcements.length > 0 && (
                            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                                <Button variant="ghost" className="w-full text-xs h-8 text-lms-blue hover:text-lms-blue/80 hover:bg-blue-50">
                                    View All Announcements
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
