import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Brain,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
} from "lucide-react";

const AnalysisPage: React.FC = () => {
  const analysisResults = [
    {
      id: 1,
      document: "Employment Agreement - John Smith",
      status: "Completed",
      riskLevel: "Low",
      confidence: 95,
      issues: 2,
      suggestions: 5,
      lastAnalyzed: "2 hours ago",
    },
    {
      id: 2,
      document: "NDA - TechCorp Partnership",
      status: "In Progress",
      riskLevel: "Medium",
      confidence: 87,
      issues: 4,
      suggestions: 8,
      lastAnalyzed: "1 hour ago",
    },
    {
      id: 3,
      document: "Service Contract - ABC Corp",
      status: "Completed",
      riskLevel: "High",
      confidence: 92,
      issues: 7,
      suggestions: 12,
      lastAnalyzed: "3 hours ago",
    },
  ];

  const riskFactors = [
    { factor: "Payment Terms", risk: "High", impact: "Financial" },
    { factor: "Termination Clauses", risk: "Medium", impact: "Legal" },
    { factor: "Intellectual Property", risk: "Low", impact: "Legal" },
    { factor: "Confidentiality", risk: "Medium", impact: "Compliance" },
  ];

  const insights = [
    {
      type: "warning",
      title: "Payment Terms Risk",
      description:
        "Payment terms are not clearly defined and could lead to disputes.",
      icon: AlertTriangle,
    },
    {
      type: "success",
      title: "Strong Confidentiality Clause",
      description:
        "The confidentiality section is well-structured and comprehensive.",
      icon: CheckCircle,
    },
    {
      type: "info",
      title: "Consider Adding Force Majeure",
      description:
        "Adding a force majeure clause could protect against unforeseen circumstances.",
      icon: Brain,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Document Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze documents for risks, compliance, and optimization
            opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Analyze Document
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Documents Analyzed
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Risk Issues Found
                </p>
                <p className="text-2xl font-bold">13</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Suggestions Generated
                </p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Confidence
                </p>
                <p className="text-2xl font-bold">91%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Analysis */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Analysis</h2>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {analysisResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{result.document}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.lastAnalyzed}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.riskLevel === "Low"
                          ? "bg-green-100 text-green-800"
                          : result.riskLevel === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.riskLevel} Risk
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Risk Analysis</h2>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{factor.factor}</p>
                    <p className="text-xs text-muted-foreground">
                      {factor.impact}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      factor.risk === "Low"
                        ? "bg-green-100 text-green-800"
                        : factor.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {factor.risk}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              AI Insights & Recommendations
            </h2>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "warning"
                    ? "border-orange-200 bg-orange-50"
                    : insight.type === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <insight.icon
                    className={`h-5 w-5 mt-0.5 ${
                      insight.type === "warning"
                        ? "text-orange-600"
                        : insight.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div>
                    <h3 className="font-medium text-sm mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisPage;
