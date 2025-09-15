import React, { useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { apiService } from "../services/api";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  LayoutDashboard,
  LogOut,
  User,
  FileSignature,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  PenTool,
  BookOpen,
  Mail,
  Send,
  Archive,
  CreditCard,
} from "lucide-react";
import TopBar from "./TopBar";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const navigation = [
    { name: t("nav.dashboard"), href: "/app/dashboard", icon: LayoutDashboard },
    {
      name: t("nav.library"),
      href: "/app/library",
      icon: FileText,
      badge: "12",
    },
    {
      name: t("nav.inbox"),
      href: "/app/inbox",
      icon: MessageSquare,
      badge: "3",
    },
    { name: t("nav.outbox"), href: "/app/outbox", icon: Send, badge: "5" },
    {
      name: t("nav.archive"),
      href: "/app/archive",
      icon: Archive,
      badge: "28",
    },
    { name: t("nav.pdfSignature"), href: "/app/pdf-signature", icon: PenTool },
    { name: t("nav.settings"), href: "/app/settings", icon: Settings },
  ];

  const profileNavigation = [
    { name: t("nav.myProfile"), href: "/app/profile", icon: User },
    { name: t("nav.messages"), href: "/app/messages", icon: Mail },
    { name: t("nav.usage"), href: "/app/usage", icon: BarChart3 },
    { name: t("nav.invoices"), href: "/app/invoices", icon: CreditCard },
    { name: t("nav.addressBook"), href: "/app/addressbook", icon: BookOpen },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTokenExpiry = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Update time remaining for tooltip
  React.useEffect(() => {
    const updateTime = () => {
      const remaining = apiService.getTimeUntilExpiry();
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeRemaining("");
        // Auto logout when time expires
        handleTokenExpiry();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [handleTokenExpiry]);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } bg-card border-r flex flex-col transition-all duration-500 ease-in-out relative`}
        >
          {/* Header with Logo and Toggle */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileSignature className="h-4 w-4 text-primary-foreground" />
                </div>
                {!isCollapsed && (
                  <div className="transition-opacity duration-500">
                    <h1 className="text-lg font-semibold">SignMeNow</h1>
                    <p className="text-xs text-muted-foreground">
                      E-Signature Platform
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Button - Positioned in between */}
          <div className="absolute -right-3 top-6 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="h-6 w-6 p-0 rounded-full bg-background border shadow-md hover:bg-muted transition-all duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const NavButton = (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-10 transition-all duration-300 group ${
                    isCollapsed ? "px-2" : "px-3"
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <div className="relative">
                    <item.icon
                      className={`h-4 w-4 transition-all duration-300 ${
                        isCollapsed ? "" : "mr-3"
                      }`}
                    />
                    {item.badge && !isCollapsed && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="transition-opacity duration-500">
                      {item.name}
                    </span>
                  )}
                </Button>
              );

              if (isCollapsed) {
                return (
                  <div key={item.name} className="relative">
                    <Tooltip placement="right">
                      <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                      <TooltipContent>
                        <p>{item.name}</p>
                        {item.badge && (
                          <p className="text-xs text-muted-foreground">
                            {item.badge} items
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              }

              return NavButton;
            })}
          </nav>

          {/* Profile Navigation */}
          <div className="px-3 py-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
              {!isCollapsed && "Profile"}
            </div>
            <nav className="space-y-1">
              {profileNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const NavButton = (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-9 transition-all duration-300 group ${
                      isCollapsed ? "px-2" : "px-3"
                    }`}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon
                      className={`h-4 w-4 transition-all duration-300 ${
                        isCollapsed ? "" : "mr-3"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-500 text-sm">
                        {item.name}
                      </span>
                    )}
                  </Button>
                );

                if (isCollapsed) {
                  return (
                    <div key={item.name} className="relative">
                      <Tooltip placement="right">
                        <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                }

                return NavButton;
              })}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t">
            {isCollapsed ? (
              <div className="space-y-2">
                {/* User Avatar with Tooltip */}
                <div className="relative">
                  <Tooltip placement="right">
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium text-sm">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        {user?.role && (
                          <p className="text-xs text-muted-foreground font-medium capitalize mt-1">
                            {user.role}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Logout Button with Tooltip */}
                <div className="relative">
                  <Tooltip placement="right">
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full hover:bg-muted transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {t("common.logout")}
                        </p>
                        {timeRemaining && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("auth.sessionExpiresIn")} {timeRemaining}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <p className="text-xs text-muted-foreground font-medium capitalize mt-1">
                        {user.role}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Tooltip placement="top">
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-9 hover:bg-muted transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("common.signOut")}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {t("common.logout")}
                        </p>
                        {timeRemaining && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("auth.sessionExpiresIn")} {timeRemaining}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area with TopBar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TopBar */}
          <TopBar />

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
