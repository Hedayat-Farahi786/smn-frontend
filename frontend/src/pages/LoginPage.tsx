import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAppDispatch } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
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
  ChevronDown,
  Building2,
  FileText,
  Check,
  CircleCheckBig
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
  const dispatch = useAppDispatch();

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
          {/* Animated Background Elements - More Subtle */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl"
            animate={{
              x: [-20, 20, -20],
              y: [-20, 20, -20],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl"
            animate={{
              x: [20, -20, 20],
              y: [20, -20, 20],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 35, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/10 dark:bg-teal-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />

          {/* Vertical Divider Line */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent pointer-events-none z-20"></div>

          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center justify-center">
            {/* Hero Visual - Document Signing Illustration (from Landing Page) */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative mb-8"
            >
              <div className="relative w-full max-w-md mx-auto h-[450px] flex items-center justify-center">
                {/* Main Document - This is the parent for all floating badges */}
                <motion.div
                  className="relative w-72 lg:w-80 h-[380px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 overflow-visible"
                  animate={{
                    y: [-5, 5, -5],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                >
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-700 rounded mt-1"></div>
                      </div>
                    </div>
                    <Building2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  
                  {/* Document Lines */}
                  <div className="space-y-3 mb-8">
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-4/6"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-3/6"></div>
                  </div>

                  {/* Signature Area */}
                  <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8">
                    <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-4">
                      <motion.div
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                        className="mb-2"
                      >
                        <svg width="120" height="40" viewBox="0 0 120 40" className="text-brand-primary">
                          <motion.path
                            d="M 5 25 Q 15 15, 25 20 T 45 25 Q 55 30, 65 25 T 85 20 Q 95 15, 105 20"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                          />
                        </svg>
                      </motion.div>
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                        <span>Signature</span>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>

                                {/* Feature Indicators - Positioned relative to document card */}
                {/* Secure Badge - Top Center of Document */}
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-brand-primary/20 dark:border-brand-primary/30 z-50"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  <CircleCheckBig className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Signed</span>
                </motion.div>

                {/* Document Header */}
                </motion.div>
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
                AI Integrated
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
                    className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full mb-6 shadow-lg"
                  >
                    <Check className="h-8 w-8 text-white" />
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
                      <CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the link to sign in instantly
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Link expires in 15 minutes
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
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
                  
                  {/* Temporary Demo Button */}
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const result = await dispatch(loginUser({ 
                          email: 'demo@example.com', 
                          password: 'demo123' 
                        })).unwrap();
                        // Navigate only after successful login
                        navigate('/app/dashboard');
                      } catch (error) {
                        console.error('Demo login failed:', error);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Logging in...' : 'Demo Access (Temporary)'}
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
