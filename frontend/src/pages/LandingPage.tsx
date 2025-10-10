import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Users, FileText, Star, Sparkles, Brain, Lock, MessageSquare, BarChart, Clock, Building2, ChevronDown, Mail, Phone, MapPin, Send, Sun, Moon, Monitor, CircleCheckBig } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages, isRTL } = useLanguage();
  const { theme, setTheme, actualTheme } = useTheme();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'professional'>('standard');
  
  const currentLang = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  );
  
  const words = [
    t('landing.hero.sign'),
    t('landing.hero.analyze'),
    t('landing.hero.chatWith'),
    t('landing.hero.share'),
    t('landing.hero.track'),
    t('landing.hero.manage'),
  ];

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

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const shouldDelete = isDeleting;

    const timeout = setTimeout(() => {
      if (!shouldDelete) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
        }
      }
    }, shouldDelete ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex, words]);

  const featureSections = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI Intelligence',
      description: 'Chat with documents and get instant answers',
      stats: '10x Faster',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Sign and send in seconds',
      stats: '30 Seconds',
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'Secure',
      description: 'Bank-grade encryption protection',
      stats: '256-bit',
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Smart Chat',
      description: 'Ask questions, get accurate answers',
      stats: 'Unlimited',
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Analytics',
      description: 'Real-time tracking and insights',
      stats: 'Live Data',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Time Saver',
      description: 'Automate and streamline workflows',
      stats: '90% Faster',
    },
  ];

  const testimonials = [
    {
      quote: t('landing.testimonials.quote1'),
      author: t('landing.testimonials.author1'),
      title: t('landing.testimonials.title1'),
    },
    {
      quote: t('landing.testimonials.quote2'),
      author: t('landing.testimonials.author2'),
      title: t('landing.testimonials.title2'),
    },
    {
      quote: t('landing.testimonials.quote3'),
      author: t('landing.testimonials.author3'),
      title: t('landing.testimonials.title3'),
    }
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-brand-background text-brand-text" dir={isRTL ? "rtl" : "ltr"}>
      {/* Floating Navbar */}
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            {t('landing.nav.signMeNow')}
          </button>
          <div className={cn(
            "hidden md:flex items-center",
            isRTL ? "space-x-reverse space-x-4" : "space-x-4"
          )}>
            <button onClick={() => scrollToSection('features')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors font-medium">{t('landing.nav.features')}</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors font-medium">How It Works</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors font-medium">{t('landing.nav.testimonials')}</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors font-medium">{t('landing.nav.pricing')}</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors font-medium">Contact</button>
          </div>
          <div className={cn(
            "flex items-center",
            isRTL ? "gap-2 flex-row-reverse" : "gap-2"
          )}>
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {actualTheme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                  {theme === "light" && (
                    <span className="ml-auto text-brand-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                  {theme === "dark" && (
                    <span className="ml-auto text-brand-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                  {theme === "system" && (
                    <span className="ml-auto text-brand-primary">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector - Matching TopBar Style */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <img 
                    src={currentLang?.flagUrl} 
                    alt={`${currentLang?.name} ${t('common.flag')}`}
                    className="mr-2 h-4 w-6 object-cover rounded-sm"
                  />
                  <span className="text-sm font-medium">
                    {currentLang?.name}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1 text-brand-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
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
            
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {t('landing.nav.getStarted')}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-background to-teal-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="absolute inset-0 z-0">
            {/* Subtle background shapes */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200 dark:bg-teal-900/30 rounded-full opacity-20 blur-2xl"
                animate={{
                    x: [-20, 20, -20],
                    y: [-20, 20, -20],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-20 blur-2xl"
                animate={{
                    x: [20, -20, 20],
                    y: [20, -20, 20],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
        </div>
        
        {/* Smooth gradient transition to white at bottom - Enhanced */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900 z-[1]"></div>
        <div className="text-center z-10 p-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-brand-primary inline-block min-w-[200px] md:min-w-[280px]">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">{t('landing.hero.documentsSmarter')}</span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">{t('landing.hero.with')}</span>{' '}
            <span className="text-brand-primary">{t('landing.hero.aiPower')}</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed"
          >
            {t('landing.hero.description')}
          </motion.p>
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => navigate('/login')}
            className="bg-brand-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-brand-accent transition-transform transform hover:scale-105 shadow-lg"
          >
            {t('landing.hero.getStartedFree')} <ArrowRight className="inline ml-2 w-5 h-5" />
          </motion.button>
          </div>
          
          {/* Hero Visual - Document Signing Illustration */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full max-w-md mx-auto h-[450px] flex items-start pt-8">
              {/* Main Document - This is the parent for all floating badges */}
              <motion.div
                className="relative top-8 left-1/2 -translate-x-1/2 w-72 lg:w-80 h-[380px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700"
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
                {/* AI Badge - Top Center of Document */}
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold">{t('landing.badges.aiPowered')}</span>
                </motion.div>

                {/* Subtle floating particles using brand colors only */}
                {/* Top Right particles */}
                <motion.div
                  className="absolute -top-6 -right-6 w-3 h-3 bg-brand-primary/40 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0 }}
                />
                <motion.div
                  className="absolute -top-2 -right-12 w-2 h-2 bg-brand-accent/30 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                />

                {/* Right side particle */}
                <motion.div
                  className="absolute top-1/3 -right-8 w-2.5 h-2.5 bg-brand-primary/30 rounded-full blur-sm"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />

                {/* Bottom Right particle */}
                <motion.div
                  className="absolute -bottom-4 -right-7 w-3 h-3 bg-brand-accent/40 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                />

                {/* Left side particle */}
                <motion.div
                  className="absolute top-1/4 -left-8 w-2 h-2 bg-brand-primary/30 rounded-full blur-sm"
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                />

                {/* Bottom Left particle */}
                <motion.div
                  className="absolute -bottom-5 -left-6 w-2.5 h-2.5 bg-brand-accent/30 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", delay: 1.2 }}
                />

                {/* Feature Badges - Only 2 */}
                {/* Security Badge - Left side */}
                <motion.div
                  className="absolute top-1/3 -left-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-primary/20 dark:border-brand-primary/30 flex items-center gap-2"
                  animate={{
                    x: [0, -8, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                >
                  <Shield className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('landing.badges.secure')}</span>
                </motion.div>

                {/* Instant Badge - Bottom Right */}
                <motion.div
                  className="absolute -bottom-4 -right-14 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-primary/20 dark:border-brand-primary/30 flex items-center gap-2"
                  animate={{
                    x: [0, 8, 0],
                    y: [0, 5, 0],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                >
                  <Zap className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('landing.badges.instant')}</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trusted By Section - Minimal Animated Logo Carousel */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">
              {t('landing.trusted.title')}
            </p>
          </motion.div>

          {/* Infinite Scrolling Logo Container */}
          <div className="relative max-w-6xl mx-auto overflow-hidden">
            {/* Gradient Overlays - Fixed z-index issue */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none z-10"></div>

            {/* Scrolling Logos Animation - Higher z-index to stay below gradient */}
            <div className="relative z-0">
              <motion.div
                className="flex items-center gap-12 md:gap-16 lg:gap-20 py-4"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  x: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {/* Duplicate the logos twice for seamless loop */}
                {[1, 2].map((set) => (
                  <React.Fragment key={set}>
                    {/* Oerlikon AM */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center min-w-[140px]">
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-300">
                          OERLIKON
                        </span>
                      </div>
                    </div>

                    {/* TUM */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center min-w-[80px]">
                        <span className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300">
                          TUM
                        </span>
                      </div>
                    </div>

                    {/* SAP */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center">
                        <div className="px-5 py-1.5 bg-gray-700 dark:bg-gray-600 rounded">
                          <span className="text-lg md:text-xl font-bold text-white tracking-wide">
                            SAP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mercedes-Benz */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center min-w-[60px]">
                        <svg viewBox="0 0 60 60" className="h-full w-auto">
                          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                          <path d="M30 5 L30 30 M30 30 L50 45 M30 30 L10 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="text-gray-700 dark:text-gray-300" />
                        </svg>
                      </div>
                    </div>

                    {/* BMW */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center min-w-[60px]">
                        <svg viewBox="0 0 60 60" className="h-full w-auto">
                          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                          <line x1="30" y1="2" x2="30" y2="58" stroke="currentColor" strokeWidth="1.5" className="text-gray-700 dark:text-gray-300" />
                          <line x1="2" y1="30" x2="58" y2="30" stroke="currentColor" strokeWidth="1.5" className="text-gray-700 dark:text-gray-300" />
                          <path d="M30 2 A28 28 0 0 1 58 30 L30 30 Z" className="fill-gray-200 dark:fill-gray-600" />
                          <path d="M30 58 A28 28 0 0 1 2 30 L30 30 Z" className="fill-gray-200 dark:fill-gray-600" />
                        </svg>
                      </div>
                    </div>

                    {/* Audi */}
                    <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                      <div className="h-8 md:h-10 flex items-center justify-center min-w-[100px]">
                        <svg viewBox="0 0 120 40" className="h-full w-auto">
                          <circle cx="15" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                          <circle cx="40" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                          <circle cx="65" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                          <circle cx="90" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-700 dark:text-gray-300" />
                        </svg>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Why You'll Love SignMeNow */}
      <section id="features" className="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Decorative Shapes - Enhanced for Dark Mode */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated ambient orbs - similar to hero */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-primary/3 dark:bg-brand-primary/8 rounded-full blur-3xl"></div>
          
          {/* Subtle floating shapes */}
          <div className="absolute top-40 right-20 w-32 h-32 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-[1.2]">
              {t('landing.featuresSection.title')}
              <br />
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {t('landing.featuresSection.titleHighlight')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.featuresSection.subtitle')}
            </p>
          </motion.div>

          {/* Two Column Feature Showcase */}
          <div className="max-w-6xl mx-auto space-y-16 md:space-y-24 lg:space-y-32">
            {/* Feature 1: E-Signature */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 dark:bg-brand-primary/20 px-4 py-2 rounded-lg mb-6">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">{t('landing.featuresSection.eSignature.badge')}</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('landing.featuresSection.eSignature.title')}
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('landing.featuresSection.eSignature.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.eSignature.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.eSignature.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.eSignature.feature3')}</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-2xl p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Multiple documents stacked */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Background documents (stacked effect) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-52 h-52 sm:h-60 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transform rotate-6 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-52 h-52 sm:h-60 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-lg transform rotate-3 opacity-70"></div>
                    
                    {/* Front document with signature flow */}
                    <div className="relative w-44 sm:w-52 h-52 sm:h-60 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                      {/* Document title */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <span className="ml-2 text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">Contract Agreement</span>
                      </div>
                      
                      {/* Document content */}
                      <div className="space-y-2 mb-4">
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-11/12"></div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-9/12"></div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                      </div>
                      
                      {/* Signature field */}
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 rounded-lg p-3 border border-brand-primary/20 dark:border-brand-primary/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Sign Here</span>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse"></div>
                              <span className="text-[10px] text-brand-primary font-semibold">Active</span>
                            </div>
                          </div>
                          <div className="h-8 flex items-center">
                            <svg width="80" height="24" viewBox="0 0 80 24" className="text-brand-primary">
                              <path
                                d="M 2 15 Q 8 8, 16 12 T 32 15 Q 40 18, 48 15 T 64 12 Q 70 9, 76 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating status badges */}
                    <div className="absolute top-8 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 border border-brand-primary/20 dark:border-brand-primary/30">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('landing.badges.signed')}</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-8 left-8 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg shadow-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold">2 of 3</span>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-16 left-12 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-16 right-12 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className="order-2 md:order-1 relative">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-2xl p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* AI Chat Interface */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Modern Chat window - Responsive width */}
                    <div className="relative w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Professional Header */}
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs">{t('landing.visualElements.aiAssistant')}</div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('landing.visualElements.online')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Chat messages - More vertical space */}
                      <div className="p-4 space-y-3 bg-gray-50 dark:bg-gray-900 h-64">
                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-600">
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{t('landing.visualElements.paymentTermsQuestion')}</p>
                          </div>
                        </div>
                        
                        {/* AI response */}
                        <div className="flex justify-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-md">
                            <p className="text-xs text-white leading-relaxed">{t('landing.visualElements.paymentTermsAnswer')}</p>
                          </div>
                        </div>
                        
                        {/* Typing indicator */}
                        <div className="flex justify-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-8 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 border border-brand-primary/20 dark:border-brand-primary/30">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('landing.badges.aiPowered')}</span>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute bottom-12 right-8 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute top-16 right-16 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 dark:bg-brand-primary/20 px-4 py-2 rounded-lg mb-6">
                  <Brain className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">{t('landing.featuresSection.aiIntelligence.badge')}</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('landing.featuresSection.aiIntelligence.title')}
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('landing.featuresSection.aiIntelligence.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.aiIntelligence.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.aiIntelligence.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.aiIntelligence.feature3')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Feature 3: Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 dark:bg-brand-primary/20 px-4 py-2 rounded-lg mb-6">
                  <Users className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">{t('landing.featuresSection.teamCollaboration.badge')}</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('landing.featuresSection.teamCollaboration.title')}
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('landing.featuresSection.teamCollaboration.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.teamCollaboration.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.teamCollaboration.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.featuresSection.teamCollaboration.feature3')}</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Team Workflow Visual - Clean & Modern */}
                  <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6 scale-90 sm:scale-95 md:scale-100">
                    {/* Document 1 - Draft */}
                    <div className="relative">
                      <div className="w-24 sm:w-28 md:w-32 h-36 sm:h-40 md:h-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 p-2 sm:p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                          <div className="h-6 bg-gray-100 dark:bg-gray-900 rounded mt-3"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">Draft</span>
                        </div>
                      </div>
                      
                      {/* User avatar on document */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white dark:border-gray-800">
                        J
                      </div>
                    </div>
                    
                    {/* Arrow indicating workflow */}
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    
                    {/* Document 2 - Under Review */}
                    <div className="relative">
                      <div className="w-32 h-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-brand-accent/25 dark:border-brand-accent/35 p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-brand-accent/15 dark:bg-brand-accent/20 rounded w-3/5 border border-brand-accent/20 dark:border-brand-accent/30"></div>
                          <div className="h-6 bg-brand-accent/8 dark:bg-brand-accent/15 rounded mt-3 border border-brand-accent/15 dark:border-brand-accent/25"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-brand-accent/8 dark:bg-brand-accent/15 border border-brand-accent/25 dark:border-brand-accent/35 rounded px-2 py-1 flex items-center justify-center">
                          <Users className="w-3 h-3 text-brand-accent/90 dark:text-brand-accent mr-1" />
                          <span className="text-[9px] font-semibold text-brand-accent/90 dark:text-brand-accent">Reviewing</span>
                        </div>
                      </div>
                      
                      {/* Multiple user avatars */}
                      <div className="absolute -top-2 -right-2 flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white dark:border-gray-800 z-10">
                          M
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white dark:border-gray-800">
                          S
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow indicating workflow */}
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                    
                    {/* Document 3 - Signed */}
                    <div className="relative">
                      <div className="w-32 h-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-brand-primary/40 dark:border-brand-primary/50 p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                          <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded mt-3"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        </div>
                        
                        {/* Checkmark overlay */}
                        <div className="absolute inset-0 bg-brand-primary/5 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-xl">
                            <Check className="w-7 h-7 text-white stroke-[3]" />
                          </div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/30 dark:border-brand-primary/40 rounded px-2 py-1 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-brand-primary mr-1" />
                          <span className="text-[9px] font-semibold text-brand-primary">Signed</span>
                        </div>
                      </div>
                      
                      {/* User avatar on document */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white dark:border-gray-800">
                        A
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating info badge */}
                  <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl px-3 py-2 border border-brand-primary/20 dark:border-brand-primary/30">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-[8px] font-bold">J</div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-[8px] font-bold">M</div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-[8px] font-bold">S</div>
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('landing.badges.team')}</span>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute bottom-8 left-8 w-20 h-20 bg-brand-primary/10 rounded-full blur-2xl"></div>
                  <div className="absolute top-12 right-12 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-20 md:mt-32"
          >
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-10 py-5 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-brand-primary/20 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              {t('landing.featuresSection.cta')}
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-gray-500 mt-6 text-sm">
              {t('landing.featuresSection.ctaSubtext')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated ambient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-brand-primary/3 dark:bg-brand-primary/8 rounded-full blur-3xl"></div>
          
          {/* Subtle floating shapes */}
          <div className="absolute top-40 right-20 w-32 h-32 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-[1.2]">
              {t('landing.howItWorks.title')}{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {t('landing.howItWorks.titleHighlight')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.howItWorks.subtitle')}
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12 mb-20">
            {/* Step 1: Upload & Secure */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <FileText className="h-10 w-10 text-brand-primary" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">{t('landing.howItWorks.step1.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
                  {t('landing.howItWorks.step1.description')}
                </p>

                {/* Visual: Document with Lock */}
                <div className="relative h-48 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                  {/* Document */}
                  <div className="relative w-32 h-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-3">
                    <div className="space-y-2">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded w-3/5"></div>
                    </div>
                    
                    {/* Lock overlay */}
                    <div className="absolute inset-0 bg-brand-primary/5 dark:bg-brand-primary/10 backdrop-blur-[1px] flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg"
                      >
                        <Lock className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Password indicator */}
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md px-3 py-2 border border-brand-primary/20 dark:border-brand-primary/30">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-primary" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('landing.howItWorks.step1.badge')}</span>
                    </div>
                  </div>

                  {/* Decorative particles */}
                  <motion.div
                    className="absolute top-4 left-4 w-2 h-2 bg-brand-primary/40 rounded-full blur-sm"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-8 right-6 w-3 h-3 bg-brand-accent/40 rounded-full blur-sm"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Features List */}
                <ul className="space-y-2 mt-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step1.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step1.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step1.feature3')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 2: Collaborate & Prioritize */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-10 w-10 text-brand-primary" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">{t('landing.howItWorks.step2.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
                  {t('landing.howItWorks.step2.description')}
                </p>

                {/* Visual: Multiple Users with Priority */}
                <div className="relative h-48 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                  {/* User Cards with Priority */}
                  <div className="relative flex flex-col gap-3 w-full max-w-[200px]">
                    {/* User 1 - Priority 1 (Active) */}
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-3 border-2 border-brand-primary relative"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          JD
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">John Doe</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('landing.howItWorks.step2.role1')}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded">
                            {t('landing.howItWorks.step2.priority')} 1
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">{t('landing.howItWorks.step2.active')}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* User 2 - Priority 2 (Pending) */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-600 opacity-70 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          SM
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Sarah Miller</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('landing.howItWorks.step2.role2')}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-2 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded">
                            {t('landing.howItWorks.step2.priority')} 2
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t('landing.howItWorks.step2.pending')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User 3 - Priority 3 (Pending) */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-600 opacity-50 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          AL
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Alex Lee</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('landing.howItWorks.step2.role3')}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-2 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded">
                            {t('landing.howItWorks.step2.priority')} 3
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t('landing.howItWorks.step2.pending')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-6 right-6 w-3 h-3 bg-brand-primary/40 rounded-full blur-sm"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-brand-accent/40 rounded-full blur-sm"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Features List */}
                <ul className="space-y-2 mt-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step2.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step2.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step2.feature3')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 3: Track & Complete */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <Check className="h-10 w-10 text-brand-primary" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">{t('landing.howItWorks.step3.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
                  {t('landing.howItWorks.step3.description')}
                </p>

                {/* Visual: Progress Dashboard */}
                <div className="relative h-48 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 dark:from-brand-primary/10 dark:to-brand-accent/10 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                  {/* Dashboard Card */}
                  <div className="relative w-full max-w-[220px] bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-600">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('landing.howItWorks.step3.documentStatus')}</span>
                      <div className="flex items-center gap-1">
                        <BarChart className="w-3.5 h-3.5 text-brand-primary" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{t('landing.howItWorks.step3.completion')}</span>
                        <span className="text-xs font-bold text-brand-primary">67%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "67%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                        />
                      </div>
                    </div>

                    {/* Status Items */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-primary" />
                          <span className="text-gray-700 dark:text-gray-300">John {t('landing.howItWorks.step3.signed')}</span>
                        </div>
                        <span className="text-gray-400 text-[10px]">2h {t('landing.howItWorks.step3.ago')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-primary" />
                          <span className="text-gray-700 dark:text-gray-300">Sarah {t('landing.howItWorks.step3.signed')}</span>
                        </div>
                        <span className="text-gray-400 text-[10px]">1h {t('landing.howItWorks.step3.ago')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Clock className="w-3.5 h-3.5 text-brand-primary" />
                          </motion.div>
                          <span className="text-gray-700 dark:text-gray-300 font-semibold">Alex {t('landing.howItWorks.step3.pending')}</span>
                        </div>
                        <span className="text-brand-primary text-[10px] font-semibold">{t('landing.howItWorks.step2.active')}</span>
                      </div>
                    </div>

                    {/* Completion Badge */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-6 h-6 text-white stroke-[3]" />
                    </motion.div>
                  </div>

                  {/* Notification Badge */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg shadow-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="w-4 h-4" />
                      <span className="text-xs font-bold">2 signed!</span>
                    </div>
                  </motion.div>

                  {/* Decorative particles */}
                  <motion.div
                    className="absolute top-6 left-6 w-2.5 h-2.5 bg-brand-primary/50 rounded-full blur-sm"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-8 left-8 w-3 h-3 bg-brand-primary/40 rounded-full blur-sm"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Features List */}
                <ul className="space-y-2 mt-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step3.feature1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step3.feature2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>{t('landing.howItWorks.step3.feature3')}</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-10 py-5 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-brand-primary/20 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              {t('landing.howItWorks.cta')}
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
              {t('landing.howItWorks.ctaSubtext')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Enhanced Background Decoration with Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large ambient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-brand-primary/5 dark:bg-brand-primary/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-brand-accent/5 dark:bg-brand-accent/10 blur-3xl"></div>
          
          {/* Decorative circles - scattered - Hidden in dark mode */}
          <div className="absolute top-32 left-16 w-20 h-20 rounded-full bg-brand-primary/8 dark:hidden"></div>
          <div className="absolute top-48 left-8 w-16 h-16 rounded-full bg-brand-accent/6 dark:hidden"></div>
          <div className="absolute top-[60%] left-20 w-24 h-24 rounded-full bg-brand-primary/7 dark:hidden"></div>
          <div className="absolute bottom-32 left-12 w-20 h-20 rounded-full bg-brand-accent/8 dark:hidden"></div>
          
          <div className="absolute top-40 right-16 w-20 h-20 rounded-full bg-brand-accent/8 dark:hidden"></div>
          <div className="absolute top-56 right-8 w-16 h-16 rounded-full bg-brand-primary/6 dark:hidden"></div>
          <div className="absolute top-[65%] right-20 w-24 h-24 rounded-full bg-brand-accent/7 dark:hidden"></div>
          <div className="absolute bottom-40 right-12 w-20 h-20 rounded-full bg-brand-primary/8 dark:hidden"></div>
          
          {/* Floating lines/shapes - Hidden in dark mode */}
          <div className="absolute top-1/4 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent rotate-45 dark:hidden"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-1 bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent -rotate-12 dark:hidden"></div>
          <div className="absolute bottom-1/3 left-1/3 w-36 h-1 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent rotate-12 dark:hidden"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header - Minimal */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('landing.testimonials.title')}
            </h2>
          </motion.div>

          {/* Testimonials Grid - Clean & Minimal */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                {/* Minimal Card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-primary/30 dark:hover:border-brand-accent/30 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                  {/* Stars - Compact */}
                  <div className="flex gap-0.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brand-primary fill-brand-primary" />
                    ))}
                  </div>

                  {/* Quote - Clean Typography */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                    "{testimonial.quote}"
                  </p>

                  {/* Author Section - Minimal */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    {/* Simple Avatar */}
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
                      <span className="text-brand-primary font-semibold text-sm">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Author Info - Tight */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{testimonial.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {t('landing.cta.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
            </motion.div>

            {/* Mac Window Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              {/* Mac Window Frame */}
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl shadow-2xl overflow-hidden border border-gray-800 dark:border-gray-700">
                {/* Mac Title Bar */}
                <div className="bg-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center space-x-2 border-b border-gray-700 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">SignMeNow Dashboard</span>
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 aspect-video">
                  <div className="flex h-full space-x-4">
                    {/* Sidebar Skeleton */}
                    <div className="w-64 bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 flex flex-col h-full">
                      {/* Logo Area */}
                      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-gray-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">SignMeNow</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-1 mt-4 flex-1">
                        {/* Dashboard - Active */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-brand-primary text-white">
                          <BarChart className="w-4 h-4" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </div>
                        
                        {/* Documents */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">Documents</span>
                        </div>
                        
                        {/* Inbox */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">Inbox</span>
                        </div>
                        
                        {/* Templates */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">Templates</span>
                        </div>
                        
                        {/* Archive */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm">Archive</span>
                        </div>
                        
                        {/* Analytics */}
                        <div className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                          <BarChart className="w-4 h-4" />
                          <span className="text-sm">Analytics</span>
                        </div>
                      </div>

                      {/* Profile Area - At Bottom */}
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-600 mt-auto">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                          <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">JD</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">John Doe</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john@example.com</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse" />
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse" />
                          <div className="w-24 h-10 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg" />
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((stat) => (
                          <div key={stat} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse" />
                            <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded w-16 animate-pulse" />
                            <div className="h-2 bg-green-200 dark:bg-green-800 rounded w-12 animate-pulse" />
                          </div>
                        ))}
                      </div>

                      {/* Document List */}
                      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse mb-4" />
                        {[1, 2, 3, 4].map((doc) => (
                          <div key={doc} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <div className="w-10 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 rounded" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-40 animate-pulse" />
                              <div className="h-2 bg-gray-200 dark:bg-gray-500 rounded w-24 animate-pulse" />
                            </div>
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <button 
                onClick={() => navigate('/login')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-accent rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/25 hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No credit card required • Get started in minutes</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                {t('landing.pricing.title')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {t('landing.pricing.subtitle')}
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-brand-primary" : "text-gray-500 dark:text-gray-400")}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors duration-300",
                  isAnnual ? "bg-brand-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300",
                  isAnnual ? "translate-x-8" : "translate-x-0"
                )} />
              </button>
              <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-brand-primary" : "text-gray-500 dark:text-gray-400")}>
                Annual
              </span>
              {isAnnual && (
                <span className="text-xs font-semibold bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan('basic');
              }}
            >
              <div className={cn(
                "bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 h-full flex flex-col",
                selectedPlan === 'basic' 
                  ? "border-brand-primary shadow-xl shadow-brand-primary/20 scale-105" 
                  : "border-gray-200 dark:border-gray-700 hover:border-brand-primary/30 dark:hover:border-brand-primary/30 hover:shadow-xl"
              )}>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('landing.pricing.basic.name')}</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-brand-primary">Free</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Perfect to get started</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">3 documents per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">1 signer per document</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Basic e-signature</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">PDF viewer & editor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Email notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Basic support</span>
                  </li>
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPlan === 'basic') {
                      navigate('/register');
                    } else {
                      setSelectedPlan('basic');
                    }
                  }}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                    selectedPlan === 'basic'
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-90"
                      : "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                  )}
                >
                  {selectedPlan === 'basic' ? 'Get Started' : 'Choose'}
                </button>
              </div>
            </motion.div>

            {/* Standard Plan - Popular */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan('standard');
              }}
            >
              <div className={cn(
                "rounded-2xl p-[2px] h-full transition-all duration-300 relative",
                selectedPlan === 'standard' 
                  ? "bg-gradient-to-br from-brand-primary to-brand-accent shadow-xl shadow-brand-primary/30 scale-105" 
                  : "bg-gray-200 dark:bg-gray-700"
              )}>
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full flex flex-col relative">
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Standard</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      {isAnnual ? (
                        <>
                          <span className="text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                            $8
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-lg">/month</span>
                        </>
                      ) : (
                        <>
                          <span className="text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                            $10
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-lg">/month</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isAnnual ? 'Billed annually ($96/year)' : 'Billed monthly'}
                    </p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Everything in Basic, plus:</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Unlimited documents</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Up to 5 signers per document</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Document templates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">AI document chat</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Document archive</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Audit trail & tracking</span>
                    </li>
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedPlan === 'standard') {
                        navigate('/register');
                      } else {
                        setSelectedPlan('standard');
                      }
                    }}
                    className={cn(
                      "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                      selectedPlan === 'standard'
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-90"
                        : "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    )}
                  >
                    {selectedPlan === 'standard' ? 'Get Started' : 'Choose'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan('professional');
              }}
            >
              <div className={cn(
                "bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 h-full flex flex-col",
                selectedPlan === 'professional' 
                  ? "border-brand-accent shadow-xl shadow-brand-accent/20 scale-105" 
                  : "border-gray-200 dark:border-gray-700 hover:border-brand-accent/30 dark:hover:border-brand-accent/30 hover:shadow-xl"
              )}>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Professional</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    {isAnnual ? (
                      <>
                        <span className="text-5xl font-bold text-brand-accent">$16</span>
                        <span className="text-gray-500 dark:text-gray-400 text-lg">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-brand-accent">$20</span>
                        <span className="text-gray-500 dark:text-gray-400 text-lg">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAnnual ? 'Billed annually ($192/year)' : 'Billed monthly'}
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Everything in Standard, plus:</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Unlimited signers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Advanced AI analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Custom workflows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Team collaboration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Address book</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Priority 24/7 support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">API access</span>
                  </li>
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPlan === 'professional') {
                      navigate('/register');
                    } else {
                      setSelectedPlan('professional');
                    }
                  }}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                    selectedPlan === 'professional'
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-90"
                      : "border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white"
                  )}
                >
                  {selectedPlan === 'professional' ? 'Get Started' : 'Choose'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-xl p-6 max-w-3xl mx-auto border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Need an Enterprise plan?</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Custom solutions for large organizations with advanced security and compliance.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-brand-primary font-semibold rounded-lg border border-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300"
              >
                Contact Sales
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-2xl" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-40 right-1/4 w-48 h-48 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl" />
          
          {/* Floating Lines */}
          <svg className="absolute top-10 right-10 w-64 h-64 opacity-20 dark:opacity-30" viewBox="0 0 200 200">
            <path d="M20,100 Q100,20 180,100" stroke="currentColor" fill="none" strokeWidth="1" className="text-brand-primary" />
            <path d="M20,120 Q100,40 180,120" stroke="currentColor" fill="none" strokeWidth="1" className="text-brand-accent" />
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Contact Information</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">contact@signmenow.de</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400">+49 89 1234 5678</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Office</h4>
                    <p className="text-gray-600 dark:text-gray-400">Maximilianstraße 13<br />80539 München, Germany</p>
                  </div>
                </motion.div>
              </div>

              {/* Social or Additional Info */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available Monday - Friday, 9:00 AM - 6:00 PM CET
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-none p-8 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary dark:focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary dark:focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary dark:focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary dark:focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    placeholder="+49 89 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary dark:focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">SignMeNow</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                Modern document management and e-signature platform. Sign, analyze, and collaborate seamlessly.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">Testimonials</a></li>
                <li><button onClick={() => navigate('/app/pdf-signature')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">E-Signature</button></li>
                <li><button onClick={() => navigate('/app/chat')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">AI Chat</button></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">About Us</button></li>
                <li><button onClick={() => navigate('/register')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Get Started</button></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Sign In</button></li>
                <li><button onClick={() => navigate('/app/profile')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Account</button></li>
                <li><a href="mailto:contact@signmenow.com" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/app/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Dashboard</button></li>
                <li><button onClick={() => navigate('/app/documents')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Documents</button></li>
                <li><button onClick={() => navigate('/app/templates')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Templates</button></li>
                <li><button onClick={() => navigate('/app/analytics')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Analytics</button></li>
                <li><button onClick={() => navigate('/app/settings')} className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors text-sm text-left">Settings</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} SignMeNow. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;