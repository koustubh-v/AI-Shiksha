import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Loader2, BookOpen, Star, Filter, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Courses, Categories } from "@/lib/api";
import Footer from "@/components/marketing/Footer";

interface Category {
    id: string;
    name: string;
    description?: string;
}

interface Course {
    id: string;
    title: string;
    slug: string;
    instructor: string;
    thumbnail?: string;
    level?: string;
    rating?: number;
    students?: number;
    price: number;
    category?: Category;
    description?: string;
    original_price?: number;
}

export default function PublicCourseCatalog() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COURSES_PER_PAGE = 6;
    const location = useLocation();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedLevel]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
        const searchParam = searchParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [location.search]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesData, categoriesData] = await Promise.all([
                Courses.getAll(false), // Only published courses
                Categories.getAll(),
            ]);
            setCourses(coursesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            (course.category && course.category.name === selectedCategory);

        const matchesLevel =
            selectedLevel === "all" || course.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * COURSES_PER_PAGE,
        currentPage * COURSES_PER_PAGE
    );

    const CourseCard = ({ course }: { course: Course }) => {
        const handleClick = () => {
            navigate(`/courses/${course.slug}`);
        };

        return (
            <div
                onClick={handleClick}
                className="group cursor-pointer flex flex-col glass-card bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full"
            >
                {/* Thumbnail */}
                <div className={`relative overflow-hidden bg-primary/5 ${viewMode === "list" ? "w-64 h-48" : "h-48 w-full"}`}>
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-primary opacity-20 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                    )}
                    {course.level && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold bg-white/80 backdrop-blur-md text-text-main shadow-sm border border-white/50">
                            {course.level}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary text-xs font-bold border border-gray-100 shadow-sm">
                            {course.instructor.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-text-muted font-light tracking-wide truncate">
                            {course.instructor}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="headline-serif text-lg font-light text-text-main mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {course.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-1 mb-4 text-xs font-light text-text-muted">
                        <span className="font-bold text-yellow-500">{course.rating?.toFixed(1) || '4.5'}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= (course.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-100"}`}
                                />
                            ))}
                        </div>
                        <span className="ml-1 tracking-wide">({course.students || 0})</span>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100/50">
                        <div className="flex flex-col">
                            {course.price > 0 ? (
                                <span className="text-lg font-bold text-text-main tracking-tight">₹{course.price.toLocaleString('en-IN')}</span>
                            ) : (
                                <span className="text-sm font-bold text-emerald-600 tracking-widest uppercase">Free</span>
                            )}
                        </div>
                        <button className="text-primary font-bold text-[10px] tracking-widest uppercase hover:opacity-80 transition-opacity">
                            View Course
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfcfd] text-text-main relative overflow-x-hidden flex flex-col">
            {/* Ambient Background Depth */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-primary opacity-[0.03] rounded-full blur-[120px] mix-blend-multiply pointer-events-none -z-10"></div>
            <div className="absolute top-[40%] right-[0%] w-[600px] h-[600px] bg-[#a12e70] opacity-[0.02] rounded-full blur-[100px] mix-blend-multiply pointer-events-none -z-10"></div>

            {/* Premium Hero Search Section */}
            <div className="relative pt-32 pb-12 px-4 sm:px-6 z-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="headline-serif text-4xl sm:text-5xl lg:text-6xl font-light text-text-main tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Explore Ecosystem
                    </h1>
                    <p className="text-text-muted font-light text-sm sm:text-base max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        Discover premium learning pathways crafted by verified instructors. Master the architecture of tomorrow.
                    </p>
                    
                    {/* Massive Search Bar Matrix */}
                    <div className="relative max-w-2xl mx-auto group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5 transition-colors group-focus-within:text-primary z-10" />
                        <input
                            type="text"
                            placeholder="What coordinates are you searching for?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-32 py-4 rounded-full border border-gray-200/80 bg-white/60 backdrop-blur-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none text-base font-light transition-all shadow-xl hover:shadow-2xl"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2.5 rounded-full border shadow-sm transition-all duration-300 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${showFilters ? 'bg-text-main text-white border-text-main' : 'bg-white border-gray-200 text-text-main hover:bg-primary/5 hover:text-primary hover:border-primary/30'}`}
                        >
                            <Filter className="w-3 h-3" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Filters Drawer */}
            <div className="max-w-2xl mx-auto px-4 z-10 relative">
                <div className={`transition-all duration-500 ease-out overflow-hidden glass-card bg-white/40 backdrop-blur-xl rounded-3xl ${showFilters ? 'max-h-96 opacity-100 border border-gray-100/50 shadow-sm mb-12' : 'max-h-0 opacity-0 border-0 mb-0'}`}>
                    <div className="px-6 py-6 space-y-4">
                        <div className="flex flex-wrap gap-6 justify-center">
                            {/* Category Filter */}
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-text-muted ml-1">Curriculum</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/70 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-light shadow-sm transition-all text-text-main"
                                >
                                    <option value="all">All Ecosystems</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-text-muted ml-1">Skill Tier</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/70 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-light shadow-sm transition-all text-text-main"
                                >
                                    <option value="all">All Tiers</option>
                                    <option value="beginner">Foundation</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full flex-1 mb-20 px-4 sm:px-6">
                {filteredCourses.length > 0 ? (
                    <div className="max-w-[75rem] mx-auto flex flex-col items-center">
                        <div className={`w-full grid gap-8 justify-center ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl" : "grid-cols-1 w-full max-w-4xl"}`}>
                            {paginatedCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4 text-text-main" />
                                </button>
                                
                                <div className="flex gap-1.5 items-center px-4">
                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const page = idx + 1;
                                        return (
                                            <button
                                              key={page}
                                              onClick={() => setCurrentPage(page)}
                                              className={`w-9 h-9 rounded-full text-xs font-bold transition-all shadow-sm ${currentPage === page ? 'bg-primary text-white scale-110' : 'bg-white/80 backdrop-blur-md border border-gray-200 text-text-muted hover:bg-gray-100'}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
                                >
                                    <ChevronRight className="w-4 h-4 text-text-main" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 border border-primary/10 shadow-sm">
                            <Search className="w-8 h-8 text-primary opacity-50" />
                        </div>
                        <h3 className="headline-serif text-2xl font-light text-text-main mb-3">Void Space</h3>
                        <p className="text-text-muted font-light max-w-sm">
                            Our curriculum currently does not contain matching coordinates. Try adjusting your filter parameters to discover more pathways.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
