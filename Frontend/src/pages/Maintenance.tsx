import { AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useFranchise } from "@/contexts/FranchiseContext";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
    const { branding } = useFranchise();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                {branding.logo_url ? (
                    <img
                        src={branding.logo_url}
                        alt={branding.lms_name}
                        className="h-16 mx-auto mb-8"
                    />
                ) : (
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertTriangle className="h-8 w-8 text-primary" />
                    </div>
                )}

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">We'll be right back</h1>
                    <p className="text-xl text-muted-foreground">
                        {branding.lms_name} is currently undergoing scheduled maintenance.
                    </p>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience and are working hard to bring the platform back online as quickly as possible.
                    </p>
                </div>

                <div className="pt-8 flex flex-col items-center space-y-4">
                    <p className="text-sm font-medium">Are you an administrator?</p>
                    <Button asChild variant="outline">
                        <Link to="/login" className="flex items-center gap-2">
                            <Home className="h-4 w-4" /> Go to Login
                        </Link>
                    </Button>
                </div>

                {branding.support_email && (
                    <p className="text-sm text-muted-foreground mt-8">
                        Need help urgently? Contact us at <a href={`mailto:${branding.support_email}`} className="text-primary hover:underline">{branding.support_email}</a>
                    </p>
                )}
            </div>
        </div>
    );
}
