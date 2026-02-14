import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import {
  Search,
  Play,
  Star,
  Users,
  Clock,
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  CheckCircle2,
  Globe,
  Briefcase,
  TrendingUp,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const featuredCourses = [
    {
      id: "1",
      title: "Machine Learning",
      provider: "Stanford University",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
      rating: 4.9,
      reviews: 182453,
      level: "Beginner",
      duration: "3 months",
    },
    {
      id: "2",
      title: "Google Data Analytics",
      provider: "Google",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      rating: 4.8,
      reviews: 124567,
      level: "Beginner",
      duration: "6 months",
    },
    {
      id: "3",
      title: "Python for Everybody",
      provider: "University of Michigan",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
      rating: 4.8,
      reviews: 298761,
      level: "Beginner",
      duration: "8 months",
    },
    {
      id: "4",
      title: "Deep Learning Specialization",
      provider: "DeepLearning.AI",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
      rating: 4.9,
      reviews: 56234,
      level: "Intermediate",
      duration: "5 months",
    },
  ];

  const categories = [
    { name: "Data Science", icon: TrendingUp, count: "3,847 courses" },
    { name: "Business", icon: Briefcase, count: "2,456 courses" },
    { name: "Computer Science", icon: BookOpen, count: "4,123 courses" },
    { name: "Health", icon: Award, count: "1,234 courses" },
    { name: "Arts & Humanities", icon: Globe, count: "2,891 courses" },
    { name: "Personal Development", icon: GraduationCap, count: "1,567 courses" },
  ];

  const partners = [
    "Google",
    "IBM",
    "Meta",
    "Stanford",
    "Yale",
    "Duke",
    "Imperial College",
    "University of Michigan",
  ];

  const stats = [
    { value: "113M+", label: "Learners" },
    { value: "7,000+", label: "Courses" },
    { value: "250+", label: "Partners" },
    { value: "3,400+", label: "Companies" },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section - Coursera Style */}
      <section className="bg-coursera-navy py-12 lg:py-20">
        <div className="container-coursera">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Learn without limits
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                Start, switch, or advance your career with more than 7,000 courses,
                Professional Certificates, and degrees from world-class universities and companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-base">
                    Join for Free
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-base">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Students learning"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-coursera-green rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Earn a Certificate</p>
                      <p className="text-sm text-muted-foreground">From top companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-background border-b">
        <div className="container-coursera">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="What do you want to learn?"
                className="w-full pl-12 pr-4 h-14 text-base border-2 border-border focus:border-coursera-blue rounded-full"
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-coursera-blue hover:bg-coursera-blue-hover rounded-full px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container-coursera">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-coursera-blue">{stat.value}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-background">
        <div className="container-coursera">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Most Popular Courses</h2>
            <Link to="/courses" className="text-coursera-blue font-semibold flex items-center gap-1 hover:underline">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.slug || course.id}`} className="group">
                <div className="border border-border bg-card hover:shadow-card transition-shadow">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {course.provider}
                    </p>
                    <h3 className="font-semibold text-foreground mt-1 mb-3 line-clamp-2 group-hover:text-coursera-blue transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Star className="h-4 w-4 fill-coursera-orange text-coursera-orange" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-muted-foreground">
                        ({(course.reviews / 1000).toFixed(0)}K reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="font-medium">
                        {course.level}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="container-coursera">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/courses"
                className="flex items-center gap-4 p-4 bg-card border border-border hover:border-coursera-blue hover:shadow-card transition-all group"
              >
                <div className="h-12 w-12 bg-coursera-blue-light rounded-lg flex items-center justify-center group-hover:bg-coursera-blue transition-colors">
                  <category.icon className="h-6 w-6 text-coursera-blue group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="py-20 bg-coursera-navy">
        <div className="container-coursera">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-coursera-purple text-white mb-4">AI-Powered</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Learn smarter with AI Tutoring
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Get instant help with an AI tutor that adapts to your learning style.
                Ask questions, get explanations, and practice with personalized exercises.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "24/7 instant tutoring support",
                  "Personalized learning recommendations",
                  "Interactive practice exercises",
                  "Real-time feedback on assignments",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-coursera-green" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6">
                Try AI Tutor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">AI Tutor</p>
                  <p className="font-medium text-foreground">How can I help you understand this concept better?</p>
                </div>
                <div className="bg-coursera-blue rounded-lg p-4 ml-8 mb-4">
                  <p className="text-white">Can you explain the difference between supervised and unsupervised learning?</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">AI Tutor</p>
                  <p className="font-medium text-foreground">Great question! Let me break it down with examples...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-background">
        <div className="container-coursera">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            We collaborate with <span className="text-coursera-blue">325+ leading universities and companies</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Learn from world-class instructors and industry experts
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-lg md:text-xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Business Section */}
      <section className="py-16 bg-muted">
        <div className="container-coursera">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-coursera-navy text-white mb-4">For Enterprise</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Upskill your team with Coursera for Business
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Empower employees with world-class learning. Drive business outcomes
                with role-based learning paths and hands-on projects.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <Building2 className="h-6 w-6 text-coursera-blue shrink-0" />
                  <div>
                    <p className="font-semibold">3,400+ Companies</p>
                    <p className="text-sm text-muted-foreground">Trust our platform</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-coursera-blue shrink-0" />
                  <div>
                    <p className="font-semibold">25M+ Employees</p>
                    <p className="text-sm text-muted-foreground">Learning with us</p>
                  </div>
                </div>
              </div>
              <Link to="/contact">
                <Button className="bg-coursera-blue hover:bg-coursera-blue-hover font-semibold px-6">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                alt="Team learning"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-coursera-blue">
        <div className="container-coursera text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start learning today
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join millions of learners from around the world already learning on LearnAI.
            Get unlimited access to 7,000+ courses from top universities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-base">
                Sign Up for Free
              </Button>
            </Link>
            <Link to="/courses">
              <Button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-base">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
