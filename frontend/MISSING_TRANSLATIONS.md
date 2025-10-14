# Missing Translations for German and Romanian

## Common UI Elements (Add to `common` section)
```
theme: {
  light: "Light" / "Hell" / "Lumină",
  dark: "Dark" / "Dunkel" / "Întuneric",
  system: "System" / "System" / "Sistem",
  toggleTheme: "Toggle theme" / "Thema wechseln" / "Comută tema"
},
```

## Landing Nav (Add to `landing.nav`)
```
howItWorks: "How It Works" / "Wie es funktioniert" / "Cum Funcționează",
contact: "Contact" / "Kontakt" / "Contact"
```

## Landing Actions (Add new section `landing.actions`)
```
actions: {
  getStarted: "Get Started" / "Loslegen" / "Începe",
  choose: "Choose" / "Wählen" / "Alege",
  mostPopular: "MOST POPULAR" / "BELIEBTESTE" / "CEL MAI POPULAR"
},
```

## Landing Billing (Add to `landing.pricing`)
```
billedAnnually: "Billed annually" / "Jährlich abgerechnet" / "Facturat anual",
billedMonthly: "Billed monthly" / "Monatlich abgerechnet" / "Facturat lunar",
perMonth: "/month" / "/Monat" / "/lună",
perYear: "/year" / "/Jahr" / "/an",
month: "month" / "Monat" / "lună"
```

## Landing Features (Feature cards - Add new section `landing.features`)
```
features: {
  aiIntelligence: {
    title: "AI Intelligence" / "KI-Intelligenz" / "Inteligență AI",
    description: "Chat with documents and get instant answers" / "Chatten Sie mit Dokumenten und erhalten Sie sofortige Antworten" / "Conversează cu documentele și obține răspunsuri instant",
    stats: "10x Faster" / "10x Schneller" / "De 10x mai rapid"
  },
  lightningFast: {
    title: "Lightning Fast" / "Blitzschnell" / "Ultra Rapid",
    description: "Sign and send in seconds" / "In Sekunden unterschreiben und senden" / "Semnează și trimite în secunde",
    stats: "30 Seconds" / "30 Sekunden" / "30 Secunde"
  },
  secure: {
    title: "Secure" / "Sicher" / "Securizat",
    description: "Bank-grade encryption protection" / "Bankklasse Verschlüsselung" / "Protecție cu criptare bancară",
    stats: "256-bit" / "256-bit" / "256-biți"
  },
  smartChat: {
    title: "Smart Chat" / "Intelligenter Chat" / "Chat Inteligent",
    description: "Ask questions, get accurate answers" / "Stellen Sie Fragen, erhalten Sie präzise Antworten" / "Pune întrebări, primește răspunsuri precise",
    stats: "Unlimited" / "Unbegrenzt" / "Nelimitat"
  },
  analytics: {
    title: "Analytics" / "Analytik" / "Analiză",
    description: "Real-time tracking and insights" / "Echtzeit-Tracking und Einblicke" / "Urmărire și informații în timp real",
    stats: "Live Data" / "Live-Daten" / "Date în Timp Real"
  },
  timeSaver: {
    title: "Time Saver" / "Zeitsparer" / "Economisitor de Timp",
    description: "Automate and streamline workflows" / "Automatisieren und optimieren Sie Workflows" / "Automatizează și simplifică fluxurile de lucru",
    stats: "90% Faster" / "90% Schneller" / "Cu 90% mai rapid"
  }
}
```

## Landing Contact Form Labels (Already exists in contact.form but need to verify)
- First Name / Vorname / Prenume
- Last Name / Nachname / Nume
- Email Address / E-Mail-Adresse / Adresă Email
- Phone Number (Optional) / Telefonnummer (Optional) / Număr de Telefon (Opțional)
- Message / Nachricht / Mesaj
- Send Message / Nachricht senden / Trimite Mesaj

## Landing Contact Info (Add to `landing.contact`)
```
phoneLabel: "Phone" / "Telefon" / "Telefon",
officeLabel: "Office" / "Büro" / "Birou",
availabilityText: "Available Monday - Friday, 9:00 AM - 6:00 PM CET" / "Erreichbar Montag - Freitag, 9:00 - 18:00 Uhr MEZ" / "Disponibil Luni - Vineri, 9:00 - 18:00 CET"
```

## Landing Footer (Already mostly exists, verify all keys)
- Product / Produkt / Produs
- Company / Unternehmen / Companie
- Resources / Ressourcen / Resurse
- About Us / Über uns / Despre Noi
- E-Signature / E-Signatur / Semnătură Electronică
- AI Chat / KI-Chat / Chat AI

## Landing Pricing Plan Details (Add to respective plan sections)
```
standardPlan: {
  everythingInBasic: "Everything in Basic, plus:" / "Alles in Basic, plus:" / "Tot din Basic, plus:",
  unlimitedDocuments: "Unlimited documents" / "Unbegrenzte Dokumente" / "Documente nelimitate",
  signersPerDoc: "Up to 5 signers per document" / "Bis zu 5 Unterzeichner pro Dokument" / "Până la 5 semnatari per document",
  documentTemplates: "Document templates" / "Dokumentvorlagen" / "Șabloane de documente",
  aiDocumentChat: "AI document chat" / "KI-Dokumenten-Chat" / "Chat AI pentru documente",
  documentArchive: "Document archive" / "Dokumentarchiv" / "Arhivă documente",
  prioritySupport: "Priority support" / "Prioritäts-Support" / "Asistență prioritară",
  auditTrail: "Audit trail & tracking" / "Prüfpfad & Tracking" / "Pistă de audit și urmărire"
},
professionalPlan: {
  everythingInStandard: "Everything in Standard, plus:" / "Alles in Standard, plus:" / "Tot din Standard, plus:",
  unlimitedSigners: "Unlimited signers" / "Unbegrenzte Unterzeichner" / "Semnatari nelimitați",
  advancedTemplates: "Advanced templates" / "Erweiterte Vorlagen" / "Șabloane avansate",
  apiAccess: "API access" / "API-Zugang" / "Acces API",
  customBranding: "Custom branding" / "Benutzerdefiniertes Branding" / "Brand personalizat",
  dedicatedSupport: "Dedicated support" / "Dedizierter Support" / "Asistență dedicată",
  sla: "99.9% SLA uptime" / "99,9% SLA Betriebszeit" / "99,9% SLA uptime"
}
```

## Hardcoded Form Placeholders (Update in component)
- "John" → {t('landing.contact.form.firstNamePlaceholder')}
- "Doe" → {t('landing.contact.form.lastNamePlaceholder')}
- "john@example.com" → {t('landing.contact.form.emailPlaceholder')}
- "+49 89 1234 5678" → {t('landing.contact.form.phonePlaceholder')}
- "Tell us about your project or inquiry..." → {t('landing.contact.form.messagePlaceholder')}

## Other Hardcoded Text in LandingPage.tsx
- "Light" / "Dark" / "System" in theme dropdown
- "Toggle theme" (sr-only)
- "Choose Plan" / "Get Started" buttons
- "MOST POPULAR" badge
- "Basic support" / "Standard support" / "Premium support"
- "$8", "$10", "$16", "$20" pricing (can remain as is, just currency format)
- "Billed annually ($96/year)" / "Billed monthly"
- Contact form field labels
- Footer column headers
- Office address "Maximilianstraße 13, 80539 München, Germany"
- Social media icon labels
