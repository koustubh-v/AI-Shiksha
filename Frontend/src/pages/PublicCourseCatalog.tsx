import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, BookOpen, User, Star, Filter, LayoutGrid, List, ArrowRight, Sparkles, Users } from "lucide-react";
import { Courses, Categories } from "@/lib/api";

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

    useEffect(() => {
        fetchData();
    }, []);

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

    const CourseCard = ({ course }: { course: Course }) => {
        const handleClick = () => {
            navigate(`/courses/${course.slug}`);
        };

        return (
            <div
                onClick={handleClick}
                className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
                {/* Thumbnail */}
                <div className={`relative overflow-hidden bg-gray-100 ${viewMode === "list" ? "w-64 h-48" : "h-48 w-full"}`}>
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-300" />
                        </div>
                    )}
                    {course.level && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#2d2f31] shadow-sm">
                            {course.level}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#f7f9fa] flex items-center justify-center text-[#2d2f31] text-xs font-bold border border-[#d1d7dc]">
                            {course.instructor.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-[#6a6f73] font-medium truncate">
                            {course.instructor}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#2d2f31] mb-1 line-clamp-2 group-hover:text-[#a435f0] transition-colors leading-tight">
                        {course.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-1 mb-4 text-xs text-[#6a6f73]">
                        <span className="font-bold text-[#b4690e]">{course.rating?.toFixed(1) || '4.5'}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= (course.rating || 4.5) ? "fill-[#e59819] text-[#e59819]" : "fill-gray-200 text-gray-200"}`}
                                />
                            ))}
                        </div>
                        <span className="ml-1">({course.students || 0})</span>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                            {course.price > 0 ? (
                                <span className="text-lg font-bold text-[#2d2f31]">₹{course.price.toLocaleString('en-IN')}</span>
                            ) : (
                                <span className="text-lg font-bold text-green-700">Free</span>
                            )}
                        </div>
                        <button className="text-[#a435f0] font-bold text-sm hover:underline">
                            View Course
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#a435f0] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-[#2d2f31]">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 border-b border-[#d1d7dc] shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2d2f31]">All Courses</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex relative w-64 lg:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6f73] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search for courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#2d2f31] focus:ring-1 focus:ring-[#2d2f31] outline-none text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-full border transition-colors ${showFilters ? 'bg-[#2d2f31] text-white border-[#2d2f31]' : 'bg-white border-[#2d2f31] text-[#2d2f31] hover:bg-gray-50'}`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className={`border-b border-gray-100 transition-all duration-300 overflow-hidden bg-[#f7f9fa] ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
                        <div className="flex flex-wrap gap-4">
                            {/* Category Filter */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#6a6f73]">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-[#d1d7dc] bg-white outline-none focus:border-[#2d2f31]"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[#6a6f73]">Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-[#d1d7dc] bg-white outline-none focus:border-[#2d2f31]"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {filteredCourses.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-[#f7f9fa] rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-[#2d2f31]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#2d2f31] mb-2">No results found</h3>
                        <p className="text-[#6a6f73]">
                            Try adjusting your search criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
