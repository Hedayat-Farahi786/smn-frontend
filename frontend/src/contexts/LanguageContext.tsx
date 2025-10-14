import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { setLanguage, getLanguage } from "../i18n";

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string; flagUrl: string }[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Static arrays defined outside component to prevent recreation
const rtlLanguages = ["ar", "dr", "ps"];

const availableLanguages = [
  { code: "en", name: "English", flag: "🇺🇸", flagUrl: "https://flagcdn.com/w20/us.png" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", flagUrl: "https://flagcdn.com/w20/de.png" },
  { code: "ro", name: "Română", flag: "🇷🇴", flagUrl: "https://flagcdn.com/w20/ro.png" },
  { code: "es", name: "Español", flag: "🇪🇸", flagUrl: "https://flagcdn.com/w20/es.png" },
  { code: "it", name: "Italiano", flag: "🇮🇹", flagUrl: "https://flagcdn.com/w20/it.png" },
  { code: "dr", name: "دری", flag: "🇦🇫", flagUrl: "https://flagcdn.com/w20/af.png" },
  { code: "ps", name: "پښتو", flag: "🇦🇫", flagUrl: "https://flagcdn.com/w20/af.png" },
  { code: "ar", name: "العربية", flag: "🇸🇦", flagUrl: "https://flagcdn.com/w20/sa.png" },
];

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getLanguage());

  const changeLanguage = useCallback((language: string) => {
    setLanguage(language);
    setCurrentLanguage(language); // Update immediately
  }, []);

  const isRTL = useMemo(() => rtlLanguages.includes(currentLanguage), [currentLanguage]);

  const value: LanguageContextType = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isRTL,
  }), [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
