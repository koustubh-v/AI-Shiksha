import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { QA } from '@/lib/api';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface QAProps {
  lessonId: string;
}

export default function QASection({ lessonId }: QAProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await QA.getLessonQuestions(lessonId);
      setQuestions(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load Q/A', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    try {
      setSubmitting(true);
      const data = await QA.askQuestion(lessonId, newQuestion);
      setQuestions([data, ...questions]);
      setNewQuestion('');
      toast({ title: 'Success', description: 'Question posted successfully. Instructors will be notified.' });
    } catch (error) {
       toast({ title: 'Error', description: 'Failed to post question', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="bg-muted/30 p-4 md:p-6 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Ask a Question
        </h3>
        <div className="flex gap-4">
            <Avatar className="w-10 h-10 hidden sm:block">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
                <Textarea 
                    placeholder="Ask a question about this lesson... (e.g., 'Can you explain the last step again?')"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="resize-none focus-visible:ring-1"
                    rows={3}
                />
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={submitting || !newQuestion.trim()} className="gap-2">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Post Question
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Discussion ({questions.length})</h3>
        {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
                No questions yet. Be the first to ask!
            </div>
        ) : (
            <div className="space-y-6">
                {questions.map((q) => (
                    <div key={q.id} className="flex gap-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={q.student?.avatar_url} />
                            <AvatarFallback>{q.student?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <div className="bg-white border rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-sm">{q.student?.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.question}</p>
                            </div>

                            {/* Replies */}
                            {q.replies && q.replies.length > 0 && (
                                <div className="pl-6 md:pl-10 space-y-4 border-l-2 border-primary/20">
                                    {q.replies.map((reply: any) => (
                                        <div key={reply.id} className="flex gap-3">
                                            <Avatar className="w-8 h-8 mt-1">
                                                <AvatarImage src={reply.user?.avatar_url} />
                                                <AvatarFallback className={reply.user?.role !== 'STUDENT' ? 'bg-primary text-white text-xs' : 'text-xs'}>
                                                    {reply.user?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-primary/5 border border-primary/10 rounded-xl p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-sm flex items-center gap-2">
                                                        {reply.user?.name}
                                                        {reply.user?.role !== 'STUDENT' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary text-white font-bold tracking-wider">
                                                                INSTRUCTOR
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(reply.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2">{reply.reply}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
