import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

const UsagePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const usageStats = {
    totalDocuments: 24,
    documentsThisMonth: 8,
    totalSigners: 45,
    averageCompletionTime: "1.2 days",
    documentsCompleted: 18,
    documentsPending: 6,
  };

  const monthlyData = [
    { month: "Jan", documents: 8, signers: 15, completed: 6 },
    { month: "Feb", documents: 12, signers: 22, completed: 10 },
    { month: "Mar", documents: 4, signers: 8, completed: 2 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Document completed",
      document: "Employment Agreement - John Smith",
      date: "2024-01-16",
      time: "10:30 AM",
    },
    {
      id: 2,
      action: "Document sent",
      document: "NDA - Partnership Agreement",
      date: "2024-01-15",
      time: "2:15 PM",
    },
    {
      id: 3,
      action: "Document uploaded",
      document: "Service Contract - ABC Corp",
      date: "2024-01-14",
      time: "4:45 PM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
          <p className="text-muted-foreground">
            Track your document usage and signing activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">
                  {usageStats.totalDocuments}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Signers
                </p>
                <p className="text-2xl font-bold">{usageStats.totalSigners}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                +8% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Completion
                </p>
                <p className="text-2xl font-bold">
                  {usageStats.averageCompletionTime}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600">
                +0.3d from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">75%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">
                +5% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{data.month}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{data.documents} docs</span>
                    <span>{data.signers} signers</span>
                    <span>{data.completed} completed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {usageStats.documentsCompleted}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {usageStats.documentsPending}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={`activity-${activity.id}`}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.document}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.date} at {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage;
