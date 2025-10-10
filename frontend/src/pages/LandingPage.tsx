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

  return (
    <div className="bg-brand-background text-brand-text">
      {/* Floating Navbar */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-30 transition-all duration-300",
        isScrolled ? "top-4 w-[90%]" : "top-6 w-[90%]"
      )}>
        <nav className={cn(
          "flex justify-between items-center px-6 py-4 transition-all duration-300 backdrop-blur-xl rounded-full border border-white/30 shadow-sm",
          isScrolled 
            ? "bg-white/60" 
            : "bg-white/50"
        )}>
          <div className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            SignMeNow
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Testimonials</a>
            <button onClick={() => setIsModalOpen(true)} className="text-gray-700 hover:text-brand-primary transition-colors font-medium">Pricing</button>
          </div>
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
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
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-background to-teal-50 opacity-50 z-0"></div>
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
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,148,136,0.05)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.05)_0%,transparent_50%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 backdrop-blur-sm px-4 py-2 rounded-lg mb-4 border border-brand-primary/20">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-semibold text-brand-primary">AI Powered Platform</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              Why You'll Love SignMeNow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern teams
            </p>
          </motion.div>

          {/* Feature Grid with Cards */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featureSections.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="relative h-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300">
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <div className="relative">
                    {/* Icon with background */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Stats with icon */}
                    <div className="flex items-center gap-2 text-brand-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                      <span className="text-xs font-semibold">{feature.stats}</span>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-gray-600 mb-6">
              Trusted by <span className="font-bold text-brand-primary">50,000+</span> professionals worldwide
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-8 py-4 rounded-lg font-semibold text-base hover:shadow-xl hover:shadow-brand-primary/20 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
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