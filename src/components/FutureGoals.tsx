'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const goalsData: Goal[] = [
  {
    id: 'ownership',
    name: 'Complete Feature Ownership',
    description: 'Take complete ownership of at least one high-impact feature or tool, and see it through with full accountability.',
    icon: '🎯'
  },
  {
    id: 'youtube',
    name: 'YouTube Pipeline Automation',
    description: 'Deliver the YouTube data pipeline as a fully automated system with meaningful trade analysis.',
    icon: '📺'
  },
  {
    id: 'backend',
    name: 'Backend & Cloud Deep Dive',
    description: 'Significantly advance backend and data engineering skills, moving towards confident cloud infrastructure management.',
    icon: '☁️'
  },
  {
    id: 'mentor',
    name: 'Lift Others Up',
    description: 'Actively mentor and support new team members, sharing knowledge and fostering a collaborative environment.',
    icon: '🤝'
  },
  {
    id: 'growth',
    name: 'Unstoppable Learning Curve',
    description: 'Maintain a relentless pace of learning: new tech, better processes, deeper collaboration, every single week.',
    icon: '📚'
  },
  {
    id: 'proactive-solutions',
    name: 'Proactive Solution Design',
    description: 'Move beyond assigned tasks to identify opportunities and proactively design and propose valuable solutions.',
    icon: '💡'
  }
];

// Component for each goal node in the pipeline
const PipelineNode = ({ goal, isSelected, onClick }: { goal: Goal; isSelected: boolean; onClick: () => void }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative p-5 rounded-lg cursor-pointer border-2 transition-all duration-300 overflow-hidden shadow-lg 
                  ${isSelected 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-purple-400 shadow-purple-500/50' 
                    : 'bg-gray-800 bg-opacity-70 backdrop-blur-md border-gray-600 hover:border-blue-400'}`}
      whileHover={{ scale: isSelected ? 1 : 1.02, y: isSelected? 0 : -3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top section with Icon and Name */}
      <motion.div layout="position" className="flex items-center">
        <motion.span layout="position" className="text-3xl mr-4 bg-black bg-opacity-20 p-2 rounded-md">{goal.icon}</motion.span>
        <motion.h4 layout="position" className="text-md font-semibold text-white">{goal.name}</motion.h4>
      </motion.div>
      
      {/* Expandable Description Area */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="desc" // Key is important for AnimatePresence
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-purple-400 border-opacity-50 pt-3"
          >
            <p className="text-purple-100 text-sm">{goal.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-purple-400 opacity-50 group-hover:opacity-80 transition-opacity"></div>
      {isSelected && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50"></div>}
    </motion.div>
  );
};

// Main FutureGoals Component using the Pipeline concept
const FutureGoals = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section id="future-goals" className="min-h-screen py-20 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
      {/* Optional: Add subtle background effects like animated constellations or grids */}
      <div className="absolute inset-0 opacity-5 z-0 bg-gradient-radial from-blue-900 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Future Growth Pipeline</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Key initiatives and skill advancements I&apos;m targeting next.
          </p>
        </motion.div>

        {/* Pipeline Layout Container */}
        <motion.div 
          className="relative max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Central connecting line (visual only) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-800 via-purple-700 to-indigo-800 transform -translate-x-1/2 rounded-full opacity-30 z-[-1]">
             {/* Could add animated gradient here */} 
          </div>

          {/* Map Goals into Nodes with Staggered Animation */}
          <div className="space-y-10">
            {goalsData.map((goal, index) => (
              <motion.div
                key={goal.id}
                custom={index}
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                  visible: (i) => ({
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
                  })
                }}
                className={`relative ${index % 2 === 0 ? 'mr-auto lg:mr-[55%]' : 'ml-auto lg:ml-[55%]'} w-full lg:w-[45%]`}
              >
                <PipelineNode 
                  goal={goal}
                  isSelected={selectedId === goal.id}
                  onClick={() => setSelectedId(selectedId === goal.id ? null : goal.id)}
                />
                {/* Connecting Dot to central line */}
                <div className={`absolute top-1/2 ${index % 2 === 0 ? 'right-[-2.5rem] lg:right-[-4rem]' : 'left-[-2.5rem] lg:left-[-4rem]'} w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-gray-700 transform -translate-y-1/2 hidden lg:block`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      <motion.p 
        className="text-center text-gray-600 text-xs mt-16 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        Click nodes to expand details.
      </motion.p>
    </section>
  );
};

export default FutureGoals; 