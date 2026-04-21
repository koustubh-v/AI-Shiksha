import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    User,
    LogOut,
    Settings,
    LayoutDashboard,
    ChevronDown,
    GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Categories } from "@/lib/api";
import { useFranchise } from "@/contexts/FranchiseContext";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function UnifiedNavbar() {
    const { branding } = useFranchise();
    const { user, logout, isAuthenticated } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            if (window.location.pathname === "/") {
                setIsScrolled(window.scrollY > window.innerHeight - 80);
            } else {
                setIsScrolled(window.scrollY > 0);
            }
        };
        window.addEventListener("scroll", handleScroll);
        fetchCategories();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await Categories.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getDashboardLink = () => {
        if (!user) return "/login";
        return "/dashboard";
    };

    const isLanding = location.pathname === "/";

    const navContent = (
        <div className={`relative w-full flex items-center justify-between gap-2 md:gap-4 max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] h-16 ${!isLanding && "px-4 sm:px-6"}`}>
            {/* Left Section: Logo & Explore */}
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Mobile Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
                                <Menu className="h-6 w-6 text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] p-0 bg-[#0e0e0e] border-[#262626] font-body text-white">
                            <div className="p-4 border-b border-[#262626]">
                                <div className="flex items-center gap-2 font-black text-xl text-[#d2ff9a] font-headline">
                                    {branding.favicon_url || branding.logo_url ? (
                                        <img src={getImageUrl((branding.favicon_url || branding.logo_url) as string)} alt={branding.lms_name} className="h-6 w-6 object-cover rounded-md" />
                                    ) : (
                                        <GraduationCap className="h-6 w-6" />
                                    )}
                                    <span>{branding.lms_name}</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-4 font-body">
                                <Link to="/" className="block py-2 font-light text-white/70 hover:text-white transition-colors">Home</Link>
                                <Link to="/courses" className="block py-2 font-light text-white/70 hover:text-white transition-colors">All Courses</Link>
                                <div className="py-2">
                                    <h3 className="font-bold mb-2 text-[10px] uppercase tracking-widest text-white/40">Categories</h3>
                                    <div className="pl-4 space-y-2">
                                        {categories.map((cat) => (
                                            <Link key={cat.id} to={`/courses?category=${cat.name}`} className="block py-1 text-sm font-light text-white/60 hover:text-white transition-colors">
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo / Brand Name */}
                    <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        {/* Icon - Desktop Only */}
                        <div className="hidden md:flex overflow-hidden items-center justify-center">
                            {branding.favicon_url || branding.logo_url ? (
                                <img src={getImageUrl((branding.favicon_url || branding.logo_url) as string)} alt={branding.lms_name} className="h-8 w-8 object-contain drop-shadow-sm" />
                            ) : (
                                <GraduationCap className="h-8 w-8 text-[#d2ff9a] drop-shadow-sm" />
                            )}
                        </div>
                        {/* LMS Name - Centered on mobile, normal flow on desktop */}
                        <span className="font-headline text-lg md:text-xl font-black text-[#d2ff9a] tracking-tight uppercase whitespace-nowrap">{branding.lms_name}</span>
                    </Link>

                    {/* Explore Button (Desktop) */}
                    <div className="hidden md:block relative group">
                        <button className="font-headline text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white py-5 px-2 flex items-center gap-1 transition-colors">
                            Explore <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                        {/* Dropdown */}
                        <div className="absolute top-16 left-0 w-64 bg-[#1a1919] border border-white/10 shadow-2xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden font-body">
                            <div className="py-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/courses?category=${cat.name}`}
                                        className="block px-6 py-3 text-sm font-light text-white/70 hover:bg-[#262626] hover:text-white transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                                {categories.length > 0 && <div className="border-t border-white/5 my-2"></div>}
                                <Link to="/courses" className="block px-6 py-3 text-[10px] tracking-widest uppercase font-bold text-[#d2ff9a] hover:bg-[#262626] transition-colors">
                                    View All Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Search */}
                {/* Hide search on specific pages */}
                {!['/courses', '/cart', '/checkout'].some(path => location.pathname.startsWith(path)) && (
                    <div className="flex-1 max-w-2xl hidden md:block">
                        <form onSubmit={handleSearch} className="relative group/search flex items-center bg-[#262626]/50 rounded-full px-4 py-1.5 border border-white/10 w-64">
                            <Search className="text-slate-400 w-4 h-4 mr-2 transition-colors group-focus-within/search:text-white" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 text-xs w-full font-body outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                )}

                {/* Right Section: Cart & Auth */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Cart */}
                    <Link to="/cart" className="hidden md:flex relative p-2 hover:bg-white/10 hover:text-[#d2ff9a] rounded-full transition-colors group">
                        <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-[#d2ff9a] transition-colors" />
                        {items.length > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-[#d2ff9a] text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link to={getDashboardLink()} className="hidden md:flex items-center gap-2 font-headline uppercase tracking-widest text-xs font-bold text-slate-400 hover:text-white px-3 py-2 hover:bg-white/10 rounded-full transition-colors">
                                <LayoutDashboard className="w-4 h-4 opacity-50" />
                                Dashboard
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative w-9 h-9 rounded-full overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#d2ff9a] focus:ring-offset-2 focus:ring-offset-[#0e0e0e] border border-white/10 shadow-sm">
                                        {user?.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#262626] text-white flex items-center justify-center font-bold text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-sm p-2 font-body border border-white/10 shadow-2xl bg-[#1a1919] text-white">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="font-bold text-sm tracking-tight text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-400 truncate font-light tracking-wide">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-sm font-light rounded-sm cursor-pointer hover:bg-[#262626] hover:text-white transition-colors">
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={logout} className="text-red-400 font-bold tracking-wide text-xs uppercase cursor-pointer rounded-sm hover:bg-red-500/10 transition-colors">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 font-headline uppercase tracking-widest text-sm">
                            <Link to="/login" className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                                <User className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                            </Link>
                            <Link to="/login" className="hidden md:block">
                                <button className="text-slate-400 hover:text-white transition-colors px-4 py-2 font-bold text-xs uppercase">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup" className="hidden md:block">
                                <button className="bg-[#d2ff9a] text-black px-6 py-2 font-bold tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all duration-150 rounded-[0.125rem]">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
        </div>
    );

    if (isLanding) {
        return (
            <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] top-0`}>
                <nav className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center w-full h-16 bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl px-6 md:px-8`}>
                    {navContent}
                </nav>
            </div>
        );
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0e0e0e] border-b border-white/10 ${isScrolled ? "shadow-2xl" : ""}`}>
            {navContent}
        </nav>
    );
}
