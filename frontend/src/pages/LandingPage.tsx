import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Users, FileText, Star, Sparkles, Brain, Lock, MessageSquare, BarChart, Clock, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Up to 3 documents per month', '1 signer per document', 'Standard support'],
      cta: 'Choose Plan',
    },
    {
      name: 'Standard',
      price: '$9.99/month',
      features: ['Unlimited documents', 'Up to 5 signers per document', 'Priority support'],
      cta: 'Choose Plan',
      popular: true,
    },
    {
      name: 'Professional',
      price: '$19.99/month',
      features: ['Unlimited documents', 'Unlimited signers', 'Premium support'],
      cta: 'Choose Plan',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-4xl p-8 relative"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-center text-brand-text mb-2">Our Pricing</h2>
        <p className="text-center text-gray-500 mb-8">Choose the plan that's right for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                'border rounded-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2',
                plan.popular ? 'border-brand-primary ring-2 ring-brand-primary' : 'border-gray-200'
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-brand-text">{plan.name}</h3>
              <p className="text-3xl font-bold my-4 text-brand-text">{plan.price}</p>
              <ul className="space-y-3 text-gray-600 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={cn(
                'w-full mt-8 py-3 rounded-lg font-semibold transition-colors',
                plan.popular ? 'bg-brand-primary text-white hover:bg-brand-accent' : 'bg-gray-100 text-brand-text hover:bg-gray-200'
              )}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const words = ['Sign', 'Analyze', 'Chat with', 'Share', 'Track', 'Manage'];

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
      quote: "This is the future of document management. Incredibly intuitive and has saved our team countless hours.",
      author: "Alex Johnson",
      title: "CEO, Innovate Inc.",
    },
    {
      quote: "The security and ease of use are unparalleled. I can sign contracts on the go with complete peace of mind.",
      author: "Samantha Bee",
      title: "Freelance Designer",
    },
    {
        quote: "A beautifully designed platform that makes a tedious process feel elegant and simple. Highly recommended!",
        author: "Michael Chen",
        title: "Startup Founder",
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
    <div className="bg-brand-background text-brand-text">
      {/* Floating Navbar */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-30 transition-all duration-300",
        isScrolled ? "top-4 w-[90%] max-w-8xl" : "top-6 w-[90%] max-w-8xl"
      )}>
        <nav className={cn(
          "flex justify-between items-center px-4 md:px-6 py-3 md:py-4 transition-all duration-300 backdrop-blur-xl rounded-full border border-white/30 shadow-sm",
          isScrolled 
            ? "bg-white/60" 
            : "bg-white/50"
        )}>
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            SignMeNow
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Features</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Testimonials</button>
            <button onClick={() => setIsModalOpen(true)} className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Pricing</button>
          </div>
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-background to-teal-50"
      >
        <div className="absolute inset-0 z-0">
            {/* Subtle background shapes */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200 rounded-full opacity-20 blur-2xl"
                animate={{
                    x: [-20, 20, -20],
                    y: [-20, 20, -20],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-100 rounded-full opacity-20 blur-2xl"
                animate={{
                    x: [20, -20, 20],
                    y: [20, -20, 20],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
        </div>
        
        {/* Smooth gradient transition to white at bottom - Enhanced */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-white z-[1]"></div>
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
            <span className="text-gray-900">Documents Smarter</span>
            <br />
            <span className="text-gray-900">with</span>{' '}
            <span className="text-brand-primary">AI Power</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sm md:text-base lg:text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
          >
            Transform how you handle documents with intelligent AI technology. Sign electronically, analyze content instantly, chat with your PDFs for quick insights, and keep everything organized in one secure place.
          </motion.p>
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => navigate('/login')}
            className="bg-brand-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-brand-accent transition-transform transform hover:scale-105 shadow-lg"
          >
            Get Started Free <ArrowRight className="inline ml-2 w-5 h-5" />
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
                className="relative top-8 left-1/2 -translate-x-1/2 w-72 lg:w-80 h-[380px] bg-white rounded-xl shadow-2xl p-6 lg:p-8 border border-gray-100"
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
                      <div className="h-2 w-20 bg-gray-200 rounded"></div>
                      <div className="h-1.5 w-16 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                
                {/* Document Lines */}
                <div className="space-y-3 mb-8">
                  <div className="h-2 bg-gray-100 rounded w-full"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-100 rounded w-full"></div>
                  <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                  <div className="h-2 bg-gray-100 rounded w-full"></div>
                  <div className="h-2 bg-gray-100 rounded w-3/6"></div>
                </div>

                {/* Signature Area */}
                <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8">
                  <div className="border-t-2 border-dashed border-gray-200 pt-4">
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
                    <div className="flex items-center justify-between text-xs text-gray-400">
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
                  <span className="text-xs font-bold">AI Powered</span>
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
                  className="absolute top-1/3 -left-16 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-primary/20 flex items-center gap-2"
                  animate={{
                    x: [0, -8, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                >
                  <Shield className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-semibold text-gray-700">Secure</span>
                </motion.div>

                {/* Instant Badge - Bottom Right */}
                <motion.div
                  className="absolute -bottom-4 -right-14 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-primary/20 flex items-center gap-2"
                  animate={{
                    x: [0, 8, 0],
                    y: [0, 5, 0],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                >
                  <Zap className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-semibold text-gray-700">Instant</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Why You'll Love SignMeNow */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-white via-brand-primary/[0.02] to-white relative overflow-hidden">
        {/* Background Decorative Shapes - Subtle Side Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left side - subtle filled circles (larger and more) */}
          <div className="absolute top-16 left-8 w-40 h-40 rounded-full bg-brand-primary/8"></div>
          <div className="absolute top-32 left-16 w-32 h-32 rounded-full bg-brand-accent/6"></div>
          <div className="absolute top-56 left-4 w-36 h-36 rounded-full bg-brand-primary/7"></div>
          <div className="absolute top-1/3 left-12 w-48 h-48 rounded-full bg-brand-accent/8"></div>
          <div className="absolute top-[45%] left-6 w-38 h-38 rounded-full bg-brand-primary/7"></div>
          <div className="absolute top-1/2 left-14 w-40 h-40 rounded-full bg-brand-accent/8"></div>
          <div className="absolute top-[60%] left-8 w-36 h-36 rounded-full bg-brand-primary/7"></div>
          <div className="absolute top-[70%] left-16 w-34 h-34 rounded-full bg-brand-accent/8"></div>
          <div className="absolute bottom-32 left-10 w-40 h-40 rounded-full bg-brand-primary/7"></div>
          <div className="absolute bottom-16 left-12 w-36 h-36 rounded-full bg-brand-accent/8"></div>
          
          {/* Right side - subtle filled circles (larger and more) */}
          <div className="absolute top-20 right-10 w-42 h-42 rounded-full bg-brand-accent/8"></div>
          <div className="absolute top-40 right-16 w-34 h-34 rounded-full bg-brand-primary/7"></div>
          <div className="absolute top-64 right-6 w-38 h-38 rounded-full bg-brand-accent/7"></div>
          <div className="absolute top-1/3 right-12 w-48 h-48 rounded-full bg-brand-primary/8"></div>
          <div className="absolute top-[48%] right-8 w-40 h-40 rounded-full bg-brand-accent/7"></div>
          <div className="absolute top-[58%] right-14 w-36 h-36 rounded-full bg-brand-primary/8"></div>
          <div className="absolute top-[68%] right-10 w-38 h-38 rounded-full bg-brand-accent/7"></div>
          <div className="absolute bottom-36 right-16 w-40 h-40 rounded-full bg-brand-primary/8"></div>
          <div className="absolute bottom-20 right-8 w-42 h-42 rounded-full bg-brand-accent/7"></div>
          <div className="absolute bottom-6 right-12 w-36 h-36 rounded-full bg-brand-primary/8"></div>
          
          {/* Extra subtle ambient circles - larger with blur */}
          <div className="absolute top-1/4 left-2 w-56 h-56 rounded-full bg-brand-primary/5 blur-2xl"></div>
          <div className="absolute top-2/3 left-4 w-60 h-60 rounded-full bg-brand-accent/4 blur-3xl"></div>
          <div className="absolute top-1/3 right-2 w-56 h-56 rounded-full bg-brand-accent/5 blur-2xl"></div>
          <div className="absolute bottom-1/4 right-4 w-64 h-64 rounded-full bg-brand-primary/4 blur-3xl"></div>
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
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-[1.2]">
              Everything you need,
              <br />
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                all in one place
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sign documents electronically, analyze with AI, collaborate in real-time, and manage your entire document workflow seamlessly
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
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-lg mb-6">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">E-Signature</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Sign & send in seconds
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                  Legally binding electronic signatures that work on any device. No printing, scanning, or mailing required.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Legally compliant worldwide</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Multiple signature types supported</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Real-time tracking & notifications</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Multiple documents stacked */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Background documents (stacked effect) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-52 h-52 sm:h-60 bg-gray-100 rounded-lg shadow-md transform rotate-6 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-52 h-52 sm:h-60 bg-gray-50 rounded-lg shadow-lg transform rotate-3 opacity-70"></div>
                    
                    {/* Front document with signature flow */}
                    <div className="relative w-44 sm:w-52 h-52 sm:h-60 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 sm:p-5">
                      {/* Document title */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="ml-2 text-[10px] sm:text-xs font-semibold text-gray-700">Contract Agreement</span>
                      </div>
                      
                      {/* Document content */}
                      <div className="space-y-2 mb-4">
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-11/12"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-9/12"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                      </div>
                      
                      {/* Signature field */}
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-lg p-3 border border-brand-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 font-medium">Sign Here</span>
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
                    <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg px-3 py-2 border border-brand-primary/20">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-semibold text-gray-700">Signed</span>
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
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* AI Chat Interface */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Modern Chat window - Responsive width */}
                    <div className="relative w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                      {/* Professional Header */}
                      <div className="bg-white px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-xs">AI Assistant</div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-[10px] text-gray-500">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Chat messages - More vertical space */}
                      <div className="p-4 space-y-3 bg-gray-50 h-64">
                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="bg-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-700 leading-relaxed">What are the payment terms in this contract?</p>
                          </div>
                        </div>
                        
                        {/* AI response */}
                        <div className="flex justify-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-md">
                            <p className="text-xs text-white leading-relaxed">Payment is due within 30 days of invoice date. Net 30 terms apply with a 2% discount for early payment.</p>
                          </div>
                        </div>
                        
                        {/* Typing indicator */}
                        <div className="flex justify-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
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
                    <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg px-3 py-2 border border-brand-primary/20">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-semibold text-gray-700">AI Powered</span>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute bottom-12 right-8 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute top-16 right-16 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-lg mb-6">
                  <Brain className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">AI Intelligence</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Chat with your documents
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                  Ask questions, extract insights, and get instant answers from any PDF using advanced AI technology.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Instant document analysis</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Smart content extraction</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Natural language queries</span>
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
                <div className="inline-flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-lg mb-6">
                  <Users className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">Team Collaboration</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Work together seamlessly
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                  Collaborate with your team in real-time. Share, comment, and manage documents together effortlessly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Real-time collaboration</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Role-based permissions</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm md:text-base text-gray-700">
                    <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>Activity tracking & audit logs</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Team Workflow Visual - Clean & Modern */}
                  <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6 scale-90 sm:scale-95 md:scale-100">
                    {/* Document 1 - Draft */}
                    <div className="relative">
                      <div className="w-24 sm:w-28 md:w-32 h-36 sm:h-40 md:h-44 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-2 sm:p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
                          <div className="h-6 bg-gray-100 rounded mt-3"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-gray-50 border border-gray-200 rounded px-2 py-1 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-gray-500 mr-1" />
                          <span className="text-[9px] font-semibold text-gray-600">Draft</span>
                        </div>
                      </div>
                      
                      {/* User avatar on document */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                        J
                      </div>
                    </div>
                    
                    {/* Arrow indicating workflow */}
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                    
                    {/* Document 2 - Under Review */}
                    <div className="relative">
                      <div className="w-32 h-44 bg-white rounded-lg shadow-xl border-2 border-brand-accent/25 p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-brand-accent/15 rounded w-3/5 border border-brand-accent/20"></div>
                          <div className="h-6 bg-brand-accent/8 rounded mt-3 border border-brand-accent/15"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-brand-accent/8 border border-brand-accent/25 rounded px-2 py-1 flex items-center justify-center">
                          <Users className="w-3 h-3 text-brand-accent/90 mr-1" />
                          <span className="text-[9px] font-semibold text-brand-accent/90">Reviewing</span>
                        </div>
                      </div>
                      
                      {/* Multiple user avatars */}
                      <div className="absolute -top-2 -right-2 flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white z-10">
                          M
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
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
                      <div className="w-32 h-44 bg-white rounded-lg shadow-xl border-2 border-brand-primary/40 p-3 relative overflow-hidden">
                        {/* Document header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                        </div>
                        
                        {/* Content lines */}
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
                          <div className="h-6 bg-gray-100 rounded mt-3"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        
                        {/* Checkmark overlay */}
                        <div className="absolute inset-0 bg-brand-primary/5 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-xl">
                            <Check className="w-7 h-7 text-white stroke-[3]" />
                          </div>
                        </div>
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 right-2 bg-brand-primary/10 border border-brand-primary/30 rounded px-2 py-1 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-brand-primary mr-1" />
                          <span className="text-[9px] font-semibold text-brand-primary">Signed</span>
                        </div>
                      </div>
                      
                      {/* User avatar on document */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                        A
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating info badge */}
                  <div className="absolute top-6 right-6 bg-white rounded-lg shadow-xl px-3 py-2 border border-brand-primary/20">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">J</div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">M</div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">S</div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">Team</span>
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
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-gray-500 mt-6 text-sm">
              No credit card required • Start in seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">A Process as Simple as 1-2-3</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16">
                <div className="text-center">
                    <div className="flex justify-center items-center h-20 w-20 rounded-full bg-white shadow-md mx-auto mb-4">
                        <FileText className="h-10 w-10 text-brand-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">1. Upload Document</h3>
                </div>
                <div className="text-gray-300 text-3xl md:text-4xl hidden md:block">→</div>
                <div className="text-center">
                    <div className="flex justify-center items-center h-20 w-20 rounded-full bg-white shadow-md mx-auto mb-4">
                        <Users className="h-10 w-10 text-brand-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">2. Add Signers</h3>
                </div>
                <div className="text-gray-300 text-3xl md:text-4xl hidden md:block">→</div>
                <div className="text-center">
                    <div className="flex justify-center items-center h-20 w-20 rounded-full bg-white shadow-md mx-auto mb-4">
                        <Check className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">3. Sign & Send</h3>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Loved by Professionals Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-brand-surface p-6 md:p-8 rounded-lg shadow-lg"
              >
                <div className="flex text-yellow-400 mb-4">
                    <Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" />
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-base">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Workflow?</h2>
          <p className="text-base md:text-lg text-gray-600 mb-8">Join thousands of professionals who trust SignMeNow for their document needs.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-brand-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-brand-accent transition-transform transform hover:scale-105 shadow-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p className="text-sm">&copy; {new Date().getFullYear()} SignMeNow. All Rights Reserved.</p>
        </div>
      </footer>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LandingPage;