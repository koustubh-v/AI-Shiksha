import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Star,
  TrendingUp,
  Users,
  Code,
  Brain,
  Palette,
  Wand2,
  BarChart3,
  BadgeCheck,
  ChevronRight,
  Quote,
  Menu,
  X,
  CheckCircle,
  Camera,
  Music,
  Globe,
  Briefcase,
  School,
  MessageCircle
} from "lucide-react";
import UnifiedNavbar from "@/components/layout/UnifiedNavbar";
import { Chatbot } from "@/components/ai/Chatbot";

// --- Types & Data ---

interface Course {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  author: string;
  rating: number;
  reviews: string;
  price: string;
  image: string;
  tagColor: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Advanced React & Next.js Architecture",
    category: "DEVELOPMENT",
    categoryColor: "text-primary bg-blue-50",
    author: "Sarah Jenkins • Senior Architect",
    rating: 4.9,
    reviews: "(1.2k)",
    price: "$89.99",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQVkXTRU3_d1wAQHJYW5bRnRWjeWkdo8I39hyr9vxJthanvaxvvbGcX4HKekx_lgcaS2HG9AH7VCqjTLbOnwvImrYf9dqBMrFBrvb6UE-72HnWEYePvSr7Ld6DBJ0Miz9RR_WTNVKjv1ZPxOgaRnD6PjUmYozXknoc8WZgga5ehn_gXbjHEkcx3GIr-BDOuoqjnfjhkXznTX3wnaDBio-KrNMY64AhCbZP7bAsl5rcxNRUZtTAnz4x7Px9R04KmTu-O1h-JomkFI",
    tagColor: "bg-blue-50 text-primary"
  },
  {
    id: 2,
    title: "Python for Machine Learning Mastery",
    category: "DATA SCIENCE",
    categoryColor: "text-purple-600 bg-purple-50",
    author: "Dr. Michael Chen • AI Lead",
    rating: 4.8,
    reviews: "(850)",
    price: "$94.99",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANhv3-HkSs1IBiFBtnOJvNhgPukMDDKjfdEGMbohmORlBu2iPz9evAGlP2mO7FbLFwDSceXH5KolWrt8pFmVHimF-1rqbzX78U_eDcxB_aWxOTYUOWM7JmuMdn6rqiuWp0bY4p0iTqY6dSxExUUh-Sd58CDRwUh8fq-9fn58xaAj7O0ngFntGo1E0HZWTFIWFg8WaoTeGh8Myd7yjlGb45HprK7UviEkFjbByE_mPffsPgII0v3bw3jROXl6FodH0IHN5IXLrsGJE",
    tagColor: "bg-purple-50 text-purple-600"
  },
  {
    id: 3,
    title: "UI/UX Strategy: Designing for Conversion",
    category: "DESIGN",
    categoryColor: "text-pink-600 bg-pink-50",
    author: "Leo Valdez • Product Designer",
    rating: 4.7,
    reviews: "(430)",
    price: "$74.99",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBprQJeKgxsmggzIEn9J9pOvzcUJFUsUBxuOjodBqx-VgTGswNd_aAuVaJP7BuyMehFjyUUt1BiAned3QIDAPraYCGmkafO4H9z0B9CeqUHKkD1hL-dXSF1T0RmwzeX5D3uMMRlek_OGvumPJnAdmEu8gY58E-PoeQOg7RX9NMLToPbcu1thvoRVK2II_EAMJm8Lc6ZprsmN35UypqwEULY6yJCn8GRDBfrdmiFBK3F42iWrzDDoB75mSTH49PENPqTlpDp1F4Gayk",
    tagColor: "bg-pink-50 text-pink-600"
  },
  {
    id: 4,
    title: "Scaling Startups: The Growth Framework",
    category: "BUSINESS",
    categoryColor: "text-orange-600 bg-orange-50",
    author: "James Wilson • CEO @ ScaleUp",
    rating: 4.9,
    reviews: "(680)",
    price: "$129.99",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5KMFhjhy6HOOLxL-SVuhhIB5m-apQ17OSjOFWt_L0AB96vVpz8GrgSxjXl0iz0LEHmCYtU4Lr5pjijgAXr1uXlcNKklQ5jbZgijai26aFUcTGzFvbeFss75CwQbXB3DmpaoNZQ4cPkJmUMMVRqUum990M1VeNoFwaM4blbfoFKZQWEYrbrnwkp7QJzKc1n5mnsf-ZFeyKQo5jnrTXODLk2WvQnjMuE1acMWmGKb4sl-kqPpPXbyt5Zqx2mcw7MjyT3VXDp7J1n84",
    tagColor: "bg-orange-50 text-orange-600"
  }
];

