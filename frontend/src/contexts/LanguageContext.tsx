import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setLanguage, getLanguage } from "../i18n";

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string; flagUrl: string }[];
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

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getLanguage());

  const availableLanguages = [
    { code: "en", name: "English", flag: "🇺🇸", flagUrl: "https://flagcdn.com/w20/us.png" },
    { code: "de", name: "Deutsch", flag: "🇩🇪", flagUrl: "https://flagcdn.com/w20/de.png" },
  ];

  const changeLanguage = (language: string) => {
    setLanguage(language);
    setCurrentLanguage(language);
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
