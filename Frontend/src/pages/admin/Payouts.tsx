import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const payoutRequests = [
  { id: 1, teacher: "Dr. Emily Chen", amount: 4500, courses: 12, status: "pending", requestedAt: "2024-01-20" },
  { id: 2, teacher: "Prof. Robert Smith", amount: 3200, courses: 8, status: "pending", requestedAt: "2024-01-19" },
  { id: 3, teacher: "Sarah Williams", amount: 1800, courses: 5, status: "processing", requestedAt: "2024-01-18" },
  { id: 4, teacher: "Dr. Michael Johnson", amount: 6800, courses: 15, status: "pending", requestedAt: "2024-01-17" },
  { id: 5, teacher: "Jane Doe", amount: 950, courses: 3, status: "completed", requestedAt: "2024-01-15" },
];

export default function PayoutsPage() {
  return (
    <AdminDashboardLayout title="Payouts" subtitle="Manage teacher payout requests">
      <div className="space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-lg md:text-2xl font-bold">₹24,500</p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-chart-3/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Processing</p>
                  <p className="text-lg md:text-2xl font-bold">₹8,200</p>
                </div>
                <Wallet className="h-6 w-6 md:h-8 md:w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Paid This Month</p>
                  <p className="text-lg md:text-2xl font-bold">₹145,000</p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Requests</p>
                  <p className="text-lg md:text-2xl font-bold">12</p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-chart-4/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Requests */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payout Requests
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {request.teacher.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{request.teacher}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${request.amount.toLocaleString()}</TableCell>
                    <TableCell>{request.courses} courses</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "completed" ? "default" :
                            request.status === "processing" ? "secondary" : "outline"
                        }
                        className={request.status === "completed" ? "bg-accent" : ""}
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{request.requestedAt}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-1 bg-accent hover:bg-accent/90">
                            <CheckCircle className="h-4 w-4" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      )}
                      {request.status === "processing" && (
                        <Button size="sm" variant="outline">View Details</Button>
                      )}
                      {request.status === "completed" && (
                        <span className="text-sm text-muted-foreground">Completed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
