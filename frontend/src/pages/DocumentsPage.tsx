import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const DocumentsPage: React.FC = () => {
  const documents = [
    {
      id: 1,
      name: "Employment Agreement - John Smith",
      status: "Signed",
      date: "2024-01-15",
      size: "2.3 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      name: "NDA - TechCorp Partnership",
      status: "Pending",
      date: "2024-01-14",
      size: "1.8 MB",
      type: "PDF",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      id: 3,
      name: "Service Contract - ABC Corp",
      status: "Draft",
      date: "2024-01-13",
      size: "3.1 MB",
      type: "PDF",
      icon: Edit,
      color: "text-primary",
    },
    {
      id: 4,
      name: "Lease Agreement - Office Space",
      status: "Signed",
      date: "2024-01-12",
      size: "2.7 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 5,
      name: "Privacy Policy Update",
      status: "Review",
      date: "2024-01-11",
      size: "1.2 MB",
      type: "PDF",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documents</h1>
                <p className="text-slate-600 mt-1">
                  Manage your documents and track signing progress
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="shadow-sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <doc.icon className={`h-4 w-4 ${doc.color}`} />
                  <span className={`text-sm font-medium ${doc.color}`}>
                    {doc.status}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {doc.date}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Empty State (if no documents) */}
        {documents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600 mb-6">
              Get started by uploading your first document.
            </p>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
