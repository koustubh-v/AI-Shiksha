import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface EditFranchiseAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    franchiseId: string;
    franchiseName: string;
    currentEmail?: string;
    onSuccess: () => void;
}

export default function EditFranchiseAdminModal({
    isOpen,
    onClose,
    franchiseId,
    franchiseName,
    currentEmail,
    onSuccess,
}: EditFranchiseAdminModalProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isOpen) {
            setEmail(currentEmail || "");
            setPassword("");
        }
    }, [isOpen, currentEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast({
                title: "Error",
                description: "Email is required.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const payload: any = { email };
            if (password) {
                if (password.length < 6) {
                    toast({
                        title: "Error",
                        description: "Password must be at least 6 characters long.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }
                payload.password = password;
            }

            await api.patch(`/franchises/${franchiseId}/admin`, payload);
            
            toast({
                description: `Admin credentials for ${franchiseName} updated successfully.`,
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update admin credentials.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Franchise Admin</DialogTitle>
                    <DialogDescription>
                        Update the admin credentials for <strong>{franchiseName}</strong>.
                        If you leave the password blank, it will not be changed.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Admin Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password (optional)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            minLength={6}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
