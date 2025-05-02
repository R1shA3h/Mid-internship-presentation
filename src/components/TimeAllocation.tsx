'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface TimeData {
  label: string;
  value: number;
  color: string;
}

const TimeAllocation = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Ensure tooltip div exists (create if it doesn't)
    if (!tooltipRef.current) {
      tooltipRef.current = d3.select('body')
        .append('div')
        .attr('class', 'd3-tooltip time-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(10, 17, 40, 0.9)')
        .style('border-radius', '6px')
        .style('color', '#ECEFF4')
        .style('font-size', '13px')
        .style('pointer-events', 'none')
        .node();
    }
    const tooltip = d3.select(tooltipRef.current);

    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Updated color palette (Nord-inspired)
    const colors = ["#5E81AC", "#88C0D0", "#B48EAD", "#A3BE8C"];
    const data: TimeData[] = [
      { label: 'Building/Tasks', value: 50, color: colors[0] }, 
      { label: 'Maintenance', value: 20, color: colors[1] },   
      { label: 'Learning', value: 20, color: colors[2] },      
      { label: 'Helping Team', value: 10, color: colors[3] }  
    ];

    // Dimensions - Increased size slightly for labels
    const width = 450; // Increased width
    const height = 450; // Increased height
    const margin = 60; // Increased margin to give labels space
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.6;
    const labelRadius = radius * 1.25; // Pushed labels further out

    // Create SVG - Adjusted viewBox slightly
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; overflow: visible;'); // Allow overflow for labels
      
    const chartGroup = svg.append('g');

    // Pie and Arc generators
    const pie = d3.pie<TimeData>()
      .value(d => d.value)
      .sort(null);

    const arcGenerator = d3.arc<d3.PieArcDatum<TimeData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);
      
    const outerArcGenerator = d3.arc<d3.PieArcDatum<TimeData>>()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    // Tooltip functions
    const mouseover = (event: MouseEvent, d: d3.PieArcDatum<TimeData>) => {
      tooltip.style('visibility', 'visible');
      const currentElement = d3.select(event.currentTarget as SVGPathElement);
      const originalColor = d3.color(d.data.color);
      currentElement
        .transition()
        .duration(150)
        .attr('transform', 'scale(1.04)')
        .attr('fill', originalColor ? originalColor.brighter(0.5).formatHex() : d.data.color);
    };
    const mousemove = (event: MouseEvent, d: d3.PieArcDatum<TimeData>) => {
      tooltip
        .html(`<strong>${d.data.label}:</strong> ${d.data.value}%`)
        .style('top', (event.pageY - 15) + 'px')
        .style('left', (event.pageX + 15) + 'px');
    };
    const mouseout = (event: MouseEvent, d: d3.PieArcDatum<TimeData>) => {
      tooltip.style('visibility', 'hidden');
      d3.select(event.currentTarget as SVGPathElement)
        .transition()
        .duration(150)
        .attr('transform', 'scale(1)')
        .attr('fill', d.data.color);
    };

    // Create the donut slices
    const slices = chartGroup.selectAll('path.slice')
      .data(pie(data))
      .join('path')
      .attr('class', 'slice')
      .attr('fill', d => d.data.color)
      .attr('stroke', '#0A1128')
      .style('stroke-width', '2px')
      .style('opacity', 0.9)
      .style('cursor', 'pointer')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    // Animate the chart drawing
    slices
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attrTween('d', function(d) {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function(t) { 
            const interpolated = i(t);
            return arcGenerator(interpolated) ?? ''; 
          };
      });

    // Add labels with lines
    const labelsGroup = chartGroup.append('g').attr('class', 'labels');
    const linesGroup = chartGroup.append('g').attr('class', 'lines');

    labelsGroup.selectAll('text')
      .data(pie(data))
      .join('text')
      .attr('dy', ".35em")
      .style('opacity', 0)
      .style('font-size', '13px')
      .style('fill', '#E5E7EB')
      .html(d => {
        return `<tspan x="0" style="font-weight: 600;">${d.data.label}</tspan><tspan x="0" dy="1.3em">(${d.data.value}%)</tspan>`;
      })
      .attr('transform', d => {
        const pos = outerArcGenerator.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.2 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midangle < Math.PI ? 'start' : 'end');
      })
      .transition()
      .duration(500)
      .delay(1000)
      .style('opacity', 1);

    // Add polyline connectors
    linesGroup.selectAll('polyline')
      .data(pie(data))
      .join('polyline')
      .style('opacity', 0)
      .attr('stroke', '#6B7280')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', d => {
        const posA = arcGenerator.centroid(d); 
        const posB = outerArcGenerator.centroid(d); 
        const posC = outerArcGenerator.centroid(d); 
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 1.15 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC].map(p => p.join(',')).join(' ');
      })
      .transition()
      .duration(500)
      .delay(1000)
      .style('opacity', 0.6);

    // Add central text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '28px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .attr('y', -12)
      .text('500+');
      
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '18px')
      .style('fill', '#D1D5DB')
      .attr('y', 18)
      .text('Hours');

    // Cleanup function
    return () => {
      d3.select('.d3-tooltip.time-tooltip').remove();
      tooltipRef.current = null;
    };
  }, []);

  return (
    <section id="time-allocation" className="min-h-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-blue-900 text-white">
      <motion.div 
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">My 500+ Hour Finosauras Sprint</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          A breakdown of how I invested my time during the first four months, balancing new development, maintenance, learning, and team collaboration.
        </p>
      </motion.div>

      <motion.div 
        className="chart-container max-w-xl w-full bg-gray-800 bg-opacity-30 backdrop-blur-md p-16 rounded-xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <svg ref={chartRef}></svg>
      </motion.div>
    </section>
  );
};

export default TimeAllocation; 