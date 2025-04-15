'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface NavItem {
  label: string;
  target: string;
  icon: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', target: 'hero', icon: '🏠' },
    { label: 'Time Allocation', target: 'time-allocation', icon: '⏱️' },
    { label: 'Skills', target: 'skills', icon: '🌟' },
    { label: 'Projects', target: 'projects', icon: '🚀' },
    { label: 'Learnings', target: 'key-learnings', icon: '📝' },
    { label: 'Goals', target: 'future-goals', icon: '🎯' },
  ];

  // Handle scroll to update navbar appearance and active section
  useEffect(() => {
    const sections = navItems.map(item => item.target);

    const handleScroll = () => {
      // Update navbar appearance based on scroll position
      setIsScrolled(window.scrollY > 50);

      // Find the active section based on scroll position
      const scrollPosition = window.scrollY + 300; // Offset to trigger earlier

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const offset = element.offsetTop;

        if (scrollPosition >= offset && scrollPosition < offset + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Scroll to section on click
  const scrollToSection = (targetId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className={`transition-all duration-300 ${
            isScrolled 
              ? 'bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg py-2'
              : 'bg-transparent py-6'
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-3 text-white font-bold text-xl cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => scrollToSection('hero')}
            >
              <Image 
                src="/F_logo.png" 
                alt="Finosauras Logo" 
                width={30} 
                height={30} 
                className="h-8 w-auto"
              />
              <span>Internship Journey</span>
            </motion.div>
            
            <div className="flex space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.target}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative ${
                    activeSection === item.target
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50'
                  }`}
                  onClick={() => scrollToSection(item.target)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="hidden sm:inline mr-1">{item.icon}</span> {item.label}
                  
                  {activeSection === item.target && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      layoutId="activeSection"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile navbar button */}
      <motion.button
        className="fixed top-4 right-4 z-[51] bg-blue-500 p-3 rounded-full shadow-lg md:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`w-full h-0.5 bg-white rounded-lg transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8.5px]' : ''}`}></span>
          <span className={`w-full h-0.5 bg-white rounded-lg transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-0.5 bg-white rounded-lg transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8.5px]' : ''}`}></span>
        </div>
      </motion.button>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden bg-gray-900 bg-opacity-95 backdrop-blur-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.target}
                  className={`px-6 py-4 text-xl ${
                    activeSection === item.target ? 'text-blue-400' : 'text-white'
                  }`}
                  onClick={() => scrollToSection(item.target)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="mr-2">{item.icon}</span> {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 