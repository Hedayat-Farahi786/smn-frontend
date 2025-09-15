import React, { useState } from "react";
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
  Share,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";

const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const documents = [
    {
      id: 1,
      name: "Employment Agreement - John Smith",
      status: "Draft",
      date: "2024-01-15",
      size: "2.3 MB",
      type: "PDF",
      icon: Edit,
      color: "text-blue-600",
      signers: 1,
      lastModified: "2 hours ago",
    },
    {
      id: 2,
      name: "NDA - TechCorp Partnership",
      status: "Ready to Send",
      date: "2024-01-14",
      size: "1.8 MB",
      type: "PDF",
      icon: Clock,
      color: "text-yellow-600",
      signers: 2,
      lastModified: "1 day ago",
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
      signers: 3,
      lastModified: "2 days ago",
    },
    {
      id: 4,
      name: "Lease Agreement - Office Space",
      status: "Completed",
      date: "2024-01-12",
      size: "2.7 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: 2,
      lastModified: "3 days ago",
    },
    {
      id: 5,
      name: "Privacy Policy Update",
      status: "In Review",
      date: "2024-01-11",
      size: "1.2 MB",
      type: "PDF",
      icon: AlertCircle,
      color: "text-orange-600",
      signers: 1,
      lastModified: "4 days ago",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      doc.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-blue-100 text-blue-800";
      case "Ready to Send":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Library
          </h1>
          <p className="text-muted-foreground">
            Manage your personal documents and prepare them for signing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready to Send</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
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
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{doc.signers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{doc.date}</span>
                </div>
                <span>Modified {doc.lastModified}</span>
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
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No documents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by uploading your first document."}
          </p>
          <div className="mt-6">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Drafts</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Ready to Send</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">In Review</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LibraryPage;
