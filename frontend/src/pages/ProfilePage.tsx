// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
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
//   User,
//   CreditCard,
//   Shield,
//   Edit,
//   Save,
//   X,
//   Camera,
//   Globe,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";

// const ProfilePage: React.FC = () => {
//   const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     title: user?.title || "",
//     address: user?.address || "",
//     address2: user?.address2 || "",
//     city: user?.city || "",
//     country: user?.country || "",
//     zipcode: user?.zipcode || "",
//     company: user?.company || "",
//     vatNumber: user?.vatNumber || "",
//     isCompany: user?.isCompany || false,
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSave = () => {
//     // TODO: Implement profile update API call
//     console.log("Saving profile:", formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: user?.firstName || "",
//       lastName: user?.lastName || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//       title: user?.title || "",
//       address: user?.address || "",
//       address2: user?.address2 || "",
//       city: user?.city || "",
//       country: user?.country || "",
//       zipcode: user?.zipcode || "",
//       company: user?.company || "",
//       vatNumber: user?.vatNumber || "",
//       isCompany: user?.isCompany || false,
//     });
//     setIsEditing(false);
//   };

//   return (
//     <PageWrapper
//       title="My Profile"
//       description="Manage your personal information and account settings"
//       icon={User}
//       actions={
//         !isEditing ? (
//           <Button 
//             onClick={() => setIsEditing(true)}
//             className="bg-primary hover:bg-primary/90 text-white shadow-lg"
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Edit Profile
//           </Button>
//         ) : (
//           <div className="flex gap-3">
//             <Button 
//               variant="outline" 
//               onClick={handleCancel}
//               className="border-blue-200 hover:bg-blue-50 shadow-sm"
//             >
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSave}
//               className="bg-primary hover:bg-primary/90 text-white shadow-lg"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Save Changes
//             </Button>
//           </div>
//         )
//       }
//     >

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Profile Overview */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
//               <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile Overview</h2>
              
//               <div className="space-y-6">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
//                       {user?.profilePicture ? (
//                         <img
//                           src={user.profilePicture}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <User className="h-12 w-12 text-primary" />
//                       )}
//                     </div>
//                     {isEditing && (
//                       <Button
//                         size="sm"
//                         className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90 text-white"
//                       >
//                         <Camera className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>

//                   <div className="text-center">
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {user?.firstName} {user?.lastName}
//                     </h3>
//                     <p className="text-sm text-slate-600">{user?.email}</p>
//                     {user?.title && (
//                       <p className="text-sm text-slate-600">{user.title}</p>
//                     )}
//                     {user?.company && (
//                       <p className="text-sm text-slate-600">{user.company}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3 text-sm">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Shield className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-slate-900">Account Status</p>
//                       <p className="text-slate-600">Active</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 text-sm">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <CreditCard className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-slate-900">Plan</p>
//                       <p className="text-slate-600">Professional</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 text-sm">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Globe className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-slate-900">Member since</p>
//                       <p className="text-slate-600">Jan 2024</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Profile Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Personal Information */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
//               <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
              
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
//                       First Name
//                     </Label>
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
//                       Last Name
//                     </Label>
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium text-slate-700">
//                       Email Address
//                     </Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
//                       Phone Number
//                     </Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="title" className="text-sm font-medium text-slate-700">
//                     Title/Position
//                   </Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     placeholder="e.g., CEO, Manager, etc."
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Information */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
//               <h2 className="text-xl font-semibold text-slate-900 mb-6">Address Information</h2>
              
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="address" className="text-sm font-medium text-slate-700">
//                     Address Line 1
//                   </Label>
//                   <Input
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="address2" className="text-sm font-medium text-slate-700">
//                     Address Line 2
//                   </Label>
//                   <Input
//                     id="address2"
//                     name="address2"
//                     value={formData.address2}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="city" className="text-sm font-medium text-slate-700">
//                       City
//                     </Label>
//                     <Input
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="country" className="text-sm font-medium text-slate-700">
//                       Country
//                     </Label>
//                     <Input
//                       id="country"
//                       name="country"
//                       value={formData.country}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="zipcode" className="text-sm font-medium text-slate-700">
//                       ZIP Code
//                     </Label>
//                     <Input
//                       id="zipcode"
//                       name="zipcode"
//                       value={formData.zipcode}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Company Information */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
//               <h2 className="text-xl font-semibold text-slate-900 mb-6">Company Information</h2>
              
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="checkbox"
//                     id="isCompany"
//                     name="isCompany"
//                     checked={formData.isCompany}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-blue-500"
//                   />
//                   <Label htmlFor="isCompany" className="text-sm font-medium text-slate-700">
//                     This is a company account
//                   </Label>
//                 </div>

//                 {formData.isCompany && (
//                   <div className="space-y-4 pl-7">
//                     <div className="space-y-2">
//                       <Label htmlFor="company" className="text-sm font-medium text-slate-700">
//                         Company Name
//                       </Label>
//                       <Input
//                         id="company"
//                         name="company"
//                         value={formData.company}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                         className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="vatNumber" className="text-sm font-medium text-slate-700">
//                         VAT Number
//                       </Label>
//                       <Input
//                         id="vatNumber"
//                         name="vatNumber"
//                         value={formData.vatNumber}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                         className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//     </PageWrapper>
//   );
// };

// export default ProfilePage;


import React from 'react'

const ProfilePage = () => {
  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage