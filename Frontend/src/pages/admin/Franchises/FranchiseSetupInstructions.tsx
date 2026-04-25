import { useState, useEffect } from "react";
import { SystemSettings } from "@/lib/api";
import { useFranchise } from "@/contexts/FranchiseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function FranchiseSetupInstructions() {
    const { branding } = useFranchise();
    const [serverInfo, setServerInfo] = useState<{ ip: string; cname: string; instructions: string } | null>(null);
    const [domainVerified, setDomainVerified] = useState<boolean | null>(null);
    const [checkingDomain, setCheckingDomain] = useState(false);
    const [checkMessage, setCheckMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
        // Treat the initial branding value as the current known state
        setDomainVerified(branding.domain_verified ?? false);
    }, [branding.domain_verified]);

    const fetchSettings = async () => {
        try {
            const data = await SystemSettings.getFranchiseServerInfo();
            setServerInfo(data);
        } catch (error) {
            console.error("Failed to load server info", error);
        }
    };

    const handleCheckDomain = async () => {
        setCheckingDomain(true);
        setCheckMessage(null);
        try {
            const res = await api.post('/franchises/me/check-domain');
            setDomainVerified(res.data.verified);
            setCheckMessage(res.data.message);
        } catch (err: any) {
            setCheckMessage(err?.response?.data?.message || 'Domain check failed.');
            setDomainVerified(false);
        } finally {
            setCheckingDomain(false);
        }
    };

    if (!serverInfo) return null;

    return (
        <Card className="max-w-3xl mx-auto shadow-md border-t-4 border-t-indigo-600">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl">Connect Your Domain</CardTitle>
                <CardDescription className="text-base mt-2">
                    To serve your academy from <strong>{window.location.hostname}</strong>, you need to update your DNS settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {domainVerified === false && (
                    <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800 font-semibold">Domain Not Verified</AlertTitle>
                        <AlertDescription className="text-amber-700">
                            Your domain <strong>{window.location.hostname}</strong> is not yet verified or pointing correctly.
                            {checkMessage && <p className="mt-1 text-xs">{checkMessage}</p>}
                        </AlertDescription>
                    </Alert>
                )}

                {domainVerified === true && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800 font-semibold">Domain Verified</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Your domain is active and serving content correctly.
                            {checkMessage && <p className="mt-1 text-xs">{checkMessage}</p>}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={handleCheckDomain}
                        disabled={checkingDomain}
                        className="gap-2"
                    >
                        {checkingDomain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                        {checkingDomain ? 'Checking...' : 'Check Domain Now'}
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-4 bg-muted rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">A</span>
                            A Record Configuration
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-mono font-medium">A</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Host</span>
                                <span className="font-mono font-medium">@</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Value / IP</span>
                                <span className="font-mono font-medium bg-background px-2 py-0.5 rounded border select-all">
                                    {serverInfo.ip || "Contact Support"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {serverInfo.cname && (
                        <div className="p-4 bg-muted rounded-lg border">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">C</span>
                                CNAME Configuration
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-mono font-medium">CNAME</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Host</span>
                                    <span className="font-mono font-medium">www</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Value</span>
                                    <span className="font-mono font-medium bg-background px-2 py-0.5 rounded border select-all">
                                        {serverInfo.cname}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {serverInfo.instructions && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Additional Instructions</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{serverInfo.instructions}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
