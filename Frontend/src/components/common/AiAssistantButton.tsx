import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { AI } from '@/lib/api';
import { toast } from 'sonner';

interface AiAssistantButtonProps {
    onGenerate: (text: string) => void;
    context?: string;
}

export function AiAssistantButton({ onGenerate, context }: AiAssistantButtonProps) {
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            // @ts-ignore
            const response = await AI.generateText(prompt, context);
            onGenerate(response.text);
            setOpen(false);
            setPrompt('');
            toast.success("Content generated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    <Sparkles className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <h4 className="font-medium text-sm flex items-center gap-2 text-purple-700">
                        <Sparkles className="h-4 w-4" /> AI Assistant
                    </h4>
                    <Textarea
                        placeholder="Describe what you want to write..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] resize-none focus-visible:ring-purple-500"
                    />
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Generate
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
