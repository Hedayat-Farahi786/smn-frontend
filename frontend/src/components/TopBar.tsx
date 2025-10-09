import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  Calendar,
  Clock,
} from "lucide-react";

const TopBar: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useTranslation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(currentLanguage, options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString(currentLanguage, options);
  };

  const currentLang = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  return (
    <div className="h-16 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Date and Time */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-primary">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{formatDate(currentTime)}</span>
          </div>
          {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">
              {formatTime(currentTime)}
            </span>
          </div> */}
        </div>

        {/* Right side - Theme and Language selectors */}
        <div className="flex items-center space-x-3">
          {/* Theme Switcher */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-primary dark:text-blue-400 hover:text-primary dark:hover:text-blue-300"
              >
                {actualTheme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-blue-100">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="flex items-center space-x-2 hover:bg-blue-50"
              >
                <Sun className="h-4 w-4 text-blue-600" />
                <span>Light</span>
                {theme === "light" && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex items-center space-x-2 hover:bg-blue-50"
              >
                <Moon className="h-4 w-4 text-blue-600" />
                <span>Dark</span>
                {theme === "dark" && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex items-center space-x-2 hover:bg-blue-50"
              >
                <Monitor className="h-4 w-4 text-blue-600" />
                <span>System</span>
                {theme === "system" && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 hover:bg-accent"
              >
                <img 
                  src={currentLang?.flagUrl} 
                  alt={`${currentLang?.name} flag`}
                  className="h-4 w-6 mr-2 object-cover rounded-sm"
                />
                <span className="text-sm font-medium">
                  {currentLang?.name}
                </span>
                <ChevronDown className="h-3 w-3 ml-1 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="flex items-center space-x-2 hover:bg-accent"
                >
                  <img 
                    src={lang.flagUrl} 
                    alt={`${lang.name} flag`}
                    className="h-4 w-6 object-cover rounded-sm"
                  />
                  <span>{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
