'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Define the interface for a Goal
interface Goal {
  id: string;
  name: string;
  description: string;
  urgent: boolean;
}

// Sample goals data
const goals: Goal[] = [
  {
    id: 'g1',
    name: 'Advanced Cloud Architecture',
    description: 'Develop expertise in multi-cloud environments with focus on serverless architectures and microservices at scale.',
    urgent: false
  },
  {
    id: 'g2',
    name: 'CI/CD Pipeline Mastery',
    description: 'Implement advanced deployment strategies including canary releases, blue-green deployments, and automated rollbacks.',
    urgent: true
  },
  {
    id: 'g3',
    name: 'Enterprise Security Implementation',
    description: 'Specialize in zero-trust architecture, IAM best practices, and automated security scanning integration.',
    urgent: false
  },
  {
    id: 'g4',
    name: 'Data Engineering Proficiency',
    description: 'Build expertise in data pipelines, ETL processes, and real-time analytics infrastructure.',
    urgent: false
  },
  {
    id: 'g5',
    name: 'Containerization at Scale',
    description: 'Advance Kubernetes administration skills with focus on custom controllers, operators, and multi-cluster management.',
    urgent: true
  },
  {
    id: 'g6',
    name: 'AI/ML Integration',
    description: 'Develop skills for integrating machine learning capabilities into enterprise applications and deployment pipelines.',
    urgent: false
  }
];

// Component for each goal node in the pipeline
const PipelineNode: React.FC<{ goal: Goal, index: number }> = ({ goal, index }) => {
  return (
    <motion.div
      className="flex flex-col items-center mb-8 sm:mb-12 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative w-full max-w-md">
        <div 
          className={`
            relative z-10 p-4 sm:p-6 rounded-xl shadow-lg 
            transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            ${goal.urgent ? 'bg-gradient-to-br from-orange-600 to-red-700' : 'bg-gradient-to-br from-blue-700 to-indigo-900'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-white/10">
              <span className="text-xl sm:text-2xl text-white">{index + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{goal.name}</h3>
              <p className="text-sm sm:text-base text-white/80">{goal.description}</p>
            </div>
          </div>
        </div>
        
        {/* Connecting line to next node */}
        {index < 5 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full h-8 sm:h-12 w-px bg-gradient-to-b from-indigo-500 to-transparent"></div>
        )}
      </div>
    </motion.div>
  );
};

// Main FutureGoals Component using the Pipeline concept
const FutureGoals: React.FC = () => {
  return (
    <section id="future-goals" className="py-16 sm:py-20 bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-400">Future Growth Pipeline</h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-white/80">
            My strategic roadmap for continued professional development, prioritized based on impact and timeline.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          {goals.map((goal, index) => (
            <PipelineNode key={goal.id} goal={goal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FutureGoals; 