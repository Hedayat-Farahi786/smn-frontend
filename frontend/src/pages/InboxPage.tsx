import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Download,
  ExternalLink,
} from "lucide-react";

const InboxPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const documents = [
    {
      id: 1,
      name: "Employment Agreement - TechCorp",
      sender: "John Smith",
      senderEmail: "john.smith@techcorp.com",
      status: "Pending Signature",
      date: "2024-01-15",
      size: "2.3 MB",
      type: "PDF",
      icon: Clock,
      color: "text-yellow-600",
      dueDate: "2024-01-20",
      priority: "High",
    },
    {
      id: 2,
      name: "NDA - Partnership Agreement",
      sender: "Sarah Johnson",
      senderEmail: "sarah.j@partners.com",
      status: "Pending Signature",
      date: "2024-01-14",
      size: "1.8 MB",
      type: "PDF",
      icon: Clock,
      color: "text-yellow-600",
      dueDate: "2024-01-18",
      priority: "Medium",
    },
    {
      id: 3,
      name: "Service Contract - ABC Corp",
      sender: "Mike Wilson",
      senderEmail: "mike.w@abccorp.com",
      status: "Completed",
      date: "2024-01-13",
      size: "3.1 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      dueDate: "2024-01-15",
      priority: "Low",
    },
    {
      id: 4,
      name: "Lease Agreement - Office Space",
      sender: "Lisa Brown",
      senderEmail: "lisa.b@realestate.com",
      status: "Expired",
      date: "2024-01-10",
      size: "2.7 MB",
      type: "PDF",
      icon: AlertCircle,
      color: "text-red-600",
      dueDate: "2024-01-12",
      priority: "High",
    },
    {
      id: 5,
      name: "Privacy Policy Update",
      sender: "David Lee",
      senderEmail: "david.l@company.com",
      status: "Pending Signature",
      date: "2024-01-11",
      size: "1.2 MB",
      type: "PDF",
      icon: Clock,
      color: "text-yellow-600",
      dueDate: "2024-01-16",
      priority: "Medium",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      doc.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending Signature":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Documents waiting for your signature
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Check Email
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search documents or senders..."
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
              <option value="pending">Pending Signature</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <Card
            key={doc.id}
            className={`group hover:shadow-lg transition-all duration-300 ${
              isOverdue(doc.dueDate) && doc.status === "Pending Signature"
                ? "border-red-200 bg-red-50/50"
                : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {doc.name}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                      <span
                        className={`text-xs font-medium ${getPriorityColor(
                          doc.priority
                        )}`}
                      >
                        {doc.priority}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>From: {doc.sender}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Received: {doc.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span
                          className={
                            isOverdue(doc.dueDate) &&
                            doc.status === "Pending Signature"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          Due: {doc.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>
                        {doc.type} • {doc.size}
                      </span>
                      <span>{doc.senderEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {doc.status === "Pending Signature" && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sign Now
                    </Button>
                  )}
                  {doc.status === "Completed" && (
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No documents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You don't have any documents waiting for your signature."}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">3</p>
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
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Expired</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InboxPage;
