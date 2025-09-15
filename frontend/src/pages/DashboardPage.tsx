import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit,
  PenTool,
} from "lucide-react";
import { Button } from "../components/ui/button";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getStatusBadgeColor = (status: string) => {
    if (status === "Signed") return "bg-green-100 text-green-800";
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const stats = [
    {
      title: "Documents in Library",
      value: "12",
      change: "+2 this week",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Pending Signatures",
      value: "3",
      change: "2 overdue",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Documents Sent",
      value: "5",
      change: "+1 today",
      trend: "up",
      icon: Users,
    },
    {
      title: "Completed Documents",
      value: "28",
      change: "+4 this week",
      trend: "up",
      icon: CheckCircle,
    },
  ];

  const activities = [
    {
      icon: CheckCircle,
      text: "Employment Agreement completed by John Smith",
      time: "2m",
    },
    {
      icon: Clock,
      text: "NDA signature pending from Sarah Johnson",
      time: "5m",
    },
    {
      icon: FileText,
      text: "Service Contract uploaded to Library",
      time: "1h",
    },
    { icon: Users, text: "Lease Agreement sent to 3 signers", time: "2h" },
  ];

  const quickActions = [
    { icon: Plus, label: "Upload Document", action: "upload" },
    { icon: Users, label: "Send for Signing", action: "send" },
    { icon: FileText, label: "View Library", action: "library" },
    { icon: PenTool, label: "Sign Document", action: "sign" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          SignMeNow Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || user?.username}. Manage your
          document signing workflow.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.text}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-muted-foreground/10 transition-colors">
                    <action.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Documents</h2>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Employment Agreement - John Smith",
              status: "Signed",
              date: "2 hours ago",
              icon: CheckCircle,
            },
            {
              name: "NDA - TechCorp Partnership",
              status: "Pending",
              date: "1 day ago",
              icon: Clock,
            },
            {
              name: "Service Contract - ABC Corp",
              status: "Draft",
              date: "2 days ago",
              icon: Edit,
            },
            {
              name: "Lease Agreement - Office Space",
              status: "Signed",
              date: "3 days ago",
              icon: CheckCircle,
            },
          ].map((doc) => (
            <div
              key={doc.name}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <doc.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
