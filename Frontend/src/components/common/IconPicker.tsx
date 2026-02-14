import {
    Check,
    ChevronsUpDown,
    Code,
    Book,
    Video,
    Music,
    Briefcase,
    Monitor,
    PenTool,
    Cpu,
    Globe,
    Database,
    Cloud,
    Smartphone,
    Camera,
    Gamepad,
    Headphones,
    Mic,
    Palette,
    Layers,
    Box,
    Layout,
    User,
    Users,
    Award,
    Star,
    Zap,
    Activity,
    BarChart,
    PieChart,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    CreditCard,
    Settings,
    Wrench,
    Search,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    Home,
    Menu,
    MoreHorizontal,
    MoreVertical,
    Plus,
    Minus,
    X,
    Trash,
    Edit,
    Save,
    Download,
    Upload,
    Share,
    Link,
    ExternalLink,
    Info,
    HelpCircle,
    AlertCircle,
    AlertTriangle,
    Lightbulb,
    Moon,
    Sun,
    Wind,
    Droplet,
    Flame,
    Type,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Image,
    Film,
    File,
    FileText,
    Folder,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

export const icons = [
    { value: "code", label: "Code", icon: Code },
    { value: "book", label: "Book", icon: Book },
    { value: "video", label: "Video", icon: Video },
    { value: "music", label: "Music", icon: Music },
    { value: "briefcase", label: "Briefcase", icon: Briefcase },
    { value: "monitor", label: "Monitor", icon: Monitor },
    { value: "pentool", label: "Design", icon: PenTool },
    { value: "cpu", label: "Technology", icon: Cpu },
    { value: "globe", label: "Web", icon: Globe },
    { value: "database", label: "Database", icon: Database },
    { value: "cloud", label: "Cloud", icon: Cloud },
    { value: "smartphone", label: "Mobile", icon: Smartphone },
    { value: "camera", label: "Photography", icon: Camera },
    { value: "gamepad", label: "Gaming", icon: Gamepad },
    { value: "headphones", label: "Audio", icon: Headphones },
    { value: "mic", label: "Microphone", icon: Mic },
    { value: "palette", label: "Art", icon: Palette },
    { value: "layers", label: "Layers", icon: Layers },
    { value: "activity", label: "Health", icon: Activity },
    { value: "barchart", label: "Finance", icon: BarChart },
    { value: "trendingup", label: "Business", icon: TrendingUp },
    { value: "dollar", label: "Money", icon: DollarSign },
    { value: "shopping", label: "E-commerce", icon: ShoppingBag },
    { value: "settings", label: "Settings", icon: Settings },
    { value: "user", label: "Personal", icon: User },
    { value: "users", label: "Team", icon: Users },
    { value: "star", label: "Featured", icon: Star },
    { value: "award", label: "Certificate", icon: Award },
    { value: "zap", label: "Quick", icon: Zap },
];

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [open, setOpen] = useState(false);

    // Helper to dynamically get icon component
    const getIcon = (name: string) => {
        const iconData = icons.find((icon) => icon.value === name);
        if (iconData) return iconData.icon;

        // Fallback if not in our curated list but valid lucide icon
        // const LucideIcon = (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)];
        // return LucideIcon || HelpCircle;

        return HelpCircle;
    };

    const SelectedIcon = getIcon(value);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2">
                        <SelectedIcon className="h-4 w-4" />
                        {value ? icons.find((icon) => icon.value === value)?.label || value : "Select icon..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[200]">
                <Command>
                    <CommandInput placeholder="Search icon..." />
                    <CommandList>
                        <CommandEmpty>No icon found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {icons.map((icon) => (
                                <CommandItem
                                    key={icon.value}
                                    value={icon.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === icon.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <icon.icon className="h-4 w-4" />
                                        {icon.label}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
