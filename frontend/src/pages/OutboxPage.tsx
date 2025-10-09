// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   FileText,
//   Search,
//   Filter,
//   MoreVertical,
//   Eye,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Calendar,
//   Users,
//   Send,
//   Download,
//   RefreshCw,
//   UserCheck,
//   UserX,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import SearchAndFilter from "../components/SearchAndFilter";
// import StatsCard from "../components/StatsCard";

// const OutboxPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const documents = [
//     {
//       id: 1,
//       name: "Employment Agreement - New Hire",
//       status: "In Progress",
//       date: "2024-01-15",
//       size: "2.3 MB",
//       type: "PDF",
//       icon: Clock,
//       color: "text-primary",
//       signers: [
//         {
//           name: "John Smith",
//           email: "john.smith@company.com",
//           status: "Signed",
//           signedAt: "2024-01-16",
//         },
//         {
//           name: "HR Department",
//           email: "hr@company.com",
//           status: "Pending",
//           signedAt: null,
//         },
//       ],
//       totalSigners: 2,
//       completedSigners: 1,
//       dueDate: "2024-01-20",
//     },
//     {
//       id: 2,
//       name: "NDA - Partnership Agreement",
//       status: "Completed",
//       date: "2024-01-14",
//       size: "1.8 MB",
//       type: "PDF",
//       icon: CheckCircle,
//       color: "text-green-600",
//       signers: [
//         {
//           name: "Sarah Johnson",
//           email: "sarah.j@partners.com",
//           status: "Signed",
//           signedAt: "2024-01-15",
//         },
//         {
//           name: "Legal Team",
//           email: "legal@partners.com",
//           status: "Signed",
//           signedAt: "2024-01-15",
//         },
//       ],
//       totalSigners: 2,
//       completedSigners: 2,
//       dueDate: "2024-01-18",
//     },
//     {
//       id: 3,
//       name: "Service Contract - ABC Corp",
//       status: "Draft",
//       date: "2024-01-13",
//       size: "3.1 MB",
//       type: "PDF",
//       icon: AlertCircle,
//       color: "text-orange-600",
//       signers: [
//         {
//           name: "Mike Wilson",
//           email: "mike.w@abccorp.com",
//           status: "Not Sent",
//           signedAt: null,
//         },
//       ],
//       totalSigners: 1,
//       completedSigners: 0,
//       dueDate: "2024-01-20",
//     },
//     {
//       id: 4,
//       name: "Lease Agreement - Office Space",
//       status: "In Progress",
//       date: "2024-01-12",
//       size: "2.7 MB",
//       type: "PDF",
//       icon: Clock,
//       color: "text-primary",
//       signers: [
//         {
//           name: "Lisa Brown",
//           email: "lisa.b@realestate.com",
//           status: "Signed",
//           signedAt: "2024-01-13",
//         },
//         {
//           name: "Property Manager",
//           email: "manager@realestate.com",
//           status: "Pending",
//           signedAt: null,
//         },
//         {
//           name: "Legal Review",
//           email: "legal@company.com",
//           status: "Pending",
//           signedAt: null,
//         },
//       ],
//       totalSigners: 3,
//       completedSigners: 1,
//       dueDate: "2024-01-17",
//     },
//     {
//       id: 5,
//       name: "Privacy Policy Update",
//       status: "Expired",
//       date: "2024-01-10",
//       size: "1.2 MB",
//       type: "PDF",
//       icon: AlertCircle,
//       color: "text-red-600",
//       signers: [
//         {
//           name: "David Lee",
//           email: "david.l@company.com",
//           status: "Expired",
//           signedAt: null,
//         },
//       ],
//       totalSigners: 1,
//       completedSigners: 0,
//       dueDate: "2024-01-12",
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
//         return "bg-orange-100 text-orange-800";
//       case "In Progress":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Expired":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getSignerStatusIcon = (status: string) => {
//     switch (status) {
//       case "Signed":
//         return <UserCheck className="h-4 w-4 text-green-600" />;
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-600" />;
//       case "Expired":
//         return <UserX className="h-4 w-4 text-red-600" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-400" />;
//     }
//   };

