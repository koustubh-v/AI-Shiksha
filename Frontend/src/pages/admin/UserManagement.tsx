import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Download,
  Shield,
  GraduationCap,
  Users,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Wand2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Users as UsersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

const students = [
  { id: 1, name: "Emma Wilson", email: "emma@example.com", courses: 5, status: "active", joined: "Jan 15, 2024", spent: "$249" },
  { id: 2, name: "James Chen", email: "james@example.com", courses: 3, status: "active", joined: "Feb 2, 2024", spent: "$149" },
  { id: 3, name: "Sarah Johnson", email: "sarah@example.com", courses: 8, status: "active", joined: "Dec 10, 2023", spent: "$499" },
  { id: 4, name: "Michael Brown", email: "michael@example.com", courses: 2, status: "inactive", joined: "Mar 5, 2024", spent: "$79" },
  { id: 5, name: "Lisa Anderson", email: "lisa@example.com", courses: 4, status: "suspended", joined: "Jan 22, 2024", spent: "$199" },
];

const teachers = [
  { id: 1, name: "Dr. John Smith", email: "john@example.com", courses: 12, students: 2840, status: "verified", earnings: "$45,200" },
  { id: 2, name: "Prof. Maria Garcia", email: "maria@example.com", courses: 8, students: 1560, status: "verified", earnings: "$28,400" },
  { id: 3, name: "Alex Thompson", email: "alex@example.com", courses: 3, students: 420, status: "pending", earnings: "$5,600" },
  { id: 4, name: "Jennifer Lee", email: "jennifer@example.com", courses: 6, students: 890, status: "verified", earnings: "$15,800" },
  { id: 5, name: "Robert Wilson", email: "robert@example.com", courses: 2, students: 150, status: "rejected", earnings: "$0" },
];

const admins = [
  { id: 1, name: "Admin User", email: "admin@lms.com", role: "Super Admin", lastLogin: "2 hours ago" },
  { id: 2, name: "Support Team", email: "support@lms.com", role: "Support Admin", lastLogin: "30 mins ago" },
  { id: 3, name: "Content Mod", email: "content@lms.com", role: "Content Moderator", lastLogin: "1 day ago" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
    case "verified":
      return <Badge className="bg-lms-emerald/10 text-lms-emerald border-0"><CheckCircle className="h-3 w-3 mr-1" />{status}</Badge>;
    case "inactive":
    case "rejected":
      return <Badge className="bg-lms-rose/10 text-lms-rose border-0"><XCircle className="h-3 w-3 mr-1" />{status}</Badge>;
    case "pending":
      return <Badge className="bg-lms-amber/10 text-lms-amber border-0"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
    case "suspended":
      return <Badge className="bg-lms-rose/10 text-lms-rose border-0">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

function AddUserModalContent({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setCopied(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await UsersAPI.create({
        ...formData,
        password,
      });

      // Reset form first
      setFormData({ name: "", email: "", role: "" });
      setPassword("");
      setConfirmPassword("");

      // Wait for the user list to refresh before closing modal
      await onSuccess();

      // Close modal after refresh completes
      setIsOpen(false);

      // Show success toast after everything is done
      toast({
        title: "User Created",
        description: `Successfully created user account for ${formData.name}.`,
      });
    } catch (error: any) {
      console.error("Failed to create user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-lms-blue hover:bg-lms-blue/90">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Security</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                className="h-8 gap-2 text-lms-blue border-lms-blue/20 hover:bg-lms-blue/10"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Generate Strong Password
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="relative">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-1 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {password && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={copyPassword}
                      title="Copy Password"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-lms-blue hover:bg-lms-blue/90 w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UsersAPI.getAll();
      setUsers(data);
      setSelectedUsers(new Set()); // Clear selections on reload
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(true);
    try {
      await UsersAPI.delete(userId);
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
      await loadUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    setIsDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedUsers).map((id) => UsersAPI.delete(id))
      );
      toast({
        title: "Users Deleted",
        description: `Successfully deleted ${selectedUsers.size} user(s).`,
      });
      await loadUsers();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to delete users:", error);
      toast({
        title: "Error",
        description: "Failed to delete some users",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = (usersList: any[]) => {
    const userIds = usersList.map(u => u.id);
    if (userIds.every(id => selectedUsers.has(id))) {
      // Deselect all
      const newSelection = new Set(selectedUsers);
      userIds.forEach(id => newSelection.delete(id));
      setSelectedUsers(newSelection);
    } else {
      // Select all
      const newSelection = new Set(selectedUsers);
      userIds.forEach(id => newSelection.add(id));
      setSelectedUsers(newSelection);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const students = users.filter(u => u.role === 'STUDENT').map(u => ({
    ...u,
    courses: 0, // Mock data as backend might not return this yet
    status: 'active', // Mock
    joined: new Date(u.created_at || Date.now()).toLocaleDateString(),
    spent: '$0' // Mock
  }));
  const teachers = users.filter(u => u.role === 'INSTRUCTOR').map(u => ({
    ...u,
    courses: 0,
    students: 0,
    status: 'verified',
    earnings: '$0'
  }));
  const admins = users.filter(u => u.role === 'ADMIN').map(u => ({
    ...u,
    role: 'Admin',
    lastLogin: 'Recently'
  }));

  if (loading) {
    return (
      <AdminDashboardLayout title="User Management" subtitle="Manage students, teachers, and administrators">
        <div>Loading users...</div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="User Management" subtitle="Manage students, teachers, and administrators">
      <div className="space-y-6">
        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <AddUserModalContent onSuccess={loadUsers} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-lms-blue/10">
                  <GraduationCap className="h-6 w-6 text-lms-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-lms-emerald/10">
                  <Users className="h-6 w-6 text-lms-emerald" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teachers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{admins.length}</p>
                  <p className="text-sm text-muted-foreground">Admin Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <Card className="bg-muted/50 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {selectedUsers.size} user(s) selected
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Tables */}
        <Card>
          <Tabs defaultValue="students">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                  <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
                  <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    AI Segment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="students" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={students.length > 0 && students.every(s => selectedUsers.has(s.id))}
                          onCheckedChange={() => toggleSelectAll(students)}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(student.id)}
                            onCheckedChange={() => toggleUserSelection(student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                        <TableCell>{student.courses}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{student.joined}</TableCell>
                        <TableCell className="font-medium">{student.spent}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                onClick={() => {
                                  setUserToDelete(student.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="teachers" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={teachers.length > 0 && teachers.every(t => selectedUsers.has(t.id))}
                          onCheckedChange={() => toggleSelectAll(teachers)}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.has(teacher.id)}
                            onCheckedChange={() => toggleUserSelection(teacher.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                        <TableCell>{teacher.courses}</TableCell>
                        <TableCell>{teacher.students.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                        <TableCell className="font-medium">{teacher.earnings}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>View Courses</DropdownMenuItem>
                              <DropdownMenuItem>Approve/Reject</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                onClick={() => {
                                  setUserToDelete(teacher.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="admins" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{admin.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                onClick={() => {
                                  setUserToDelete(admin.id);
                                  setDeleteDialogOpen(true);
                                }}
                                disabled={admins.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                {userToDelete ? (
                  "Are you sure you want to delete this user? This action cannot be undone."
                ) : (
                  `Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (userToDelete) {
                    handleDeleteUser(userToDelete);
                  } else {
                    handleBulkDelete();
                  }
                }}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminDashboardLayout>
  );
}
