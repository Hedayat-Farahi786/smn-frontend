// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   User,
//   Bell,
//   Shield,
//   Palette,
//   Globe,
//   Key,
//   Database,
//   Download,
//   Upload,
//   Trash2,
//   Save,
//   Eye,
//   EyeOff,
//   Settings,
// } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";

// const SettingsPage: React.FC = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [showPassword, setShowPassword] = useState(false);

//   const tabs = [
//     { id: "profile", label: "Profile", icon: User },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "security", label: "Security", icon: Shield },
//     { id: "appearance", label: "Appearance", icon: Palette },
//     { id: "integrations", label: "Integrations", icon: Globe },
//     { id: "data", label: "Data & Privacy", icon: Database },
//   ];

//   return (
//     <PageWrapper
//       title="Settings"
//       description="Manage your account settings and preferences"
//       icon={Settings}
//     >

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Settings Navigation */}
//         <Card>
//           <CardContent className="p-6">
//             <nav className="space-y-2">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                     activeTab === tab.id
//                       ? "bg-primary text-primary-foreground"
//                       : "hover:bg-muted"
//                   }`}
//                 >
//                   <tab.icon className="h-4 w-4" />
//                   <span className="text-sm font-medium">{tab.label}</span>
//                 </button>
//               ))}
//             </nav>
//           </CardContent>
//         </Card>

//         {/* Settings Content */}
//         <div className="lg:col-span-3">
//           {activeTab === "profile" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
//                 <div className="space-y-6">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
//                       <User className="h-8 w-8 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <Button variant="outline" size="sm">
//                         <Upload className="h-4 w-4 mr-2" />
//                         Change Photo
//                       </Button>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         JPG, PNG or GIF. Max size 2MB.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium">First Name</label>
//                       <input
//                         type="text"
//                         defaultValue={user?.firstName || ""}
//                         className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium">Last Name</label>
//                       <input
//                         type="text"
//                         defaultValue={user?.lastName || ""}
//                         className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Email</label>
//                     <input
//                       type="email"
//                       defaultValue={user?.email || ""}
//                       className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Bio</label>
//                     <textarea
//                       rows={3}
//                       placeholder="Tell us about yourself..."
//                       className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                     />
//                   </div>

//                   <Button>
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "notifications" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">
//                   Notification Settings
//                 </h2>
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-medium">Email Notifications</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Receive email updates about document status
//                         </p>
//                       </div>
//                       <input
//                         type="checkbox"
//                         defaultChecked
//                         className="rounded"
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-medium">Push Notifications</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Get notified when documents need your attention
//                         </p>
//                       </div>
//                       <input
//                         type="checkbox"
//                         defaultChecked
//                         className="rounded"
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-medium">SMS Notifications</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Receive text messages for urgent documents
//                         </p>
//                       </div>
//                       <input type="checkbox" className="rounded" />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "security" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">
//                   Security Settings
//                 </h2>
//                 <div className="space-y-6">
//                   <div>
//                     <label className="text-sm font-medium">
//                       Current Password
//                     </label>
//                     <div className="relative mt-1">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         className="w-full p-2 pr-10 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4 text-muted-foreground" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">New Password</label>
//                     <input
//                       type="password"
//                       className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">
//                       Confirm New Password
//                     </label>
//                     <input
//                       type="password"
//                       className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <h3 className="font-medium">Two-Factor Authentication</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Add an extra layer of security to your account
//                       </p>
//                     </div>
//                     <Button variant="outline">Enable</Button>
//                   </div>

//                   <Button>
//                     <Key className="h-4 w-4 mr-2" />
//                     Update Password
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "appearance" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">
//                   Appearance Settings
//                 </h2>
//                 <div className="space-y-6">
//                   <div>
//                     <label className="text-sm font-medium">Theme</label>
//                     <div className="mt-2 space-y-2">
//                       <label className="flex items-center space-x-2">
//                         <input
//                           type="radio"
//                           name="theme"
//                           value="light"
//                           defaultChecked
//                         />
//                         <span>Light</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input type="radio" name="theme" value="dark" />
//                         <span>Dark</span>
//                       </label>
//                       <label className="flex items-center space-x-2">
//                         <input type="radio" name="theme" value="system" />
//                         <span>System</span>
//                       </label>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Language</label>
//                     <select className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
//                       <option value="en">English</option>
//                       <option value="es">Spanish</option>
//                       <option value="fr">French</option>
//                       <option value="de">German</option>
//                     </select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "integrations" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">Integrations</h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Globe className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium">Google Drive</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Connect your Google Drive
//                         </p>
//                       </div>
//                     </div>
//                     <Button variant="outline">Connect</Button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Globe className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium">Dropbox</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Connect your Dropbox
//                         </p>
//                       </div>
//                     </div>
//                     <Button variant="outline">Connect</Button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Globe className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium">OneDrive</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Connect your OneDrive
//                         </p>
//                       </div>
//                     </div>
//                     <Button variant="outline">Connect</Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {activeTab === "data" && (
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-semibold mb-6">Data & Privacy</h2>
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <h3 className="font-medium">Export Data</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Download a copy of your data
//                       </p>
//                     </div>
//                     <Button variant="outline">
//                       <Download className="h-4 w-4 mr-2" />
//                       Export
//                     </Button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <h3 className="font-medium">Delete Account</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Permanently delete your account and all data
//                       </p>
//                     </div>
//                     <Button variant="destructive">
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </PageWrapper>
//   );
// };

// export default SettingsPage;

import React from 'react'

const SettingsPage = () => {
  return (
    <div>SettingsPage</div>
  )
}

export default SettingsPage