//   const getSignerStatusColor = (status: string) => {
//     switch (status) {
//       case "Signed":
//         return "text-green-600";
//       case "Pending":
//         return "text-yellow-600";
//       case "Expired":
//         return "text-red-600";
//       default:
//         return "text-gray-400";
//     }
//   };

//   return (
//     <PageWrapper
//       title="Outbox"
//       description="Documents you've sent for signing"
//       icon={Send}
//       actions={
//         <>
//           <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh Status
//           </Button>
//           <Button className="bg-primary hover:bg-primary/90 text-white">
//             <Send className="h-4 w-4 mr-2" />
//             Send New Document
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
//           { value: "progress", label: "In Progress" },
//           { value: "completed", label: "Completed" },
//           { value: "expired", label: "Expired" },
//         ]}
//       />

//       {/* Documents List */}
//       <div className="space-y-4">
//         {filteredDocuments.map((doc) => (
//           <Card
//             key={doc.id}
//             className="group hover:shadow-lg transition-all duration-300"
//           >
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-start space-x-4 flex-1">
//                   <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
//                     <FileText className="h-6 w-6 text-muted-foreground" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <h3 className="font-semibold text-lg truncate">
//                         {doc.name}
//                       </h3>
//                       <span
//                         className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
//                           doc.status
//                         )}`}
//                       >
//                         {doc.status}
//                       </span>
//                     </div>

//                     <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-4 w-4" />
//                         <span>Sent: {doc.date}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-4 w-4" />
//                         <span>Due: {doc.dueDate}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Users className="h-4 w-4" />
//                         <span>
//                           {doc.completedSigners}/{doc.totalSigners} signed
//                         </span>
//                       </div>
//                     </div>

//                     <div className="text-xs text-muted-foreground">
//                       {doc.type} • {doc.size}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2 ml-4">
//                   {doc.status === "Draft" && (
//                     <Button variant="outline">
//                       <Send className="h-4 w-4 mr-2" />
//                       Send Now
//                     </Button>
//                   )}
//                   {doc.status === "Completed" && (
//                     <Button variant="outline">
//                       <Download className="h-4 w-4 mr-2" />
//                       Download
//                     </Button>
//                   )}
//                   <Button variant="outline" size="sm">
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="sm">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Signers Progress */}
//               <div className="border-t pt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="text-sm font-medium">Signers Progress</h4>
//                   <div className="text-sm text-muted-foreground">
//                     {doc.completedSigners} of {doc.totalSigners} completed
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   {doc.signers.map((signer, index) => (
//                     <div
//                       key={`${doc.id}-signer-${index}`}
//                       className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {getSignerStatusIcon(signer.status)}
//                         <div>
//                           <p className="text-sm font-medium">{signer.name}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {signer.email}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p
//                           className={`text-sm font-medium ${getSignerStatusColor(
//                             signer.status
//                           )}`}
//                         >
//                           {signer.status}
//                         </p>
//                         {signer.signedAt && (
//                           <p className="text-xs text-muted-foreground">
//                             {signer.signedAt}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredDocuments.length === 0 && (
//         <div className="text-center py-12">
//           <Send className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-2 text-sm font-medium">No documents found</h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {searchTerm || filterStatus !== "all"
//               ? "Try adjusting your search or filter criteria."
//               : "You haven't sent any documents for signing yet."}
//           </p>
//           <div className="mt-6">
//             <Button>
//               <Send className="h-4 w-4 mr-2" />
//               Send Your First Document
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatsCard title="In Progress" value="2" icon={Clock} color="blue" />
//         <StatsCard title="Completed" value="1" icon={CheckCircle} color="green" />
//         <StatsCard title="Draft" value="1" icon={AlertCircle} color="red" />
//         <StatsCard title="Total Signers" value="9" icon={Users} color="slate" />
//       </div>
//     </PageWrapper>
//   );
// };

// export default OutboxPage;

import React from 'react'

const OutboxPage = () => {
  return (
    <div>OutboxPage</div>
  )
}

export default OutboxPage