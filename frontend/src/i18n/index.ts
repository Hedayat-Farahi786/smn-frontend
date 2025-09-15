// Simple i18n implementation without external dependencies

// English translations
const en = {
  translation: {
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      search: "Search",
      filter: "Filter",
      refresh: "Refresh",
      logout: "Logout",
      signOut: "Sign Out",
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      username: "Username",
      firstName: "First Name",
      lastName: "Last Name",
      confirmPassword: "Confirm Password",
      showPassword: "Show Password",
      hidePassword: "Hide Password",
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      library: "Library",
      inbox: "Inbox",
      outbox: "Outbox",
      archive: "Archive",
      pdfSignature: "PDF Signature",
      settings: "Settings",
      myProfile: "My Profile",
      messages: "Messages",
      usage: "Usage",
      invoices: "Invoices",
      addressBook: "Address Book",
      // Legacy navigation items
      documents: "Documents",
      templates: "Templates",
      analysis: "AI Analysis",
      chat: "Chat Assistant",
      analytics: "Analytics",
      users: "Users",
    },

    // Auth
    auth: {
      welcomeBack: "Welcome Back",
      signInToAccount: "Sign in to your account to continue",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      createAccount: "Create Account",
      signUpDescription:
        "Sign up for a new account to get started with AI-powered e-signatures",
      loginSuccess: "Logged in successfully!",
      registerSuccess: "Account created successfully!",
      loginFailed: "Login failed",
      registerFailed: "Registration failed",
      sessionExpiresIn: "Auto-logout:",
      continueWithGoogle: "Continue with Google",
      orContinueWith: "Or continue with",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome to SignMeNow",
      recentDocuments: "Recent Documents",
      quickActions: "Quick Actions",
      statistics: "Statistics",
    },

    // User Management
    users: {
      title: "Team Members",
      subtitle: "Manage team members and their signing permissions",
      addMember: "Add Team Member",
      noMembersFound: "No team members found",
      tryAdjustingSearch: "Try adjusting your search terms.",
      getStartedAdding: "Get started by adding a new team member.",
      searchPlaceholder: "Search by name, username, or email...",
      loadingMembers: "Loading team members...",
      userCreated: "User created successfully",
      userUpdated: "User updated successfully",
      userDeleted: "User deleted successfully",
      failedToCreate: "Failed to create user",
      failedToUpdate: "Failed to update user",
      failedToDelete: "Failed to delete user",
      deleteConfirm: "Are you sure you want to delete this user?",
    },

    // Documents
    documents: {
      title: "Documents",
      noDocuments: "No documents found",
      uploadDocument: "Upload Document",
      createDocument: "Create Document",
    },

    // Templates
    templates: {
      title: "Templates",
      noTemplates: "No templates found",
      createTemplate: "Create Template",
    },

    // Analysis
    analysis: {
      title: "AI Analysis",
      analyzeDocument: "Analyze Document",
    },

    // Chat
    chat: {
      title: "Chat Assistant",
      typeMessage: "Type your message...",
      send: "Send",
    },

    // Analytics
    analytics: {
      title: "Analytics",
      overview: "Overview",
      performance: "Performance",
    },

    // Settings
    settings: {
      title: "Settings",
      profile: "Profile",
      preferences: "Preferences",
      security: "Security",
      language: "Language",
    },
  },
};

