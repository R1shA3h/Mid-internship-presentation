'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Learning {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const KeyLearnings = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Revised list: 4 direct technical + 2 human, focusing on specific skills and growth
  const learnings: Learning[] = [
    {
      id: 'end-to-end-thinking',
      title: 'End-to-End System Thinking',
      description: 'Learned to think end-to-end: from user interface design through backend architecture to production deployment.',
      icon: '🔄' // Cycle icon for end-to-end flow
    },
    {
      id: 'framework-proficiency',
      title: 'Modern Framework Proficiency',
      description: 'Gained confidence using Next.js, Node.js, and MongoDB in real-world production scenarios.',
      icon: '⚡' // Power icon for framework mastery
    },
    {
      id: 'api-data-integration',
      title: 'API Design & Data Integration',
      description: 'Understood how APIs are built, optimized, and integrated; picked up early skills in data engineering (scraping, cleaning, pipelines).',
      icon: '🔌' // Plug icon for connections
    },
    {
      id: 'cicd-deployment',
      title: 'CI/CD & Deployment Practices',
      description: 'Learned to work with CI/CD pipelines and Nginx-based deployment setups for reliable software delivery.',
      icon: '🚀' // Rocket for deployment
    },
    {
      id: 'embracing-the-unknown',
      title: 'Finding Growth in the Unknown',
      description: 'Learning that \'failing\' isn\'t the end, but a starting point. Building resilience and the humility to ask for guidance.',
      icon: '🧭' // Represents navigating challenges
    },
    {
      id: 'owning-the-outcome',
      title: 'Hunger to Own the Outcome',
      description: 'Shifting from just completing tasks to taking initiative and feeling genuine drive to contribute to the larger vision.',
      icon: '🔥' // Represents drive and passion
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // We'll create an animation for floating particles
    const container = containerRef.current;
    const particleCount = 30;

    // Clean up any existing particles
    const existingParticles = container.querySelectorAll('.floating-particle');
    existingParticles.forEach(particle => particle.remove());

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      // Set random size (small)
      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random color (blues, purples, and teals)
      const colors = [
        'rgba(79, 209, 197, 0.6)', // Teal
        'rgba(99, 179, 237, 0.6)', // Light blue
        'rgba(129, 140, 248, 0.6)', // Indigo
        'rgba(167, 139, 250, 0.6)', // Purple
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
      
      // Random animation duration and delay
      const animDuration = Math.random() * 15 + 10;
      const animDelay = Math.random() * 5;
      particle.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite`;
      
      container.appendChild(particle);
    }

    // Cleanup function
    return () => {
      const particles = container.querySelectorAll('.floating-particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <section id="key-learnings" className="min-h-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Particle container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
      />
      
      <motion.div 
        className="text-center mb-16 z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">My Growth Edge</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Beyond the code: Key shifts in perspective and capability during this internship.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl z-10">
        {learnings.map((learning, index) => (
          <motion.div
            key={learning.id}
            className="bg-gray-800 bg-opacity-40 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-60 transition-all duration-300 border border-gray-700 hover:border-blue-400 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            {/* Glowing orb behind the icon */}
            <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-blue-500 opacity-20 filter blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            
            {/* Icon */}
            <div className="text-3xl mb-4 relative z-10">
              {learning.icon}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{learning.title}</h3>
            <p className="text-gray-300">{learning.description}</p>
            
            {/* Animated pulse dot */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400">
              <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
            </div>
            
            {/* Highlight glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default KeyLearnings; 