import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./i18n";
import { Toaster } from "./components/ui/toaster";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import DocumentsPage from "./pages/DocumentsPage";
import TemplatesPage from "./pages/TemplatesPage";
import AnalysisPage from "./pages/AnalysisPage";
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import PDFSignaturePage from "./pages/PDFSignaturePage";
import LibraryPage from "./pages/LibraryPage";
import InboxPage from "./pages/InboxPage";
import OutboxPage from "./pages/OutboxPage";
import ArchivePage from "./pages/ArchivePage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import UsagePage from "./pages/UsagePage";
import InvoicesPage from "./pages/InvoicesPage";
import AddressBookPage from "./pages/AddressBookPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/app/dashboard" replace />}
                    />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="inbox" element={<InboxPage />} />
                    <Route path="outbox" element={<OutboxPage />} />
                    <Route path="archive" element={<ArchivePage />} />
                    <Route
                      path="pdf-signature"
                      element={<PDFSignaturePage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="usage" element={<UsagePage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="addressbook" element={<AddressBookPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    {/* Legacy routes for backward compatibility */}
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="templates" element={<TemplatesPage />} />
                    <Route path="analysis" element={<AnalysisPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                  </Route>
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
