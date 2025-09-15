import React from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

const AnalyticsPage: React.FC = () => {
  const stats = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+23%",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Documents Signed",
      value: "1,156",
      change: "+18%",
      trend: "up",
      icon: CheckCircle,
    },
    {
      title: "Pending Signatures",
      value: "89",
      change: "-5%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Active Users",
      value: "42",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
  ];

  const recentActivity = [
    {
      action: "Document signed",
      user: "John Smith",
      document: "Employment Agreement",
      time: "2 minutes ago",
      type: "success",
    },
    {
      action: "Document uploaded",
      user: "Sarah Johnson",
      document: "Service Contract",
      time: "15 minutes ago",
      type: "info",
    },
    {
      action: "Signature pending",
      user: "Mike Chen",
      document: "NDA Agreement",
      time: "1 hour ago",
      type: "warning",
    },
    {
      action: "Document completed",
      user: "Emily Davis",
      document: "Lease Agreement",
      time: "2 hours ago",
      type: "success",
    },
  ];

  const topDocuments = [
    { name: "Employment Agreement", count: 45, percentage: 35 },
    { name: "Service Contract", count: 32, percentage: 25 },
    { name: "NDA Agreement", count: 28, percentage: 22 },
    { name: "Lease Agreement", count: 23, percentage: 18 },
  ];

  const userActivity = [
    { user: "John Smith", documents: 12, lastActive: "2 hours ago" },
    { user: "Sarah Johnson", documents: 8, lastActive: "4 hours ago" },
    { user: "Mike Chen", documents: 15, lastActive: "1 hour ago" },
    { user: "Emily Davis", documents: 6, lastActive: "3 hours ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your document workflow performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-input rounded-md hover:bg-muted transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="px-3 py-2 border border-input rounded-md hover:bg-muted transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.document}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Documents */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Top Documents</h2>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {topDocuments.map((doc, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {doc.count} docs
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${doc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">User Activity</h2>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {userActivity.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{user.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.documents} documents
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last active</p>
                    <p className="text-sm font-medium">{user.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Performance Metrics</h2>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Signing Time</span>
                <span className="font-medium">2.3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completion Rate</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Satisfaction</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
