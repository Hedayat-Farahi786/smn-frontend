import React, { useState, useEffect, useCallback } from "react";
import { apiService, User, ApiError } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";
import UserFormModal from "../components/UserFormModal";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  Filter,
} from "lucide-react";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await apiService.getUsers();
      setUsers(userData);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to fetch users";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (modalMode === "create") {
        const newUser = await apiService.createUser(userData);
        setUsers((prev) => [newUser, ...prev]);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else if (editingUser && editingUser._id) {
        const updatedUser = await apiService.updateUser(
          editingUser._id,
          userData
        );
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? updatedUser : user
          )
        );
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
    } catch (err) {
      let message = "Failed to update user";
      if (err instanceof ApiError) {
        message = err.message;
      } else if (modalMode === "create") {
        message = "Failed to create user";
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err; // Re-throw to let the modal handle it
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      setUsers((users || []).filter((user) => user._id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete user";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = (users || []).filter(
    (user) =>
      (user?.username?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user?.firstName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (user?.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("users.title")}
          </h1>
          <p className="text-muted-foreground">{t("users.subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={fetchUsers}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {t("common.refresh")}
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            {t("users.addMember")}
          </Button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("users.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users List */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{t("users.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {filteredUsers.length} {t("users.title").toLowerCase()} found
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t("common.filter")}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">{t("users.loadingMembers")}</span>
            </div>
          )}
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                {t("users.noMembersFound")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? t("users.tryAdjustingSearch")
                  : t("users.getStartedAdding")}
              </p>
            </div>
          )}
          {!loading && filteredUsers.length > 0 && (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id || Math.random()}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || "No username"}
                      </h3>
                      {user.firstName && user.lastName && (
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email || "No email"}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {user.createdAt
                            ? formatDate(user.createdAt)
                            : "No date"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        (user.role || "user") === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => user._id && handleDeleteUser(user._id)}
                      disabled={!user._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
        mode={modalMode}
      />
      </div>
    </div>
  );
};

export default UserManagementPage;
