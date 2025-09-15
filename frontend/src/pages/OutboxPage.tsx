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
  Users,
  Send,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";

const OutboxPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const documents = [
    {
      id: 1,
      name: "Employment Agreement - New Hire",
      status: "In Progress",
      date: "2024-01-15",
      size: "2.3 MB",
      type: "PDF",
      icon: Clock,
      color: "text-blue-600",
      signers: [
        {
          name: "John Smith",
          email: "john.smith@company.com",
          status: "Signed",
          signedAt: "2024-01-16",
        },
        {
          name: "HR Department",
          email: "hr@company.com",
          status: "Pending",
          signedAt: null,
        },
      ],
      totalSigners: 2,
      completedSigners: 1,
      dueDate: "2024-01-20",
    },
    {
      id: 2,
      name: "NDA - Partnership Agreement",
      status: "Completed",
      date: "2024-01-14",
      size: "1.8 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: [
        {
          name: "Sarah Johnson",
          email: "sarah.j@partners.com",
          status: "Signed",
          signedAt: "2024-01-15",
        },
        {
          name: "Legal Team",
          email: "legal@partners.com",
          status: "Signed",
          signedAt: "2024-01-15",
        },
      ],
      totalSigners: 2,
      completedSigners: 2,
      dueDate: "2024-01-18",
    },
    {
      id: 3,
      name: "Service Contract - ABC Corp",
      status: "Draft",
      date: "2024-01-13",
      size: "3.1 MB",
      type: "PDF",
      icon: AlertCircle,
      color: "text-orange-600",
      signers: [
        {
          name: "Mike Wilson",
          email: "mike.w@abccorp.com",
          status: "Not Sent",
          signedAt: null,
        },
      ],
      totalSigners: 1,
      completedSigners: 0,
      dueDate: "2024-01-20",
    },
    {
      id: 4,
      name: "Lease Agreement - Office Space",
      status: "In Progress",
      date: "2024-01-12",
      size: "2.7 MB",
      type: "PDF",
      icon: Clock,
      color: "text-blue-600",
      signers: [
        {
          name: "Lisa Brown",
          email: "lisa.b@realestate.com",
          status: "Signed",
          signedAt: "2024-01-13",
        },
        {
          name: "Property Manager",
          email: "manager@realestate.com",
          status: "Pending",
          signedAt: null,
        },
        {
          name: "Legal Review",
          email: "legal@company.com",
          status: "Pending",
          signedAt: null,
        },
      ],
      totalSigners: 3,
      completedSigners: 1,
      dueDate: "2024-01-17",
    },
    {
      id: 5,
      name: "Privacy Policy Update",
      status: "Expired",
      date: "2024-01-10",
      size: "1.2 MB",
      type: "PDF",
      icon: AlertCircle,
      color: "text-red-600",
      signers: [
        {
          name: "David Lee",
          email: "david.l@company.com",
          status: "Expired",
          signedAt: null,
        },
      ],
      totalSigners: 1,
      completedSigners: 0,
      dueDate: "2024-01-12",
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
        return "bg-orange-100 text-orange-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSignerStatusIcon = (status: string) => {
    switch (status) {
      case "Signed":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Expired":
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSignerStatusColor = (status: string) => {
    switch (status) {
      case "Signed":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Expired":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outbox</h1>
          <p className="text-muted-foreground">
            Documents you've sent for signing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send New Document
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
              <option value="progress">In Progress</option>
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
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
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
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Sent: {doc.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {doc.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {doc.completedSigners}/{doc.totalSigners} signed
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {doc.status === "Draft" && (
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
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

              {/* Signers Progress */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Signers Progress</h4>
                  <div className="text-sm text-muted-foreground">
                    {doc.completedSigners} of {doc.totalSigners} completed
                  </div>
                </div>

                <div className="space-y-2">
                  {doc.signers.map((signer, index) => (
                    <div
                      key={`${doc.id}-signer-${index}`}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getSignerStatusIcon(signer.status)}
                        <div>
                          <p className="text-sm font-medium">{signer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {signer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${getSignerStatusColor(
                            signer.status
                          )}`}
                        >
                          {signer.status}
                        </p>
                        {signer.signedAt && (
                          <p className="text-xs text-muted-foreground">
                            {signer.signedAt}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <Send className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No documents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You haven't sent any documents for signing yet."}
          </p>
          <div className="mt-6">
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Your First Document
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-sm font-medium">Draft</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Signers</p>
                <p className="text-2xl font-bold">9</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutboxPage;
