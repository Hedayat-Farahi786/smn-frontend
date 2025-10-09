// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   Mail,
//   Send,
//   Search,
//   Filter,
//   MoreVertical,
//   User,
//   Clock,
//   Plus,
//   MessageSquare,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import SearchAndFilter from "../components/SearchAndFilter";

// const MessagesPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("inbox");

//   interface InboxMessage {
//     id: number;
//     sender: string;
//     senderEmail: string;
//     subject: string;
//     preview: string;
//     date: string;
//     time: string;
//     status: string;
//     type: string;
//   }

//   interface SentMessage {
//     id: number;
//     recipient: string;
//     recipientEmail: string;
//     subject: string;
//     preview: string;
//     date: string;
//     time: string;
//     status: string;
//   }

//   const messages: InboxMessage[] = [
//     {
//       id: 1,
//       sender: "John Smith",
//       senderEmail: "john.smith@company.com",
//       subject: "Document signed successfully",
//       preview:
//         "Thank you for signing the employment agreement. The document has been completed and is available for download.",
//       date: "2024-01-16",
//       time: "10:30 AM",
//       status: "read",
//       type: "notification",
//     },
//     {
//       id: 2,
//       sender: "Sarah Johnson",
//       senderEmail: "sarah.j@partners.com",
//       subject: "Reminder: NDA signature pending",
//       preview:
//         "This is a friendly reminder that your signature is still pending on the partnership NDA. Please sign at your earliest convenience.",
//       date: "2024-01-15",
//       time: "2:15 PM",
//       status: "unread",
//       type: "reminder",
//     },
//     {
//       id: 3,
//       sender: "System",
//       senderEmail: "noreply@signmenow.com",
//       subject: "Document completed: Service Contract",
//       preview:
//         "The service contract with ABC Corp has been fully executed. All parties have signed and the final document is ready.",
//       date: "2024-01-14",
//       time: "4:45 PM",
//       status: "read",
//       type: "system",
//     },
//   ];

//   const sentMessages: SentMessage[] = [
//     {
//       id: 1,
//       recipient: "Mike Wilson",
//       recipientEmail: "mike.w@abccorp.com",
//       subject: "Document sent for signature",
//       preview:
//         "I've sent you the service contract for your review and signature. Please let me know if you have any questions.",
//       date: "2024-01-13",
//       time: "9:20 AM",
//       status: "sent",
//     },
//   ];

//   const currentMessages = activeTab === "inbox" ? messages : sentMessages;

//   return (
//     <PageWrapper
//       title="Messages"
//       description="Internal messaging and notifications"
//       icon={MessageSquare}
//       actions={
//         <Button className="bg-primary hover:bg-primary/90 text-white">
//           <Plus className="h-4 w-4 mr-2" />
//           New Message
//         </Button>
//       }
//     >

//       {/* Tabs */}
//       <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
//         <Button
//           variant={activeTab === "inbox" ? "default" : "ghost"}
//           onClick={() => setActiveTab("inbox")}
//           className="flex items-center space-x-2"
//         >
//           <Mail className="h-4 w-4" />
//           <span>Inbox</span>
//           <span className="bg-primary-foreground text-primary text-xs px-2 py-1 rounded-full">
//             {messages.filter((m) => m.status === "unread").length}
//           </span>
//         </Button>
//         <Button
//           variant={activeTab === "sent" ? "default" : "ghost"}
//           onClick={() => setActiveTab("sent")}
//           className="flex items-center space-x-2"
//         >
//           <Send className="h-4 w-4" />
//           <span>Sent</span>
//         </Button>
//       </div>

//       <SearchAndFilter
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         searchPlaceholder="Search messages..."
//       />

//       {/* Messages List */}
//       <div className="space-y-4">
//         {currentMessages.map((message) => (
//           <Card
//             key={message.id}
//             className={`group hover:shadow-lg transition-all duration-300 ${
//               message.status === "unread"
//                 ? "border-primary/20 bg-primary/5"
//                 : ""
//             }`}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start space-x-4 flex-1">
//                   <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
//                     <User className="h-5 w-5 text-muted-foreground" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <h3 className="font-semibold text-lg truncate">
//                         {activeTab === "inbox"
//                           ? (message as InboxMessage).sender
//                           : (message as SentMessage).recipient}
//                       </h3>
//                       {message.status === "unread" && (
//                         <div className="w-2 h-2 bg-primary rounded-full"></div>
//                       )}
//                     </div>

//                     <h4 className="font-medium text-base mb-2">
//                       {message.subject}
//                     </h4>

//                     <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
//                       {message.preview}
//                     </p>

//                     <div className="flex items-center space-x-4 text-xs text-muted-foreground">
//                       <div className="flex items-center space-x-1">
//                         <Mail className="h-3 w-3" />
//                         <span>
//                           {activeTab === "inbox"
//                             ? (message as InboxMessage).senderEmail
//                             : (message as SentMessage).recipientEmail}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-3 w-3" />
//                         <span>
//                           {message.date} at {message.time}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2 ml-4">
//                   <Button variant="outline" size="sm">
//                     Reply
//                   </Button>
//                   <Button variant="ghost" size="sm">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {currentMessages.length === 0 && (
//         <div className="text-center py-12">
//           <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-2 text-sm font-medium">No messages found</h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {activeTab === "inbox"
//               ? "You don't have any messages in your inbox."
//               : "You haven't sent any messages yet."}
//           </p>
//         </div>
//       )}
//     </PageWrapper>
//   );
// };

// export default MessagesPage;

import React from 'react'

const MessagesPage = () => {
  return (
    <div>MessagesPage</div>
  )
}

export default MessagesPage