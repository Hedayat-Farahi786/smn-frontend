import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Share,
  Calendar,
  Users,
  CheckCircle,
  Archive,
  Clock,
  ExternalLink,
} from "lucide-react";

const ArchivePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");

  const documents = [
    {
      id: 1,
      name: "Employment Agreement - John Smith",
      status: "Completed",
      date: "2024-01-15",
      completedDate: "2024-01-16",
      size: "2.3 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["John Smith", "HR Department"],
      totalSigners: 2,
      category: "Employment",
      tags: ["contract", "employment", "hr"],
    },
    {
      id: 2,
      name: "NDA - TechCorp Partnership",
      status: "Completed",
      date: "2024-01-14",
      completedDate: "2024-01-15",
      size: "1.8 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["Sarah Johnson", "Legal Team"],
      totalSigners: 2,
      category: "Legal",
      tags: ["nda", "partnership", "legal"],
    },
    {
      id: 3,
      name: "Service Contract - ABC Corp",
      status: "Completed",
      date: "2024-01-13",
      completedDate: "2024-01-14",
      size: "3.1 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["Mike Wilson", "Legal Review"],
      totalSigners: 2,
      category: "Business",
      tags: ["service", "contract", "business"],
    },
    {
      id: 4,
      name: "Lease Agreement - Office Space",
      status: "Completed",
      date: "2024-01-12",
      completedDate: "2024-01-13",
      size: "2.7 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["Lisa Brown", "Property Manager", "Legal Review"],
      totalSigners: 3,
      category: "Real Estate",
      tags: ["lease", "office", "real-estate"],
    },
    {
      id: 5,
      name: "Privacy Policy Update",
      status: "Completed",
      date: "2024-01-11",
      completedDate: "2024-01-12",
      size: "1.2 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["David Lee"],
      totalSigners: 1,
      category: "Legal",
      tags: ["privacy", "policy", "legal"],
    },
    {
      id: 6,
      name: "Software License Agreement",
      status: "Completed",
      date: "2023-12-20",
      completedDate: "2023-12-21",
      size: "1.5 MB",
      type: "PDF",
      icon: CheckCircle,
      color: "text-green-600",
      signers: ["Tech Team", "Legal Department"],
      totalSigners: 2,
      category: "Technology",
      tags: ["software", "license", "tech"],
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesYear = filterYear === "all" || doc.date.startsWith(filterYear);

    return matchesSearch && matchesYear;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Employment":
        return "bg-blue-100 text-blue-800";
      case "Legal":
        return "bg-purple-100 text-purple-800";
      case "Business":
        return "bg-green-100 text-green-800";
      case "Real Estate":
        return "bg-orange-100 text-orange-800";
      case "Technology":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const years = ["all", "2024", "2023", "2022"];
  const categories = [
    "all",
    "Employment",
    "Legal",
    "Business",
    "Real Estate",
    "Technology",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
          <p className="text-muted-foreground">
            Completed and stored documents for future reference
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Archive
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search documents, categories, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {category === "all" ? "All Categories" : category}
          </Button>
        ))}
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
                  <span className="text-sm font-medium text-green-600">
                    Completed
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                    doc.category
                  )}`}
                >
                  {doc.category}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {doc.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed: {doc.completedDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{doc.totalSigners} signers</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.map((tag, index) => (
                  <span
                    key={`${doc.id}-tag-${index}`}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
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
          <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No documents found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || filterYear !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You don't have any completed documents in your archive yet."}
          </p>
        </div>
      )}

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Completed</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Avg. Completion</p>
                <p className="text-2xl font-bold">1.2d</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchivePage;
