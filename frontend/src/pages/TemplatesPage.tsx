import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Star,
  Clock,
  Users,
} from "lucide-react";

const TemplatesPage: React.FC = () => {
  const templates = [
    {
      id: 1,
      name: "Employment Agreement",
      description: "Standard employment contract template",
      category: "HR",
      lastUsed: "2 days ago",
      usage: 45,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Non-Disclosure Agreement",
      description: "Confidentiality agreement template",
      category: "Legal",
      lastUsed: "1 week ago",
      usage: 23,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Service Contract",
      description: "Professional services agreement",
      category: "Business",
      lastUsed: "3 days ago",
      usage: 67,
      isFavorite: true,
    },
    {
      id: 4,
      name: "Lease Agreement",
      description: "Property rental agreement",
      category: "Real Estate",
      lastUsed: "1 month ago",
      usage: 12,
      isFavorite: false,
    },
    {
      id: 5,
      name: "Purchase Order",
      description: "Standard purchase order form",
      category: "Business",
      lastUsed: "5 days ago",
      usage: 89,
      isFavorite: false,
    },
    {
      id: 6,
      name: "Consulting Agreement",
      description: "Independent contractor agreement",
      category: "Business",
      lastUsed: "1 week ago",
      usage: 34,
      isFavorite: true,
    },
  ];

  const categories = ["All", "HR", "Legal", "Business", "Real Estate"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage document templates for faster workflows
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Import Template
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {template.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {template.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{template.usage} uses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{template.lastUsed}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no templates) */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No templates found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first template.
          </p>
          <div className="mt-6">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
