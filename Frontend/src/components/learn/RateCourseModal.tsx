import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Reviews } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface RateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
}

export function RateCourseModal({ isOpen, onClose, courseId, courseTitle }: RateCourseModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await Reviews.submit(courseId, rating, comment);
            toast({
                title: "Thank you for your feedback!",
                description: "Your review has been submitted successfully.",
            });
            onClose();
        } catch (error: any) {
            toast({
                title: "Error submitting review",
                description: error.response?.data?.message || "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Rate Course: {courseTitle}</DialogTitle>
                    <DialogDescription>
                        Congratulations on completing the course! Please take a moment to share your feedback.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 gap-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`h-10 w-10 ${(hoveredRating || rating) >= star
                                            ? "fill-coursera-orange text-coursera-orange"
                                            : "text-muted-foreground"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full space-y-2">
                        <label htmlFor="feedback" className="text-sm font-medium">
                            Additional Feedback (Optional)
                        </label>
                        <Textarea
                            id="feedback"
                            placeholder="Tell us what you liked about this course or how it could be improved..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Skip for now
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="bg-coursera-blue hover:bg-coursera-blue-hover text-white">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
