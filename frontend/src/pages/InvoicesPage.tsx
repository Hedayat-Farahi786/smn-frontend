// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   CreditCard,
//   Download,
//   Eye,
//   Calendar,
//   DollarSign,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Filter,
//   Search,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import SearchAndFilter from "../components/SearchAndFilter";

// const InvoicesPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const invoices = [
//     {
//       id: "INV-2024-001",
//       date: "2024-01-15",
//       dueDate: "2024-02-15",
//       amount: 19.99,
//       status: "Paid",
//       plan: "Professional",
//       period: "January 2024",
//       description: "Professional Plan - Monthly Subscription",
//       paymentMethod: "Credit Card ending in 4242",
//       paidDate: "2024-01-15",
//     },
//     {
//       id: "INV-2024-002",
//       date: "2024-01-15",
//       dueDate: "2024-02-15",
//       amount: 19.99,
//       status: "Paid",
//       plan: "Professional",
//       period: "December 2023",
//       description: "Professional Plan - Monthly Subscription",
//       paymentMethod: "Credit Card ending in 4242",
//       paidDate: "2023-12-15",
//     },
//     {
//       id: "INV-2024-003",
//       date: "2024-01-15",
//       dueDate: "2024-02-15",
//       amount: 9.99,
//       status: "Paid",
//       plan: "Standard",
//       period: "November 2023",
//       description: "Standard Plan - Monthly Subscription",
//       paymentMethod: "Credit Card ending in 4242",
//       paidDate: "2023-11-15",
//     },
//     {
//       id: "INV-2024-004",
//       date: "2024-01-15",
//       dueDate: "2024-02-15",
//       amount: 0.0,
//       status: "Paid",
//       plan: "Basic",
//       period: "October 2023",
//       description: "Basic Plan - Free Tier",
//       paymentMethod: "N/A",
//       paidDate: "2023-10-15",
//     },
//   ];

//   const filteredInvoices = invoices.filter((invoice) => {
//     const matchesSearch =
//       invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       invoice.plan.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterStatus === "all" ||
//       invoice.status.toLowerCase() === filterStatus.toLowerCase();
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "Paid":
//         return "bg-green-100 text-green-800";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "Overdue":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Paid":
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case "Pending":
//         return <Clock className="h-4 w-4 text-yellow-600" />;
//       case "Overdue":
//         return <AlertCircle className="h-4 w-4 text-red-600" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-400" />;
//     }
//   };

//   const totalPaid = invoices
//     .filter((inv) => inv.status === "Paid")
//     .reduce((sum, inv) => sum + inv.amount, 0);
//   const currentPlan = "Professional";
//   const nextBillingDate = "2024-02-15";

//   return (
//     <PageWrapper
//       title="Invoices & Billing"
//       description="Manage your billing history and subscription"
//       icon={CreditCard}
//       actions={
//         <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
//           <CreditCard className="h-4 w-4 mr-2" />
//           Update Payment Method
//         </Button>
//       }
//     >

//       {/* Billing Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Current Plan
//                 </p>
//                 <p className="text-2xl font-bold">{currentPlan}</p>
//               </div>
//               <CreditCard className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Paid
//                 </p>
//                 <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
//               </div>
//               <DollarSign className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Next Billing
//                 </p>
//                 <p className="text-2xl font-bold">{nextBillingDate}</p>
//               </div>
//               <Calendar className="h-8 w-8 text-muted-foreground" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <SearchAndFilter
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         searchPlaceholder="Search invoices..."
//         filterValue={filterStatus}
//         onFilterChange={setFilterStatus}
//         filterOptions={[
//           { value: "all", label: "All Status" },
//           { value: "paid", label: "Paid" },
//           { value: "pending", label: "Pending" },
//           { value: "overdue", label: "Overdue" },
//         ]}
//       />

//       {/* Invoices List */}
//       <div className="space-y-4">
//         {filteredInvoices.map((invoice) => (
//           <Card
//             key={invoice.id}
//             className="group hover:shadow-lg transition-all duration-300"
//           >
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start space-x-4 flex-1">
//                   <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
//                     <CreditCard className="h-6 w-6 text-muted-foreground" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <h3 className="font-semibold text-lg truncate">
//                         {invoice.id}
//                       </h3>
//                       <span
//                         className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
//                           invoice.status
//                         )}`}
//                       >
//                         {invoice.status}
//                       </span>
//                     </div>

//                     <p className="text-sm text-muted-foreground mb-2">
//                       {invoice.description}
//                     </p>

//                     <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-4 w-4" />
//                         <span>Date: {invoice.date}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-4 w-4" />
//                         <span>Due: {invoice.dueDate}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <span>Period: {invoice.period}</span>
//                       </div>
//                     </div>

//                     <div className="text-xs text-muted-foreground">
//                       {invoice.paymentMethod}
//                       {invoice.paidDate && ` • Paid on ${invoice.paidDate}`}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4 ml-4">
//                   <div className="text-right">
//                     <p className="text-2xl font-bold">
//                       ${invoice.amount.toFixed(2)}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {invoice.plan}
//                     </p>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     {getStatusIcon(invoice.status)}
//                     <Button variant="outline" size="sm">
//                       <Eye className="h-4 w-4 mr-1" />
//                       View
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       <Download className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredInvoices.length === 0 && (
//         <div className="text-center py-12">
//           <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-2 text-sm font-medium">No invoices found</h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {searchTerm || filterStatus !== "all"
//               ? "Try adjusting your search or filter criteria."
//               : "You don't have any invoices yet."}
//           </p>
//         </div>
//       )}

//       {/* Pricing Plans */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Available Plans</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="border rounded-lg p-4">
//               <h3 className="font-semibold text-lg mb-2">Basic</h3>
//               <p className="text-3xl font-bold mb-2">Free</p>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Up to 3 documents per month</li>
//                 <li>• 1 signer per document</li>
//                 <li>• Basic support</li>
//               </ul>
//               <Button variant="outline" className="w-full mt-4">
//                 Current Plan
//               </Button>
//             </div>

//             <div className="border rounded-lg p-4 border-primary">
//               <h3 className="font-semibold text-lg mb-2">Standard</h3>
//               <p className="text-3xl font-bold mb-2">
//                 €9.99<span className="text-sm font-normal">/month</span>
//               </p>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Unlimited documents</li>
//                 <li>• Up to 5 signers per document</li>
//                 <li>• Email support</li>
//               </ul>
//               <Button variant="outline" className="w-full mt-4">
//                 Upgrade
//               </Button>
//             </div>

//             <div className="border rounded-lg p-4">
//               <h3 className="font-semibold text-lg mb-2">Professional</h3>
//               <p className="text-3xl font-bold mb-2">
//                 €19.99<span className="text-sm font-normal">/month</span>
//               </p>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Unlimited documents and signers</li>
//                 <li>• Premium support</li>
//                 <li>• Advanced analytics</li>
//               </ul>
//               <Button className="w-full mt-4">Current Plan</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </PageWrapper>
//   );
// };

// export default InvoicesPage;


import React from 'react'

const InvoicesPage = () => {
  return (
    <div>InvoicesPage</div>
  )
}

export default InvoicesPage