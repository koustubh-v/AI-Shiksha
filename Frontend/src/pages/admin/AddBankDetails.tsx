import { useState } from "react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Landmark, CreditCard, ShieldCheck, Building, Save } from "lucide-react";

export default function AddBankDetailsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Bank Details Saved",
                description: "Your banking information has been securely updated.",
            });
        }, 1500);
    };

    return (
        <AdminDashboardLayout title="Bank Details" subtitle="Manage your payout methods">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Info Card */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="flex items-start gap-4 p-6">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg text-primary mb-1">Secure Banking Information</h3>
                            <p className="text-sm text-muted-foreground">
                                Your bank details are stored using bank-grade encryption. This information will be used for processing your monthly payouts.
                                Please ensure all details match your bank account statement exactly.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSave}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Landmark className="h-5 w-5" />
                                Bank Account Information
                            </CardTitle>
                            <CardDescription>
                                Enter the details of the bank account where you want to receive payouts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Account Holder Details */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="holder-name">Account Holder Name</Label>
                                    <Input id="holder-name" placeholder="e.g. John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank-name">Bank Name</Label>
                                    <Select>
                                        <SelectTrigger id="bank-name">
                                            <SelectValue placeholder="Select Bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="chase">JPMorgan Chase</SelectItem>
                                            <SelectItem value="boa">Bank of America</SelectItem>
                                            <SelectItem value="wells">Wells Fargo</SelectItem>
                                            <SelectItem value="citi">Citibank</SelectItem>
                                            <SelectItem value="usbank">U.S. Bank</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="account-number">Account Number</Label>
                                    <div className="relative">
                                        <Input id="account-number" type="password" placeholder="•••• •••• •••• 1234" required className="pl-9" />
                                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="routing">Routing Number / IFSC Code</Label>
                                    <div className="relative">
                                        <Input id="routing" placeholder="Enter routing number" required className="pl-9" />
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Address Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Bank Address</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input id="address" placeholder="123 Bank St" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="New York" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State / Province</Label>
                                        <Input id="state" placeholder="NY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">Zip / Postal Code</Label>
                                        <Input id="zip" placeholder="10001" />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 bg-muted/50 p-4">
                            <Button variant="outline" type="button">Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Bank Details
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminDashboardLayout>
    );
}
