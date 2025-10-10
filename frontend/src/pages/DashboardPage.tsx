import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  PenTool,
  ArrowUpRight,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Calendar,
  Zap,
  Shield,
  Sparkles,
  LayoutDashboard,
  FileSignature,
  Settings,
  User,
  Inbox,
  MessageSquare,
  Send,
  Brain,
  Crown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import PageWrapper from "../components/PageWrapper";
import StatsCard from "../components/StatsCard";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 17) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const stats = [
    {
      title: t("dashboard.documentsSigned"),
      value: "124",
      change: "+12",
      trend: "up" as const,
      icon: FileSignature,
    },
    {
      title: t("dashboard.awaitingSignature"),
      value: "8",
      change: "-3",
      trend: "down" as const,
      icon: Clock,
    },
    {
      title: t("nav.inbox"),
      value: "34",
      change: "+5",
      trend: "up" as const,
      icon: Inbox,
    },
    {
      title: t("nav.messages"),
      value: "16",
      change: "+23",
      trend: "up" as const,
      icon: MessageSquare,
    },
  ];

  const recentActivities = [
    {
      text: "dashboard.activity.item1.text",
      time: "dashboard.activity.item1.time",
      type: "completed",
      avatar: "JS",
    },
    {
      text: "dashboard.activity.item2.text",
      time: "dashboard.activity.item2.time",
      type: "pending",
      avatar: "SJ",
    },
    {
      text: "dashboard.activity.item3.text",
      time: "dashboard.activity.item3.time",
      type: "uploaded",
      avatar: "MC",
    },
    {
      text: "dashboard.activity.item4.text",
      time: "dashboard.activity.item4.time",
      type: "shared",
      avatar: "TM",
    },
    {
      text: "dashboard.activity.item5.text",
      time: "dashboard.activity.item5.time",
      type: "completed",
      avatar: "QR",
    },
    {
      text: "dashboard.activity.item6.text",
      time: "dashboard.activity.item6.time",
      type: "shared",
      avatar: "LT",
    },
    {
      text: "dashboard.activity.item7.text",
      time: "dashboard.activity.item7.time",
      type: "uploaded",
      avatar: "FD",
    },
    {
      text: "dashboard.activity.item8.text",
      time: "dashboard.activity.item8.time",
      type: "pending",
      avatar: "CC",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "dashboard.actions.uploadDocument.label",
      description: "dashboard.actions.uploadDocument.desc",
      shortcut: "Ctrl+U",
      onClick: () => navigate('/pdf-signature')
    },
    {
      icon: FileSignature,
      label: "dashboard.actions.signDocument.label",
      description: "dashboard.actions.signDocument.desc",
      shortcut: "Ctrl+S",
      onClick: () => navigate('/pdf-signature')
    },
    {
      icon: Send,
      label: "dashboard.actions.requestSignature.label",
      description: "dashboard.actions.requestSignature.desc",
      shortcut: "Ctrl+R",
      onClick: () => {}
    },
    {
      icon: Brain,
      label: "dashboard.actions.analyzeWithAI.label",
      description: "dashboard.actions.analyzeWithAI.desc",
      shortcut: "Ctrl+A",
      onClick: () => {}
    },
  ];

  const recentDocuments = [
    {
      name: "Employment Agreement - John Smith",
      status: "Completed",
      date: "2 hours ago",
      progress: 100,
      priority: "high",
    },
    {
      name: "NDA - TechCorp Partnership", 
      status: "Pending",
      date: "1 day ago",
      progress: 75,
      priority: "medium",
    },
    {
      name: "Service Contract - ABC Corp",
      status: "In Review", 
      date: "2 days ago",
      progress: 45,
      priority: "high",
    },
    {
      name: "Lease Agreement - Office Space",
      status: "Draft",
      date: "3 days ago",
      progress: 20,
      priority: "low",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'uploaded': return FileText;
      case 'shared': return Users;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-100 text-primary border-blue-200';
      case 'Pending': return 'bg-blue-50 text-primary border-blue-100';
      case 'In Review': return 'bg-blue-50 text-primary border-blue-100';
      case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-primary';
      case 'medium': return 'bg-blue-400';
      case 'low': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <PageWrapper
      title={
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <span>{`${getGreeting()}, ${user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : (user?.username || t('nav.myProfile'))}`}</span>
        </div>
      }
      description={t("dashboard.description")}
      actions={
        <>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 shadow-lg">
            <Crown className="h-4 w-4 mr-2" />
            {t("dashboard.upgradeToPro")}
          </Button>
        </>
      }
    >

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
            color={stat.trend === 'up' ? 'blue' : 'slate'}
          />
        ))}
      </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border h-[480px] flex flex-col">
              <div className="p-6 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("dashboard.recentActivity")}
                  </h3>
                  <Button variant="outline" size="sm" className="hover:bg-accent">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("common.filter")}
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={index}
                      className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} p-4 hover:bg-primary/5 rounded-lg transition-colors`}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-relaxed">
                          {t(activity.text)}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <ActivityIcon className="h-3 w-3 mr-1" />
                          {t(activity.time)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-card rounded-xl shadow-sm border border-border h-[480px] flex flex-col">
              <div className="p-6 border-b border-border flex-shrink-0">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("dashboard.quickActions")}
                </h3>
              </div>
              <div className="flex-1 p-6 space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 rounded-lg transition-colors text-left group"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                      <action.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {t(action.label)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t(action.description)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {action.shortcut}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Documents
              </h3>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(doc.priority)}`}></div>
                      <Eye className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{doc.date}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-1 rounded-md border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-500">{doc.progress}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900">
                Your documents are secure
              </h4>
              <p className="text-xs text-primary mt-1">
                End-to-end encryption • SOC 2 compliant • 99.9% uptime
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-blue-300 text-primary hover:bg-blue-100">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div> */}
    </PageWrapper>
  );
};

export default DashboardPage;