// German translations
const de = {
  translation: {
    // Common
    common: {
      loading: "Lädt...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
      create: "Erstellen",
      update: "Aktualisieren",
      search: "Suchen",
      filter: "Filtern",
      refresh: "Aktualisieren",
      logout: "Abmelden",
      signOut: "Abmelden",
      signIn: "Anmelden",
      signUp: "Registrieren",
      email: "E-Mail",
      password: "Passwort",
      username: "Benutzername",
      firstName: "Vorname",
      lastName: "Nachname",
      confirmPassword: "Passwort bestätigen",
      showPassword: "Passwort anzeigen",
      hidePassword: "Passwort verbergen",
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      library: "Bibliothek",
      inbox: "Posteingang",
      outbox: "Postausgang",
      archive: "Archiv",
      pdfSignature: "PDF-Signatur",
      settings: "Einstellungen",
      myProfile: "Mein Profil",
      messages: "Nachrichten",
      usage: "Nutzung",
      invoices: "Rechnungen",
      addressBook: "Adressbuch",
      // Legacy navigation items
      documents: "Dokumente",
      templates: "Vorlagen",
      analysis: "KI-Analyse",
      chat: "Chat-Assistent",
      analytics: "Analytik",
      users: "Benutzer",
    },

    // Auth
    auth: {
      welcomeBack: "Willkommen zurück",
      signInToAccount: "Melden Sie sich in Ihrem Konto an, um fortzufahren",
      dontHaveAccount: "Haben Sie noch kein Konto?",
      alreadyHaveAccount: "Haben Sie bereits ein Konto?",
      createAccount: "Konto erstellen",
      signUpDescription:
        "Registrieren Sie sich für ein neues Konto, um mit KI-gestützten E-Signaturen zu beginnen",
      loginSuccess: "Erfolgreich angemeldet!",
      registerSuccess: "Konto erfolgreich erstellt!",
      loginFailed: "Anmeldung fehlgeschlagen",
      registerFailed: "Registrierung fehlgeschlagen",
      sessionExpiresIn: "Auto-Abmeldung:",
      continueWithGoogle: "Mit Google fortfahren",
      orContinueWith: "Oder fortfahren mit",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Willkommen bei SignMeNow",
      recentDocuments: "Aktuelle Dokumente",
      quickActions: "Schnellaktionen",
      statistics: "Statistiken",
    },

    // User Management
    users: {
      title: "Teammitglieder",
      subtitle: "Verwalten Sie Teammitglieder und ihre Signaturberechtigungen",
      addMember: "Teammitglied hinzufügen",
      noMembersFound: "Keine Teammitglieder gefunden",
      tryAdjustingSearch: "Versuchen Sie, Ihre Suchbegriffe anzupassen.",
      getStartedAdding:
        "Beginnen Sie mit dem Hinzufügen eines neuen Teammitglieds.",
      searchPlaceholder: "Nach Name, Benutzername oder E-Mail suchen...",
      loadingMembers: "Lade Teammitglieder...",
      userCreated: "Benutzer erfolgreich erstellt",
      userUpdated: "Benutzer erfolgreich aktualisiert",
      userDeleted: "Benutzer erfolgreich gelöscht",
      failedToCreate: "Benutzer konnte nicht erstellt werden",
      failedToUpdate: "Benutzer konnte nicht aktualisiert werden",
      failedToDelete: "Benutzer konnte nicht gelöscht werden",
      deleteConfirm:
        "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?",
    },

    // Documents
    documents: {
      title: "Dokumente",
      noDocuments: "Keine Dokumente gefunden",
      uploadDocument: "Dokument hochladen",
      createDocument: "Dokument erstellen",
    },

    // Templates
    templates: {
      title: "Vorlagen",
      noTemplates: "Keine Vorlagen gefunden",
      createTemplate: "Vorlage erstellen",
    },

    // Analysis
    analysis: {
      title: "KI-Analyse",
      analyzeDocument: "Dokument analysieren",
    },

    // Chat
    chat: {
      title: "Chat-Assistent",
      typeMessage: "Geben Sie Ihre Nachricht ein...",
      send: "Senden",
    },

    // Analytics
    analytics: {
      title: "Analytik",
      overview: "Übersicht",
      performance: "Leistung",
    },

    // Settings
    settings: {
      title: "Einstellungen",
      profile: "Profil",
      preferences: "Einstellungen",
      security: "Sicherheit",
      language: "Sprache",
    },
  },
};

// Simple translation function
const translations = { en, de };

let currentLanguage = "en";
let languageChangeListeners: (() => void)[] = [];

export const setLanguage = (lang: string) => {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  // Notify all listeners
  languageChangeListeners.forEach((listener) => listener());
};

export const getLanguage = () => {
  const saved = localStorage.getItem("language");
  if (saved && translations[saved as keyof typeof translations]) {
    currentLanguage = saved;
  }
  return currentLanguage;
};

export const addLanguageChangeListener = (listener: () => void) => {
  languageChangeListeners.push(listener);
  return () => {
    languageChangeListeners = languageChangeListeners.filter(
      (l) => l !== listener
    );
  };
};

export const t = (key: string): string => {
  const keys = key.split(".");
  let value: any =
    translations[currentLanguage as keyof typeof translations].translation;

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

// Initialize language
getLanguage();
