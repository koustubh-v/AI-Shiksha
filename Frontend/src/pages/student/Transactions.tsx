import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter, Calendar, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { UnifiedDashboard } from "@/components/layout/UnifiedDashboard";
import { Input } from "@/components/ui/input";
import { transactionsService, Transaction } from "@/lib/api/transactionsService";
import { toast } from "sonner";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionsService.getMyTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (id: number | string) => {
        try {
            setDownloadingId(id);
            await transactionsService.downloadInvoice(id);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download invoice");
        } finally {
            setDownloadingId(null);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    const filteredTransactions = transactions.filter(t =>
        t.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UnifiedDashboard title="Transactions" subtitle="View your purchase history">
            <div className="max-w-5xl mx-auto">



                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            className="pl-9 h-10 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 bg-white">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Date Range</span>
                        </Button>
                        <Button variant="outline" className="gap-2 bg-white">
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </Button>
                        <Button variant="outline" className="gap-2 bg-white">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-white border border-[#E1E1E1] rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-lms-blue" />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No transactions found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-[#E1E1E1]">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredTransactions.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{trx.transactionId}</td>
                                            <td className="px-6 py-4 text-[#1F1F1F]">{formatDate(trx.date)}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[#1F1F1F] max-w-xs truncate" title={trx.courseName}>
                                                    {trx.courseName}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <CreditCard className="h-3 w-3" /> {trx.paymentMethod}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-[#1F1F1F]">{formatCurrency(trx.amount)}</td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant="secondary"
                                                    className={`${trx.status === "completed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                        trx.status === "refunded" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                                                            "bg-gray-100 text-gray-700"
                                                        } font-normal border-none capitalize`}
                                                >
                                                    {trx.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0 text-gray-500 hover:text-primary transition-colors"
                                                    onClick={() => handleDownloadInvoice(trx.id)}
                                                    disabled={downloadingId === trx.id}
                                                    title="Download PDF Invoice"
                                                >
                                                    {downloadingId === trx.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    ) : (
                                                        <Download className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </UnifiedDashboard>
    );
}
