// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   BookOpen,
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   User,
//   Mail,
//   Phone,
//   Building,
//   Edit,
//   Trash2,
//   Eye,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";

// const AddressBookPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddingContact, setIsAddingContact] = useState(false);
//   const [, setEditingContact] = useState<number | null>(null);
//   const [newContact, setNewContact] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     title: "",
//   });

//   const contacts = [
//     {
//       id: 1,
//       name: "John Smith",
//       email: "john.smith@company.com",
//       phone: "+1 (555) 123-4567",
//       company: "TechCorp Inc.",
//       title: "CEO",
//       lastUsed: "2024-01-15",
//       documentsCount: 5,
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       email: "sarah.j@partners.com",
//       phone: "+1 (555) 234-5678",
//       company: "Partners LLC",
//       title: "Legal Director",
//       lastUsed: "2024-01-14",
//       documentsCount: 3,
//     },
//     {
//       id: 3,
//       name: "Mike Wilson",
//       email: "mike.w@abccorp.com",
//       phone: "+1 (555) 345-6789",
//       company: "ABC Corporation",
//       title: "Manager",
//       lastUsed: "2024-01-13",
//       documentsCount: 2,
//     },
//     {
//       id: 4,
//       name: "Lisa Brown",
//       email: "lisa.b@realestate.com",
//       phone: "+1 (555) 456-7890",
//       company: "Real Estate Group",
//       title: "Property Manager",
//       lastUsed: "2024-01-12",
//       documentsCount: 1,
//     },
//   ];

//   const filteredContacts = contacts.filter(
//     (contact) =>
//       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.company.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddContact = () => {
//     if (newContact.name && newContact.email) {
//       // TODO: Implement add contact API call
//       console.log("Adding contact:", newContact);
//       setNewContact({ name: "", email: "", phone: "", company: "", title: "" });
//       setIsAddingContact(false);
//     }
//   };

//   const handleEditContact = (contactId: number) => {
//     setEditingContact(contactId);
//     // TODO: Load contact data for editing
//   };

//   const handleDeleteContact = (contactId: number) => {
//     // TODO: Implement delete contact API call
//     console.log("Deleting contact:", contactId);
//   };

//   return (
//     <PageWrapper
//       title="Address Book"
//       description="Manage your frequently used contacts for document signing"
//       icon={BookOpen}
//       actions={
//         <Button onClick={() => setIsAddingContact(true)} className="bg-primary hover:bg-primary/90 text-white">
//           <Plus className="h-4 w-4 mr-2" />
//           Add Contact
//         </Button>
//       }
//     >
//       {/* Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
//             <input
//               placeholder="Search contacts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
//             <Filter className="h-4 w-4 mr-2" />
//             Filter
//           </Button>
//         </div>
//       </div>

//       {/* Add Contact Form */}
//       {isAddingContact && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Add New Contact</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name *</Label>
//                 <Input
//                   id="name"
//                   value={newContact.name}
//                   onChange={(e) =>
//                     setNewContact({ ...newContact, name: e.target.value })
//                   }
//                   placeholder="Enter full name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address *</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={newContact.email}
//                   onChange={(e) =>
//                     setNewContact({ ...newContact, email: e.target.value })
//                   }
//                   placeholder="Enter email address"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input
//                   id="phone"
//                   value={newContact.phone}
//                   onChange={(e) =>
//                     setNewContact({ ...newContact, phone: e.target.value })
//                   }
//                   placeholder="Enter phone number"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="company">Company</Label>
//                 <Input
//                   id="company"
//                   value={newContact.company}
//                   onChange={(e) =>
//                     setNewContact({ ...newContact, company: e.target.value })
//                   }
//                   placeholder="Enter company name"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="title">Title/Position</Label>
//               <Input
//                 id="title"
//                 value={newContact.title}
//                 onChange={(e) =>
//                   setNewContact({ ...newContact, title: e.target.value })
//                 }
//                 placeholder="Enter job title"
//               />
//             </div>

//             <div className="flex justify-end space-x-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsAddingContact(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleAddContact}>Add Contact</Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Contacts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredContacts.map((contact) => (
//           <Card
//             key={contact.id}
//             className="group hover:shadow-lg transition-all duration-300"
//           >
//             <CardContent className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
//                     <User className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">{contact.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {contact.title}
//                     </p>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center space-x-2 text-sm">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <span className="truncate">{contact.email}</span>
//                 </div>
//                 {contact.phone && (
//                   <div className="flex items-center space-x-2 text-sm">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <span>{contact.phone}</span>
//                   </div>
//                 )}
//                 {contact.company && (
//                   <div className="flex items-center space-x-2 text-sm">
//                     <Building className="h-4 w-4 text-muted-foreground" />
//                     <span className="truncate">{contact.company}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
//                 <span>Last used: {contact.lastUsed}</span>
//                 <span>{contact.documentsCount} documents</span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button variant="outline" size="sm" className="flex-1">
//                   <Eye className="h-4 w-4 mr-1" />
//                   View
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleEditContact(contact.id)}
//                 >
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleDeleteContact(contact.id)}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredContacts.length === 0 && (
//         <div className="text-center py-12">
//           <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-2 text-sm font-medium">No contacts found</h3>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {searchTerm
//               ? "Try adjusting your search criteria."
//               : "You don't have any contacts in your address book yet."}
//           </p>
//           <div className="mt-6">
//             <Button onClick={() => setIsAddingContact(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Your First Contact
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <User className="h-4 w-4 text-primary" />
//               <div>
//                 <p className="text-sm font-medium">Total Contacts</p>
//                 <p className="text-2xl font-bold">{contacts.length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <Building className="h-4 w-4 text-green-600" />
//               <div>
//                 <p className="text-sm font-medium">Companies</p>
//                 <p className="text-2xl font-bold">
//                   {new Set(contacts.map((c) => c.company)).size}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <BookOpen className="h-4 w-4 text-purple-600" />
//               <div>
//                 <p className="text-sm font-medium">Total Documents</p>
//                 <p className="text-2xl font-bold">
//                   {contacts.reduce((sum, c) => sum + c.documentsCount, 0)}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </PageWrapper>
//   );
// };

// export default AddressBookPage;


import React from 'react'

const AddressBookPage = () => {
  return (
    <div>AddressBookPage</div>
  )
}

export default AddressBookPage