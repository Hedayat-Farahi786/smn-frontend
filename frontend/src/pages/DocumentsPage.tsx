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
      color: "text-blue-600",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage your documents and track signing progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
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
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No documents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by uploading your first document.
          </p>
          <div className="mt-6">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
