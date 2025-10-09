// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   FileText,
//   Upload,
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   Eye,
//   Edit,
//   Share,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Calendar,
//   User,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import SearchAndFilter from "../components/SearchAndFilter";
// import StatsCard from "../components/StatsCard";

// const LibraryPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const documents = [
//     {
//       id: 1,
//       name: "Employment Agreement - John Smith",
//       status: "Draft",
//       date: "2024-01-15",
//       size: "2.3 MB",
//       type: "PDF",
//       icon: Edit,
//       color: "text-primary",
//       signers: 1,
//       lastModified: "2 hours ago",
//     },
//     {
//       id: 2,
//       name: "NDA - TechCorp Partnership",
//       status: "Ready to Send",
//       date: "2024-01-14",
//       size: "1.8 MB",
//       type: "PDF",
//       icon: Clock,
//       color: "text-yellow-600",
//       signers: 2,
//       lastModified: "1 day ago",
//     },
//     {
//       id: 3,
//       name: "Service Contract - ABC Corp",
//       status: "Draft",
//       date: "2024-01-13",
//       size: "3.1 MB",
//       type: "PDF",
//       icon: Edit,
//       color: "text-primary",
//       signers: 3,
//       lastModified: "2 days ago",
//     },
//     {
//       id: 4,
//       name: "Lease Agreement - Office Space",
//       status: "Completed",
//       date: "2024-01-12",
//       size: "2.7 MB",
//       type: "PDF",
//       icon: CheckCircle,
//       color: "text-green-600",
//       signers: 2,
//       lastModified: "3 days ago",
//     },
//     {
//       id: 5,
//       name: "Privacy Policy Update",
//       status: "In Review",
//       date: "2024-01-11",
//       size: "1.2 MB",
//       type: "PDF",
//       icon: AlertCircle,
//       color: "text-orange-600",
//       signers: 1,
//       lastModified: "4 days ago",
//     },
//   ];

//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch = doc.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterStatus === "all" ||
//       doc.status.toLowerCase().includes(filterStatus.toLowerCase());
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "Draft":
//         return "bg-blue-100 text-blue-800";
//       case "Ready to Send":
//         return "bg-yellow-100 text-yellow-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "In Review":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <PageWrapper
//       title="Document Library"
//       description="Organize, manage, and track all your documents in one place"
//       icon={FileText}
//       actions={
//         <>
//           <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
//             <Upload className="h-4 w-4 mr-2" />
//             Upload
//           </Button>
//           <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
//             <Plus className="h-4 w-4 mr-2" />
//             New Document
//           </Button>
//         </>
//       }
//     >

//       <SearchAndFilter
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         searchPlaceholder="Search documents..."
//         filterValue={filterStatus}
//         onFilterChange={setFilterStatus}
//         filterOptions={[
//           { value: "all", label: "All Status" },
//           { value: "draft", label: "Draft" },
//           { value: "ready", label: "Ready to Send" },
//           { value: "review", label: "In Review" },
//           { value: "completed", label: "Completed" },
//         ]}
//       />

//       {/* Documents Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredDocuments.map((doc) => (
//           <Card
//             key={doc.id}
//             className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//           >
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
//                     <FileText className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-sm line-clamp-2">
//                       {doc.name}
//                     </h3>
//                     <p className="text-xs text-muted-foreground">
//                       {doc.type} • {doc.size}
//                     </p>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-2">
//                   <doc.icon className={`h-4 w-4 ${doc.color}`} />
//                   <span
//                     className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
//                       doc.status
//                     )}`}
//                   >
//                     {doc.status}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-1 text-xs text-muted-foreground">
//                   <User className="h-3 w-3" />
//                   <span>{doc.signers}</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
//                 <div className="flex items-center space-x-1">
//                   <Calendar className="h-3 w-3" />
//                   <span>{doc.date}</span>
//                 </div>
//                 <span>Modified {doc.lastModified}</span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button variant="outline" size="sm" className="flex-1">
//                   <Eye className="h-4 w-4 mr-1" />
//                   View
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1">
//                   <Edit className="h-4 w-4 mr-1" />
//                   Edit
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Share className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredDocuments.length === 0 && (
//         <div className="text-center py-12">
//           <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-2 text-sm font-medium">No documents found</h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {searchTerm || filterStatus !== "all"
//               ? "Try adjusting your search or filter criteria."
//               : "Get started by uploading your first document."}
//           </p>
//           <div className="mt-6">
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Upload Document
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatsCard title="Drafts" value="2" icon={Edit} color="blue" />
//         <StatsCard title="Ready to Send" value="1" icon={Clock} color="yellow" />
//         <StatsCard title="Completed" value="1" icon={CheckCircle} color="green" />
//         <StatsCard title="In Review" value="1" icon={AlertCircle} color="red" />
//       </div>
//     </PageWrapper>
//   );
// };

// export default LibraryPage;


import React from 'react'

const LibraryPage = () => {
  return (
    <div>LibraryPage</div>
  )
}

export default LibraryPage