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
  ChevronUp,
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
  FilePenLine,
} from "lucide-react";
import TopBar from "./TopBar";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  const [, setTimeRemaining] = useState<string>("");
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
    { name: t("nav.workspace"), href: "/app/pdf-signature", icon: FilePenLine },
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
          } bg-card border-r border-border flex flex-col transition-all duration-500 ease-in-out relative`}
        >
          {/* Header with Logo and Toggle */}
          <div className="p-6 border-b border-border">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileSignature className="h-4 w-4 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="transition-opacity duration-500 text-center">
                    <h1 className="text-lg font-semibold text-slate-900">SignMeNow</h1>
                    {/* <p className="text-xs text-slate-600">
                      E-Signature Platform
                    </p> */}
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
              className="h-6 w-6 p-0 rounded-full bg-card border-border shadow-md hover:bg-accent transition-all duration-200"
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
                  variant="ghost"
                  className={`w-full justify-start h-8 transition-all duration-300 group ${
                    isCollapsed ? "px-2" : "px-3"
                  } ${
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground border border-transparent"
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <div className="relative">
                    <item.icon
                      className={`h-4 w-4 transition-all duration-300 stroke-current`}
                    />
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 bg-primary rounded-full w-2 h-2"></span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="ml-3 truncate transition-opacity duration-500">
                        {item.name}
                      </span>

                      {item.badge && (
                        <span className="ml-auto bg-primary text-white text-[10px] rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center font-medium">
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
          <div className="px-3 py-2 border-t border-border">
            <div className="text-xs font-medium text-slate-600 mb-2 px-3">
              {!isCollapsed && "Profile"}
            </div>
            <nav className="space-y-1">
              {profileNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const NavButton = (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={`w-full justify-start h-7 transition-all duration-300 group ${
                      isCollapsed ? "px-2" : "px-3"
                    } ${
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    }`}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon
                      className={`h-4 w-4 transition-all duration-300 ${
                        isActive ? "fill-current" : "stroke-current"
                      } ${
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

          {/* User Profile Section with Claude-style dropdown */}
          <div className="p-4 border-t border-border" ref={userMenuRef as any}>
            <div className="relative">
              <div 
                className={`flex items-center ${isCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-3'} rounded-xl hover:bg-primary/5 transition-all duration-200 cursor-pointer group`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                role="button"
              >
                <div className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20`}>
                  {user?.profilePicture && !imgBroken ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" onError={() => setImgBroken(true)} />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-transparent text-primary font-semibold ${isCollapsed ? 'text-xs' : 'text-sm'}`}>
                      {getInitials(user?.name || "Hedayat Farahi")}
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-slate-900">Hedayat Farahi</p>
                      {/* <p className="text-xs truncate text-slate-600">{accountType}</p> */}
                      <p className="text-xs truncate text-slate-600">Free</p>
                    </div>
                    <ChevronUp className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </div>

              {/* Dropdown panel - opens upward */}
              {userMenuOpen && (
                <div className={`absolute ${isCollapsed ? 'left-1/2 transform -translate-x-1/2 w-56' : 'left-0 w-64'} bottom-full mb-2 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-sm`}>
                  <div className="px-4 py-3 bg-accent/10 rounded-lg mb-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">Hedayat Farahi</p>
                    <p className="text-xs text-slate-600 truncate">{user?.email || 'hedayat@example.com'}</p>
                  </div>
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/5 hover:text-foreground text-sm transition-colors" onClick={() => { navigate('/app/profile'); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-3"><User className="h-4 w-4 text-slate-500"/><span className="font-medium text-slate-700">Profile</span></div>
                  </button>
                  {accountType === 'Free' && (
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/5 hover:text-foreground text-sm transition-colors" onClick={() => { /* upgrade */ setUserMenuOpen(false); }}>
                      <div className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-slate-500"/><span className="font-medium text-slate-700">Upgrade plan</span></div>
                    </button>
                  )}
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/5 hover:text-foreground text-sm transition-colors" onClick={() => { navigate('/app/settings'); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-3"><Settings className="h-4 w-4 text-slate-500"/><span className="font-medium text-slate-700">Settings</span></div>
                  </button>
                  <div className="h-px bg-border my-2" />
                  <button className="w-full text-left px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 text-sm transition-colors" onClick={() => { handleLogout(); setUserMenuOpen(false); }}>
                    <div className="flex items-center gap-3"><LogOut className="h-4 w-4 text-red-500"/><span className="font-medium">Log out</span></div>
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
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
