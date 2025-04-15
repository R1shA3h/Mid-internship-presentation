'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';

const Footer = () => {
  const [runConfetti, setRunConfetti] = useState(false);
  const [confettiDimensions, setConfettiDimensions] = useState({ width: 0, height: 0 });
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (footerRef.current) {
        setConfettiDimensions({
          width: window.innerWidth,
          height: footerRef.current.offsetTop + footerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions(); // Initial dimensions
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleDocClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior initially
    setRunConfetti(true);
    setTimeout(() => setRunConfetti(false), 5000); // Run confetti for 5 seconds
    
    // Small delay to ensure confetti starts before navigating
    setTimeout(() => {
      window.open(e.currentTarget.href, '_blank', 'noopener,noreferrer');
    }, 300);
  };
  
  const googleDocLink = "https://docs.google.com/document/d/1lBABCKI5TPXfjsl0-rTKnDAx18kmy-LKmdQmGO7B_lQ/edit?addon_store&tab=t.0";

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white py-6 sm:py-8 md:py-10 relative">
      {runConfetti && 
        <Confetti 
          width={confettiDimensions.width}
          height={confettiDimensions.height}
          recycle={false}
          numberOfPieces={Math.min(300, window.innerWidth / 4)} // Adjust based on screen size
          gravity={0.15}
          initialVelocityY={15}
        />
      }
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center md:text-left mb-4 md:mb-0 w-full md:w-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              <span className="text-blue-400">Finosauras</span> Internship Journey
            </h3>
            <p className="text-gray-400 max-w-md mx-auto md:mx-0 text-sm sm:text-base">
              This interactive report visualizes my growth and contributions during 
              the first three months at Finosauras.
            </p>
          </div>
          
          {/* Additional content can go here for the right side of the footer if needed */}
        </motion.div>
        
        <motion.div 
          className="mt-5 sm:mt-6 md:mt-8 pt-5 sm:pt-6 border-t border-gray-800 text-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-xs sm:text-sm">April 2025 • Mid-Internship Progress Report</p>
          <p className="mt-2 max-w-3xl mx-auto italic text-xs sm:text-sm leading-relaxed px-2 sm:px-0">
            &quot;This internship has been more than just a learning experience — it&apos;s been a personal 
            journey of growth, confidence, and learning to fight through ambiguity. I come to work every day 
            not because I have to, but because I genuinely want to — because I believe in the vision we&apos;re 
            building at Finosauras. I&apos;ve had moments where I failed to meet expectations. But I don&apos;t hide 
            from those — I learn from them, and I come back stronger. I&apos;m not here just to build features. 
            I&apos;m here to build myself. And if I&apos;m given the guidance, I&apos;ll turn that into outcomes that speak 
            louder than words.&quot;
          </p>
          
          {/* Innovative Google Doc Link */}
          <motion.div
            className="mt-4 sm:mt-5 md:mt-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <a 
              href={googleDocLink}
              onClick={handleDocClick}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 touch-manipulation"
            >
              🎉 View Full Report Doc 🎉
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 