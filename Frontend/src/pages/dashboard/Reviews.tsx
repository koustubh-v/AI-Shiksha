import { useState, useEffect } from "react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquareQuote, Calendar } from "lucide-react";
import { Instructors } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await Instructors.getReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
        }`}
      />
    ));
  };

  return (
    <UnifiedDashboard title="Student Reviews" subtitle="See what your students are saying">
      <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-light text-[#1F1F1F]">Course Reviews</h2>
            <p className="text-sm text-[#555555]">Feedback and ratings from enrolled students</p>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E1E1E1] rounded-2xl border-dashed">
            <MessageSquareQuote className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-[#1F1F1F]">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">You have not received any course reviews yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* User Info */}
                    <div className="flex-shrink-0 flex items-start gap-4 md:w-64 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.user?.avatar_url} />
                        <AvatarFallback>{review.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#1F1F1F] text-sm">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{review.course?.title}</p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {review.comment || <span className="text-gray-400 italic">No comment provided</span>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UnifiedDashboard>
  );
}