const testimonials = [
  {
    id: 1,
    text: "The AI tutor is a game changer. I've learned more in 2 months here than I did in 2 years of university. Highly recommend!",
    name: "Elena Rodriguez",
    role: "Junior Developer at TechFlow",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-fpdQmSUfZQIhyXCJhRrnQAMwsrCgUL89qvy3tVlPaSSG8FpJg8hS4l2SDe1SaFtMIcgV84nzWuVy_QCm83JJnWO52z1cTOG9qUvT8tFX5kVbbwTg6WWG-gBiE6rh5RFzZ5W_Xt6oTe0fwZ08C-9kPFt1DfHDAZ4q-DV2P_PjhxqTC8M3mJDVZHfk6_-IZDeloockd9wbkt58KwKdcgCWgutAkMV5zM2MsWDUXD1i2s_HUZ5u43hiEIgezFBWdgTQ2-oAsa3qrZM"
  },
  {
    id: 2,
    text: "Cleanest UI I've ever seen in an LMS. The progression system keeps me motivated to study every single day after work.",
    name: "Marcus Thorne",
    role: "Product Designer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbtDwUIB7vYVMK8T9hZ1zAe_aC4KGipvxZwLUG7j6_NyFv_OI6DAiSieGM1ZR_BXxQn0VunTXdLAn8T0R7Ej6b2cr9WWR5HvBVB8Qium9dMtCByDlo5adYpmyajHu0jkYPsm2711-BPpfmS7URMZsYUWqP_-loEpJbLs0ortwnK3hMzNjYbUxjijYHY6IfxTI1CE5vdcCBkBbaOKILMaNx-WjQ-qO_lNmd2NlqAVJT0rbFpFY8rB1xnTRQxIOIKsmI--_trt231aM"
  },
  {
    id: 3,
    text: "As a business owner, I needed to learn data analysis fast. The course was straight to the point and practical. Worth every penny.",
    name: "Jennifer Low",
    role: "Founder of EcoScale",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzq9PXcUqSJzaUcz6E0-As0Kcmi5Geywb790XvyHvGAl5J8Z2vcnH1LKJ0oskwvlYTg7wE3-ZiJ34u-Hhhlplfp-0YxNGaNggBphzX867CoR28Uhi210XuzcKR3dUBqwHb9YbnvS3KZM8aC-LTkqjOTEUesqF47LWYO57JqAl2yOPQgkw_SL2DkqNU5F91vllPFx0sd-2Dd2vWR62nzjOz1nR0tDaNfupqwt1LTvv4OD6FvsFuOvstbgUY7MWHQkzbaPD7-RldS28"
  },
];

