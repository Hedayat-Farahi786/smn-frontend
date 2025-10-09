// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   FileText,
//   Users,
//   Clock,
//   CheckCircle,
//   TrendingUp,
//   Calendar,
//   Download,
//   BarChart3,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import StatsCard from "../components/StatsCard";

// const UsagePage: React.FC = () => {
//   const [timeRange, setTimeRange] = useState("30d");

//   const usageStats = {
//     totalDocuments: 24,
//     documentsThisMonth: 8,
//     totalSigners: 45,
//     averageCompletionTime: "1.2 days",
//     documentsCompleted: 18,
//     documentsPending: 6,
//   };

//   const monthlyData = [
//     { month: "Jan", documents: 8, signers: 15, completed: 6 },
//     { month: "Feb", documents: 12, signers: 22, completed: 10 },
//     { month: "Mar", documents: 4, signers: 8, completed: 2 },
//   ];

//   const recentActivity = [
//     {
//       id: 1,
//       action: "Document completed",
//       document: "Employment Agreement - John Smith",
//       date: "2024-01-16",
//       time: "10:30 AM",
//     },
//     {
//       id: 2,
//       action: "Document sent",
//       document: "NDA - Partnership Agreement",
//       date: "2024-01-15",
//       time: "2:15 PM",
//     },
//     {
//       id: 3,
//       action: "Document uploaded",
//       document: "Service Contract - ABC Corp",
//       date: "2024-01-14",
//       time: "4:45 PM",
//     },
//   ];

//   return (
//     <PageWrapper
//       title="Usage Analytics"
//       description="Track your document usage and signing activity"
//       icon={BarChart3}
//       actions={
//         <>
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="px-3 py-2 border border-blue-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="7d">Last 7 days</option>
//             <option value="30d">Last 30 days</option>
//             <option value="90d">Last 90 days</option>
//             <option value="1y">Last year</option>
//           </select>
//           <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
//             <Download className="h-4 w-4 mr-2" />
//             Export Report
//           </Button>
//         </>
//       }
//     >

//       {/* Overview Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard 
//           title="Total Documents" 
//           value={usageStats.totalDocuments} 
//           icon={FileText} 
//           change="+12%" 
//           trend="up" 
//           color="blue" 
//         />
//         <StatsCard 
//           title="Total Signers" 
//           value={usageStats.totalSigners} 
//           icon={Users} 
//           change="+8%" 
//           trend="up" 
//           color="green" 
//         />
//         <StatsCard 
//           title="Avg. Completion" 
//           value={usageStats.averageCompletionTime} 
//           icon={Clock} 
//           change="+0.3d" 
//           trend="down" 
//           color="yellow" 
//         />
//         <StatsCard 
//           title="Completion Rate" 
//           value="75%" 
//           icon={CheckCircle} 
//           change="+5%" 
//           trend="up" 
//           color="green" 
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Monthly Activity Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Monthly Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {monthlyData.map((data, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="font-medium">{data.month}</span>
//                   </div>
//                   <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                     <span>{data.documents} docs</span>
//                     <span>{data.signers} signers</span>
//                     <span>{data.completed} completed</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Document Status Breakdown */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Document Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                   <span>Completed</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-20 bg-muted rounded-full h-2">
//                     <div
//                       className="bg-green-600 h-2 rounded-full"
//                       style={{ width: "75%" }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">
//                     {usageStats.documentsCompleted}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Clock className="h-5 w-5 text-yellow-600" />
//                   <span>Pending</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-20 bg-muted rounded-full h-2">
//                     <div
//                       className="bg-yellow-600 h-2 rounded-full"
//                       style={{ width: "25%" }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-medium">
//                     {usageStats.documentsPending}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Activity</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {recentActivity.map((activity) => (
//               <div
//                 key={`activity-${activity.id}`}
//                 className="flex items-center justify-between p-4 border rounded-lg"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
//                     <FileText className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <p className="font-medium">{activity.action}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {activity.document}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {activity.date} at {activity.time}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </PageWrapper>
//   );
// };

// export default UsagePage;

import React from 'react'

const UsagePage = () => {
  return (
    <div>UsagePage</div>
  )
}

export default UsagePage