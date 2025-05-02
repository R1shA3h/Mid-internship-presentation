'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  period: string;
  description: string;
  technologies: string[];
  link?: string;
  status: 'completed' | 'ongoing';
}

interface ProjectPosition {
  x: number;
  y: number;
  project: Project;
}

const ProjectTimeline = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const projects: Project[] = [
    {
      id: 'learning',
      name: 'Onboarding & Team Support',
      period: 'Jan 2025',
      description: 'Learning and helping team with small tasks under supervision of seniors. Built foundation skills and contributed to various smaller features across the platform.',
      technologies: ['Node.js', 'Next.js', 'React', 'MongoDB'],
      status: 'completed'
    },
    {
      id: 'scams',
      name: 'Scams in India Project',
      period: 'Feb - Mar 2025',
      description: 'Designed and developed the entire frontend and backend system from scratch. Created RESTful APIs with Node.js and built the visual frontend with Next.js.',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'DigitalOcean'],
      link: 'https://www.finosauras.com/scams-in-india',
      status: 'completed'
    },
    {
      id: 'admin',
      name: 'Admin Dashboard & Pipeline',
      period: 'Mar 2025',
      description: 'Built internal dashboard for tracking investor pipeline metrics with data visualizations and performance optimizations.',
      technologies: ['Next.js', 'MongoDB'],
      link: 'https://admin-pipeline-dashboard-tawny.vercel.app',
      status: 'completed'
    },
    {
      id: 'indices',
      name: 'Global Indices Scraping System',
      period: 'Mar 2025',
      description: 'Created Python-based scrapers for financial indices from Groww. Built REST APIs and deployed with Nginx on DigitalOcean.',
      technologies: ['Python', 'REST API', 'Nginx', 'DigitalOcean'],
      link: 'http://143.110.182.215/api/data',
      status: 'completed'
    },
    {
      id: 'insightiq',
      name: 'InsightIQ (Phyllo) API',
      period: 'Feb - Apr 2025',
      description: 'Integrated YouTube, Twitter, and Instagram data sources. Wrote logic for discovering channels and extracting post/video data.',
      technologies: ['APIs', 'Data Integration', 'YouTube', 'Twitter', 'Instagram'],
      status: 'completed'
    },
    {
      id: 'twitter',
      name: 'Tweet Extraction Bot',
      period: 'Apr 2025',
      description: 'Building an automation bot that extracts tweets when given a Twitter profile. Implementing efficient scraping strategies and data analysis.',
      technologies: ['Python','Selenium', 'Scripting', 'Automation', 'Data Extraction'],
      link: 'https://github.com/R1shA3h/tweets_extraction_bot',
      status: 'completed'
    },
    {
      id: 'sitemap',
      name: 'Dynamic Sitemap Generator',
      period: 'Apr 2025',
      description: 'Built a user-friendly interface for marketing team to manage URLs that automatically updates sitemap.xml and restarts Nginx server.',
      technologies: ['Node.js', 'Nginx', 'XML', 'Shell Scripting'],
      status: 'completed'
    },
    {
      id: 'mcp',
      name: 'MCP Integration Suite',
      period: 'Apr 2025',
      description: 'Developed a Model Context Protocol system linking WhatsApp, Zerodha, MongoDB, and GitHub for unified data access and automation workflows.',
      technologies: ['API Integration', 'MongoDB', 'WhatsApp API', 'Zerodha API', 'GitHub API'],
      status: 'completed'
    },
    {
      id: 'youtube',
      name: 'YouTube Data Pipeline',
      period: 'Apr 2025',
      description: 'Developing a bot using Selenium to extract video transcripts via Eightify. Designing a system that filters channels, extracts trades, and calculates ROI.',
      technologies: ['Python', 'Selenium', 'Data Pipeline', 'ROI Analysis'],
      link: 'https://github.com/R1shA3h/youtube-data-transcription-bot',
      status: 'ongoing'
    }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing elements
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 40, left: 30 };
    const width = 1100 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add a gradient background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#timeline-gradient)')
      .attr('rx', 10)
      .attr('ry', 10);

    // Define the gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'timeline-gradient')
      .attr('gradientTransform', 'rotate(90)');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1E3A8A');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#312E81');

    // Create a path for the timeline
    const timelinePath = d3.path();
    
    // Set up path coordinates based on height and project count
    const startX = 100;
    const endX = width - 100;
    const centerY = height / 2;
    const amplitude = 50; // Controls the "wave" height
    const frequency = Math.PI / (width - 200); // Controls how many "waves"
    
    timelinePath.moveTo(startX, centerY);
    
    // Generate a wavy line from start to end
    for (let x = startX; x <= endX; x += 10) {
      const y = centerY + amplitude * Math.sin(frequency * (x - startX));
      timelinePath.lineTo(x, y);
    }
    
    // Add the timeline path with a dashed animation
    const timeline = svg.append('path')
      .attr('d', timelinePath.toString())
      .attr('fill', 'none')
      .attr('stroke', '#60A5FA')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');
    
    // Set the total length
    const totalLength = timeline.node()?.getTotalLength() || 0;
    
    // Initialize the line with a dash the length of itself
    timeline
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength);
      
    // Animate the line creation
    timeline
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);
      
    // Calculate positions for the projects along the timeline
    const projectPositions: ProjectPosition[] = projects.map((project, i) => {
      const progress = i / (projects.length - 1);
      const x = startX + progress * (endX - startX);
      const y = centerY + amplitude * Math.sin(frequency * (x - startX));
      return { x, y, project };
    });

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'project-tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('background', 'rgba(8, 47, 73, 0.95)')
      .style('color', 'white')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100)
      .style('transition', 'opacity 0.3s')
      .style('max-width', '300px');

    // Create project nodes with delay for animation effect
    const nodeGroups = svg.selectAll('.project-node')
      .data(projectPositions)
      .enter()
      .append('g')
      .attr('class', 'project-node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('opacity', 0);
    
    // Animate node appearance with delay
    nodeGroups
      .transition()
      .delay((d, i) => 1500 + i * 300)
      .duration(500)
      .style('opacity', 1);
      
    // Add circles for project nodes
    nodeGroups.append('circle')
      .attr('r', 8)
      .attr('fill', d => d.project.status === 'completed' ? '#4ADE80' : '#FBBF24')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .delay((d, i) => 1500 + i * 300)
      .duration(300)
      .attr('r', 12);
      
    // Add pulsing effect to ongoing projects
    nodeGroups.filter(d => d.project.status === 'ongoing')
      .append('circle')
      .attr('r', 12)
      .attr('fill', '#FBBF24')
      .attr('stroke', 'none')
      .attr('opacity', 0.3)
      .style('pointer-events', 'none')
      .transition()
      .delay((d, i) => 1800 + i * 300)
      .duration(1500)
      .attr('r', 20)
      .attr('opacity', 0)
      .on('end', function repeat() {
        d3.select(this)
          .attr('r', 12)
          .attr('opacity', 0.3)
          .transition()
          .duration(1500)
          .attr('r', 25)
          .attr('opacity', 0)
          .on('end', repeat);
      });
      
    // Add connector lines with alternate placement (above/below)
    nodeGroups.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', (d, i) => i % 2 === 0 ? -60 : 60)
      .attr('stroke', '#60A5FA')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0)
      .transition()
      .delay((d, i) => 1800 + i * 300)
      .duration(300)
      .attr('opacity', 1);
      
    // Add project name text labels
    nodeGroups.append('text')
      .attr('x', 0)
      .attr('y', (d, i) => i % 2 === 0 ? -70 : 70)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => d.project.name)
      .transition()
      .delay((d, i) => 2000 + i * 300)
      .duration(300)
      .attr('opacity', 1);
      
    // Add period below/above the name
    nodeGroups.append('text')
      .attr('x', 0)
      .attr('y', (d, i) => i % 2 === 0 ? -90 : 90)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94A3B8')
      .attr('font-size', '12px')
      .attr('opacity', 0)
      .text(d => d.project.period)
      .transition()
      .delay((d, i) => 2200 + i * 300)
      .duration(300)
      .attr('opacity', 1);
      
    // Add interaction to nodes
    nodeGroups
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Highlight the node
        d3.select(this).select('circle:first-child')
          .transition()
          .duration(200)
          .attr('r', 15);
          
        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
          
        // Format technologies as badges
        const techBadges = d.project.technologies.map(tech => 
          `<span style="display:inline-block; background-color:rgba(96, 165, 250, 0.2); color:#93C5FD; padding:2px 6px; margin:2px; border-radius:4px; font-size:10px;">${tech}</span>`
        ).join(' ');
        
        // Create link button if available
        const linkButton = d.project.link 
          ? `<a href="${d.project.link}" target="_blank" style="display:inline-block; background-color:#3B82F6; color:white; padding:4px 8px; margin-top:8px; border-radius:4px; text-decoration:none; font-size:12px;">Visit Project →</a>`
          : '';
          
        // Status badge
        const statusBadge = `<span style="display:inline-block; background-color:${d.project.status === 'completed' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)'}; color:${d.project.status === 'completed' ? '#4ADE80' : '#FBBF24'}; padding:2px 6px; margin-bottom:6px; border-radius:4px; font-size:10px;">${d.project.status.toUpperCase()}</span>`;
        
        // Populate tooltip content
        tooltip.html(`
          ${statusBadge}
          <div style="font-weight:bold; margin-bottom:4px;">${d.project.name}</div>
          <div style="margin-bottom:6px; font-size:12px;">${d.project.period}</div>
          <div style="margin-bottom:8px; font-size:13px; line-height:1.4;">${d.project.description}</div>
          <div style="margin-bottom:6px;">${techBadges}</div>
          ${linkButton}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        // Reset the node
        d3.select(this).select('circle:first-child')
          .transition()
          .duration(200)
          .attr('r', 12);
          
        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .on('click', function(event, d) {
        // Open the link if available
        if (d.project.link) {
          window.open(d.project.link, '_blank');
        }
      });
      
    // Add legends for the node colors
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - 170}, 20)`);
      
    // Completed project legend
    const completedLegend = legendGroup.append('g');
    completedLegend.append('circle')
      .attr('r', 6)
      .attr('fill', '#4ADE80')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
      
    completedLegend.append('text')
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text('Completed');
      
    // Ongoing project legend
    const ongoingLegend = legendGroup.append('g')
      .attr('transform', 'translate(0, 20)');
      
    ongoingLegend.append('circle')
      .attr('r', 6)
      .attr('fill', '#FBBF24')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
      
    ongoingLegend.append('text')
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text('Ongoing');
    
    // Add a timeline label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('opacity', 0.7)
      .text('January 2025 → April 2025');
      
    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <section id="projects" className="min-h-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Project Milestones</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Exploring the projects that defined my journey at Finosauras,
          from conception to deployment.
        </p>
      </motion.div>

      <motion.div 
        className="chart-container max-w-6xl w-full mx-auto overflow-x-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <svg ref={svgRef}></svg>
      </motion.div>
    </section>
  );
};

export default ProjectTimeline; 