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
  // Hardcoded username as requested
  const hardcodedUsername = "Hedayat Farahi";
  // Determine account type (default to Free)
  const accountType = user?.role ? user.role : "Free";
  // custom dropdown state for user menu
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  // image fallback state
  const [imgBroken, setImgBroken] = React.useState(false);
  React.useEffect(() => {
    // reset broken flag when profile picture URL changes
    setImgBroken(false);
  }, [user?.profilePicture]);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      const target = e.target as Node;
      if (!userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [userMenuOpen]);

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

  // Removed duplicate 'My Profile' from this list; there's a dedicated profile button in the user container
  const profileNavigation = [
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
                  <item.icon
                    className={`h-4 w-4 transition-all duration-300 ${
                      isCollapsed ? "" : ""
                    }`}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="ml-3 truncate transition-opacity duration-500">
                        {item.name}
                      </span>

                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground text-[10px] rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center font-medium">
                          {Number(item.badge) > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </>
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

          {/* User Profile Section with custom dropdown */}
          <div className="p-4 border-t" ref={userMenuRef as any}>
            <div className="relative">
              {/* Trigger + Upgrade in a single container so hover bg covers both */}
              <div className="group">
                <div className="flex items-center gap-3 px-2 py-1 pr-3 rounded-md group-hover:bg-muted" role="button">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {user?.profilePicture && !imgBroken ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" onError={() => setImgBroken(true)} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-transparent text-black font-medium">{getInitials(hardcodedUsername)}</div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-black">{hardcodedUsername}</p>
                        <p className="text-xs truncate text-black/80">{accountType}</p>
                      </div>
                    )}
                  </div>

                  {/* Upgrade button on the right of trigger - visually part of the same container */}
                  { !isCollapsed && (
                    <div className="ml-auto flex-shrink-0">
                      <Button size="sm" variant="outline" className="h-7 px-2 rounded-md text-xs" onClick={() => {/* placeholder for upgrade */}}>
                        Upgrade
                      </Button>
                    </div>
                  ) }
                </div>
              </div>

              {/* Dropdown panel - opens upward */}
              {userMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 rounded-md border bg-popover p-2 shadow-md z-50 text-sm">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-popover-foreground truncate">{hardcodedUsername}</p>
                    <p className="text-xs text-popover-foreground/80 truncate">{user?.email}</p>
                  </div>
                  <div className="h-px bg-muted my-1" />
                  <button className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => { navigate('/app/profile'); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-2"><User className="h-4 w-4"/><span>Profile</span></div>
                  </button>
                  {accountType === 'Free' && (
                    <button className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => { /* upgrade */ setUserMenuOpen(false); }}>
                      <div className="flex items-center gap-2"><CreditCard className="h-4 w-4"/><span>Upgrade plan</span></div>
                    </button>
                  )}
                  <button className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => { navigate('/app/settings'); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-2"><Settings className="h-4 w-4"/><span>Settings</span></div>
                  </button>
                  <div className="h-px bg-muted my-1" />
                  <button className="w-full text-left px-3 py-2 rounded-sm text-red-500 hover:bg-red-50 text-sm" onClick={() => { handleLogout(); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-2"><LogOut className="h-4 w-4 text-red-500"/><span>Log out</span></div>
                  </button>
                </div>
              )}
            </div>
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