// --- Components ---

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-24 lg:pt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="flex flex-col gap-8 relative z-10 items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-text-main text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
          >
            Learn Smarter.<br />
            Build Faster.<br />
            <span className="text-primary">Grow Limitlessly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-muted text-lg lg:text-xl leading-relaxed max-w-lg"
          >
            Personalized learning paths designed to help you master new skills and build your career faster than ever before with our AI Tutor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 flex items-center gap-2"
              >
                Start Learning <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 pt-4 border-t border-[#f0f2f4]"
          >
            <div className="flex -space-x-2">
              <img alt="User" className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp-naEXxCFyQyeQuGpWLkvmvGC_q-QXXCzmA4M8fJaLDH2SmanU-VyI2rHk0fGc6jSPAEgQOhZytxLX4DDjMbXPW7vL66DujunwBAUU5CLnBkc0psPNHA3Y8lUQbRViknIL-vlR9nogVgco2-eIhTOt1RRKSR30jp5y5-IopstxeSRp_NXwgKRp6PFr3tqX7NM8YBCcIr0mbqEgZOHhnAhrijo2K9IMDYjlmO62SfNQ7n7xlnYQT9Xk8jjbwOMo0V76AMmB9DSNSw" />
              <img alt="User" className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5s0ynfMBoMfY1MetsIuVEhq8tXHPhramGrt5qP_5Et9z-kPm60iD3ZGyU-iXOqwiKHrgE2124I7LtR9-o0jjgEq8qfWXyLNlI5fXZbvKrxT8ksqAt8c2OB3oRVYyxqUNSYsoHoyImgmUPd5BNUaXtSYjMS8fcQxrVXP8Ph9w9lbL01HuzmtubldIF003fzuNdzM-lf3wsquXYd3IbE0luxgbPnhF2hb_nBSFK3MQmhuSvCc6MZIRONFRG93VXATOEz505zr7yJOA" />
              <img alt="User" className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDD-i67YzZcd6s5_b98b24QFHp_fRuXu5G-LToIewBPJj3KWWsbjhUxtfHN3NpL4cdXJho4dIAh0ONWOk_pUVXbD9bbdT7EHgxZ91T1LaV6pQVCYKMy7XCK0QaeMr_0_buMYfWzDlkG8wbGMcEbBGsWf9Q8nPXmr_fs3nweYCBGPb1ZYDTrzIRFU6QdPehoaCv-fPVs0nLBItAAFQ5hG_RE2euvRrZGT44uTv1iLS_-ytaNE37iZZbmfiuDYdl7yoW4gMPM81AWw" />
            </div>
            <p className="text-sm text-text-muted font-medium">Joined by 10,000+ students globally</p>
          </motion.div>
        </div>

        {/* Right 3D Mockup */}
        <div className="relative z-0 hidden lg:block">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.25 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative z-10 origin-center"
          >
            <img
              src="/hero-dashboard.png"
              alt="Dashboard Preview"
              className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Categories = () => {
  const categories = [
    { icon: Code, name: "Programming", count: "150+ Courses", color: "text-blue-600", bg: "bg-blue-50", border: "group-hover:border-blue-200", shadow: "group-hover:shadow-blue-100" },
    { icon: Brain, name: "AI & Data Science", count: "80+ Courses", color: "text-purple-600", bg: "bg-purple-50", border: "group-hover:border-purple-200", shadow: "group-hover:shadow-purple-100" },
    { icon: Palette, name: "Design", count: "120+ Courses", color: "text-pink-600", bg: "bg-pink-50", border: "group-hover:border-pink-200", shadow: "group-hover:shadow-pink-100" },
    { icon: TrendingUp, name: "Business", count: "95+ Courses", color: "text-orange-600", bg: "bg-orange-50", border: "group-hover:border-orange-200", shadow: "group-hover:shadow-orange-100" },
    { icon: Camera, name: "Photography", count: "50+ Courses", color: "text-yellow-600", bg: "bg-yellow-50", border: "group-hover:border-yellow-200", shadow: "group-hover:shadow-yellow-100" },
    { icon: Music, name: "Music", count: "40+ Courses", color: "text-red-600", bg: "bg-red-50", border: "group-hover:border-red-200", shadow: "group-hover:shadow-red-100" },
    { icon: Globe, name: "Languages", count: "60+ Courses", color: "text-teal-600", bg: "bg-teal-50", border: "group-hover:border-teal-200", shadow: "group-hover:shadow-teal-100" },
    { icon: Briefcase, name: "Marketing", count: "70+ Courses", color: "text-indigo-600", bg: "bg-indigo-50", border: "group-hover:border-indigo-200", shadow: "group-hover:shadow-indigo-100" },
  ];

  return (
    <section className="bg-background-light py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 text-center lg:text-left gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-main">Explore Top Categories</h2>
            <p className="text-text-muted">Whatever your goal, we have a path for you.</p>
          </div>
          <Link to="/courses" className="text-primary font-bold flex items-center gap-1 hover:underline group">
            View All <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl border border-transparent bg-white shadow-sm transition-all cursor-pointer group hover:shadow-xl ${cat.border} ${cat.shadow}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-text-muted">{cat.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedCourses = () => {
  const courses = [
    {
      title: "Complete Python Bootcamp: Go from zero to hero",
      author: "Dr. Angela Yu",
      rating: 4.8,
      reviews: "45k",
      price: "$89.99",
      tag: "Bestseller",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop"
    },
    {
      title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
      author: "Kirill Eremenko",
      rating: 4.7,
      reviews: "32k",
      price: "$94.99",
      tag: "New",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "The Web Developer Bootcamp 2024",
      author: "Colt Steele",
      rating: 4.9,
      reviews: "120k",
      price: "$99.99",
      tag: "Popular",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=2960&auto=format&fit=crop"
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main">Featured Courses</h2>
          <p className="text-text-muted mt-2">Hand-picked courses to get you started on your journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-text-main shadow-sm z-10">
                  {course.tag}
                </div>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-text-muted mb-4">{course.author}</p>

                <div className="mt-auto pt-4 border-t border-[#f0f2f4] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-amber-500 flex items-center gap-0.5">
                      {course.rating} <Star className="h-4 w-4 fill-current" />
                    </span>
                    <span className="text-xs text-text-muted">({course.reviews})</span>
                  </div>
                  <p className="font-black text-text-main">{course.price}</p>
                </div>
                <button className="mt-4 w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Enroll Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="bg-background-light py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main">Why Learners Choose Us</h2>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto">We don't just provide courses; we provide a complete ecosystem for your growth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feature - Bento Grid Style */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 md:p-12 rounded-3xl text-white relative overflow-hidden flex flex-col justify-center min-h-[300px]">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">AI-Powered Personalized Learning</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Stop wasting time on one-size-fits-all content. Our AI analyzes your skills and adapts the curriculum in real-time to your pace.
              </p>
              <button className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold backdrop-blur-sm transition-colors border border-white/5 w-fit">
                Try AI Demo
              </button>
            </div>
          </div>

          {/* Secondary Features Stacked */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-center group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Live
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Real-time Analytics</h3>
              <p className="text-text-muted text-sm leading-relaxed">Visualize your growth daily. Set goals, track streaks, and see your progress.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-center group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  Global
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Verified Certificates</h3>
              <p className="text-text-muted text-sm leading-relaxed">Earn credentials recognized by top companies and boost your LinkedIn profile.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const TestimonialsMarquee = () => {
  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main">What our students say</h2>
        </div>

        <div className="relative w-full overflow-hidden mask-fade-sides">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30, // Adjust speed here
                  ease: "linear",
                },
              }}
              style={{ width: "fit-content" }}
            >
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.id} -${idx} `}
                  className="bg-background-light p-8 rounded-2xl relative w-[350px] md:w-[400px] flex-shrink-0"
                >
                  <Quote className="text-primary/20 h-10 w-10 absolute top-6 right-6 fill-current" />
                  <p className="text-text-muted mb-8 relative z-10 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <img alt="Student" className="w-12 h-12 rounded-full object-cover" src={testimonial.image} />
                    <div>
                      <h4 className="font-bold text-text-main">{testimonial.name}</h4>
                      <p className="text-xs text-text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-primary rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-white text-4xl lg:text-5xl font-black mb-6">Ready to transform your career?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join thousands of students and start your personalized learning journey today. Get 20% off your first 3 months with code <span className="text-white font-bold">SMARTER20</span>.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <button className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl">Get Started Now</button>
            </Link>
            <Link to="/contact">
              <button className="px-10 py-5 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">Book a Demo</button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#f0f2f4] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary">
              <School className="h-8 w-8" />
              <h2 className="text-text-main text-xl font-bold tracking-tight">LMS SaaS</h2>
            </div>
            <p className="text-text-muted max-w-xs leading-relaxed">Making high-quality education accessible and personalized with the power of artificial intelligence.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f2f4] flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f0f2f4] flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <Users className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-text-main mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 text-sm text-text-muted">
              {['Browse Courses', 'Mentorship', 'Pricing Plans', 'Certificates'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text-main mb-6">Community</h4>
            <ul className="flex flex-col gap-4 text-sm text-text-muted">
              {['Success Stories', 'Become Instructor', 'Events', 'Podcast'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text-main mb-6">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-text-muted">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#f0f2f4] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© 2024 LMS SaaS Learning Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function Landing() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-light font-sans text-text-main relative">
      <UnifiedNavbar />
      <div className="pt-16">
        <Hero />
        <Categories />
        <FeaturedCourses />
        <WhyChooseUs />
        <TestimonialsMarquee />
        <FinalCTA />
        <Footer />
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-white px-4 py-3 md:px-5 md:py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group gap-2 md:gap-3"
          aria-label="Ask Sentinel AI"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-semibold text-sm md:text-base whitespace-nowrap">
            Ask Sentinel
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isChatOpen && (
        <Chatbot
          endpoint="/ai/public/chat"
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
