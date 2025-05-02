'use client';

import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import TimeAllocation from '@/components/TimeAllocation';
import SkillProgressionChart from '@/components/SkillProgressionChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import KeyLearnings from '@/components/KeyLearnings';
import FutureGoals from '@/components/FutureGoals';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-gray-900 text-white">
      <Navbar />

      <div id="hero">
        <HeroSection />
        </div>
      
      <TimeAllocation />
      
      <SkillProgressionChart />
      
      <ProjectTimeline />
      
      <KeyLearnings />
      
      <FutureGoals />
      
      <Footer />
      </main>
  );
}
