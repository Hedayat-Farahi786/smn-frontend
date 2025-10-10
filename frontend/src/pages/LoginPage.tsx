import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Moon,
  Sun,
  Monitor,
  Globe,
  FileSignature,
  Shield,
  Zap,
  Lock,
  Users,
  TrendingUp,
  Award,
  ChevronDown
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages, isRTL } = useLanguage();
  const { theme, setTheme, actualTheme } = useTheme();

  const currentLang = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Floating Navbar - Same as Landing Page */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-30 transition-all duration-300",
        isScrolled ? "top-4 w-[90%] max-w-8xl" : "top-6 w-[90%] max-w-8xl"
      )}>
        <nav className={cn(
          "flex justify-between items-center px-4 md:px-6 py-3 md:py-4 transition-all duration-300 backdrop-blur-xl rounded-full border border-white/30 dark:border-gray-700/30 shadow-sm",
          isScrolled 
            ? "bg-white/60 dark:bg-gray-900/60" 
            : "bg-white/50 dark:bg-gray-900/50"
        )}>
          <button 
            onClick={() => navigate('/')}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            {t('common.signMeNow')}
          </button>
          
          <div className={cn(
            "flex items-center",
            isRTL ? "gap-2 flex-row-reverse" : "gap-2"
          )}>
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {theme === "light" && <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
                  {theme === "dark" && <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
                  {theme === "system" && <Monitor className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <img 
                    src={currentLang?.flagUrl} 
                    alt={`${currentLang?.name} ${t('common.flag')}`}
                    className={cn(
                      "h-4 w-6 object-cover rounded-sm",
                      isRTL ? "ml-2" : "mr-2"
                    )}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentLang?.name}
                  </span>
                  <ChevronDown className={cn(
                    "h-3 w-3 text-gray-500",
                    isRTL ? "mr-1" : "ml-1"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "cursor-pointer flex items-center gap-2",
                      currentLanguage === lang.code && "bg-accent"
                    )}
                  >
                    <img 
                      src={lang.flagUrl} 
                      alt={`${lang.name} ${t('common.flag')}`}
                      className="h-4 w-6 object-cover rounded-sm"
                    />
                    <span>{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <span className="ml-auto text-brand-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Main Content - Split Screen */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Enhanced Visual/Brand Section */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-teal-50/50 dark:from-brand-primary/10 dark:via-brand-accent/10 dark:to-gray-800 relative overflow-hidden p-12">
          {/* Animated Background Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl"
            animate={{
              x: [-30, 30, -30],
              y: [-30, 30, -30],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl"
            animate={{
              x: [30, -30, 30],
              y: [30, -30, 30],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Vertical Divider Line */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent pointer-events-none z-20"></div>

          <div className="relative z-10 max-w-lg">
            {/* Enhanced Multi-Feature Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Main Document Card - Enhanced with AI & Signature */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-brand-primary/5 to-transparent dark:from-brand-primary/10"></div>
                  
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center shadow-md">
                        <FileSignature className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1.5"></div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded w-16"></div>
                      </div>
                    </div>
                    {/* AI Badge */}
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 px-2.5 py-1 rounded-full border border-brand-primary/20"
                    >
                      <Sparkles className="w-3 h-3 text-brand-primary" />
                      <span className="text-[10px] font-semibold text-brand-primary">AI</span>
                    </motion.div>
                  </div>
                  
                  {/* Document Lines with AI Analysis Effect */}
                  <div className="space-y-2 mb-5 relative z-10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: [-100, 400] }}
                        transition={{ delay: 1.5, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "83%" }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                      className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded"
                    ></motion.div>
                  </div>
                  
                  {/* Signature Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl p-4 mb-4 relative z-10 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Signature Required</span>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1"
                      >
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-semibold text-brand-primary">Signing...</span>
                      </motion.div>
                    </div>
                    {/* Signature Animation - Only Curved Lines */}
                    <motion.div className="relative h-14 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="xMidYMid meet">
                        <motion.path
                          d="M20,30 Q35,15 50,30 Q65,45 80,30 Q95,15 110,30 Q125,42 145,30 Q165,18 185,30 Q205,42 225,30 Q245,18 265,35 Q275,42 280,38"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-brand-primary drop-shadow-sm"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Collaboration Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    className="flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-xl p-3 relative z-10"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Collaborators</span>
                    </div>
                    <div className="flex -space-x-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.2, type: "spring" }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md"
                      >
                        <span className="text-[9px] font-bold text-white">JD</span>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.4, type: "spring" }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-accent to-teal-500 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md"
                      >
                        <span className="text-[9px] font-bold text-white">SM</span>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.6, type: "spring" }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-brand-primary border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md"
                      >
                        <span className="text-[9px] font-bold text-white">AK</span>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.8, type: "spring" }}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md"
                      >
                        <span className="text-[8px] font-bold text-white">+5</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Success Badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 3.5, duration: 0.5, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 rounded-xl py-2.5 px-4 mt-4 relative z-10 border border-brand-primary/30 dark:border-brand-primary/40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    <span className="text-xs font-semibold text-brand-primary">Ready to Share</span>
                  </motion.div>
                </motion.div>

                {/* Floating Feature Badges - Outside Container */}
                {/* <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -left-32 top-1/3 z-50"
                >
                  <motion.div
                    animate={{ 
                      y: [-5, 5, -5],
                      rotate: [-2, 2, -2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl px-3 py-2.5 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">Secure</div>
                        <div className="text-[8px] text-gray-500 dark:text-gray-400">256-bit encrypted</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div> */}

                {/* <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -right-32 bottom-1/3 z-50"
                >
                  <motion.div
                    animate={{ 
                      y: [5, -5, 5],
                      rotate: [2, -2, 2]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl px-3 py-2.5 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-brand-accent to-teal-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">Lightning Fast</div>
                        <div className="text-[8px] text-gray-500 dark:text-gray-400">Sign in 2 seconds</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div> */}
              </div>
            </motion.div>

            {/* Enhanced Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
                AI-Powered
                <br />
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  Document Signing
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                Sign, analyze, and collaborate on documents with intelligent automation
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {!isSubmitted ? (
              // Login Form
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {t('auth.welcomeBack')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your email to receive a secure login link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-lg font-semibold text-base hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue with Email</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    alert("Google login coming soon!");
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300 mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-brand-primary" />
                    </div>
                    <span>No password to remember</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-brand-primary" />
                    </div>
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-brand-primary" />
                    </div>
                    <span>One-click access</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-brand-primary hover:text-brand-accent font-semibold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Success State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6 shadow-lg"
                  >
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    Check your email
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We sent a login link to
                  </p>
                  <p className="text-lg font-semibold text-brand-primary mt-2 break-all">
                    {email}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the link to sign in instantly
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Link expires in 15 minutes
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Check spam if needed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold transition-all disabled:opacity-50 hover:shadow-lg"
                  >
                    Resend email
                  </button>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
