'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCss3Alt, faDocker, faGithub, faHtml5, faJs, faNodeJs, faPhp, faPython, faReact } from '@fortawesome/free-brands-svg-icons';
// @ts-ignore - Fix JSX namespace error
import { JSX } from 'react/jsx-runtime';
import { FaGithub, FaReact, FaDocker, FaAws, FaDatabase, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiMongodb, SiExpress } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

interface SkillData {
  name: string;
  icon: JSX.Element;
  initial: number;
  current: number;
  target: number;
  logoUrl?: string;
  color: string;
  categories: string[];
}

const SkillProgressionChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const skillBarsRef = useRef<THREE.Group | null>(null);
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hoverRef = useRef<THREE.Object3D | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const skills: SkillData[] = [
    {
      name: 'React',
      icon: <FaReact />,
      initial: 65,
      current: 85,
      target: 95,
      color: '#61DAFB',
      categories: ['Frontend']
    },
    {
      name: 'TypeScript',
      icon: <SiTypescript />,
      initial: 50,
      current: 80,
      target: 90,
      color: '#3178C6',
      categories: ['Languages']
    },
    {
      name: 'TailwindCSS',
      icon: <SiTailwindcss />,
      initial: 60,
      current: 90,
      target: 95,
      color: '#38B2AC',
      categories: ['Frontend']
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs />,
      initial: 70,
      current: 85,
      target: 90,
      color: '#68A063',
      categories: ['Backend']
    },
    {
      name: 'Express',
      icon: <SiExpress />,
      initial: 60,
      current: 80,
      target: 90,
      color: '#000000',
      categories: ['Backend']
    },
    {
      name: 'MongoDB',
      icon: <SiMongodb />,
      initial: 50,
      current: 75,
      target: 85,
      color: '#4DB33D',
      categories: ['Database']
    },
    {
      name: 'REST APIs',
      icon: <TbApi />,
      initial: 65,
      current: 85,
      target: 90,
      color: '#FF5733',
      categories: ['Backend']
    },
    {
      name: 'PostgreSQL',
      icon: <FaDatabase />,
      initial: 40,
      current: 65,
      target: 85,
      color: '#336791',
      categories: ['Database']
    },
    {
      name: 'Docker',
      icon: <FaDocker />,
      initial: 30,
      current: 70,
      target: 90,
      color: '#2496ED',
      categories: ['DevOps']
    },
    {
      name: 'AWS',
      icon: <FaAws />,
      initial: 20,
      current: 60,
      target: 85,
      color: '#FF9900',
      categories: ['DevOps']
    },
    {
      name: 'Git/GitHub',
      icon: <FaGithub />,
      initial: 75,
      current: 90,
      target: 95,
      color: '#181717',
      categories: ['Tools']
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x111827); // dark gray/blue background

    // Camera setup with dynamic FOV based on device
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const fov = isMobile ? 75 : 60; // Wider FOV for mobile
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 1000);
    camera.position.set(0, 40, isMobile ? 150 : 120);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
    controls.enablePan = false; // Disable panning for mobile simplicity
    controlsRef.current = controls;

    // Grid helper
    const gridHelper = new THREE.GridHelper(200, 20, 0x555555, 0x333333);
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3366ff, 1, 100);
    pointLight.position.set(-20, 30, 40);
    scene.add(pointLight);

    // Set up skill bars
    skillBarsRef.current = new THREE.Group();
    particleSystemsRef.current = [];

    const barWidth = isMobile ? 6 : 8;
    const spacing = isMobile ? 12 : 15;
    const startX = -((skills.length - 1) * spacing) / 2;

    skills.forEach((skill, index) => {
      const x = startX + index * spacing;
      
      // Base platform
      const platformGeometry = new THREE.BoxGeometry(barWidth + 1, 0.5, barWidth + 1);
      const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.2
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.set(x, 0, 0);
      platform.receiveShadow = true;
      skillBarsRef.current.add(platform);

      // Create all three bar segments with initial height of 0
      const createBar = (height: number, color: string, y: number) => {
        const barGeometry = new THREE.BoxGeometry(barWidth, height, barWidth);
        const barMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.8,
          roughness: 0.3,
          metalness: 0.7
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.set(x, y + height / 2, 0);
        bar.castShadow = true;
        bar.receiveShadow = true;
        bar.userData = { skillIndex: index };
        skillBarsRef.current.add(bar);
        return bar;
      };

      // Initial level bar (gray)
      const initialHeight = skill.initial * 0.25;
      createBar(initialHeight, '#666666', 0);

      // Current level bar (skill color)
      const currentHeight = (skill.current - skill.initial) * 0.25;
      const currentBar = createBar(0, skill.color, initialHeight);
      
      // Target level bar (lighter version of skill color)
      const targetColor = new THREE.Color(skill.color);
      targetColor.multiplyScalar(1.3); // Lighter version
      const targetBar = createBar(0, targetColor.getStyle(), initialHeight + currentHeight);

      // Add text label for each skill
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skill.name, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(10, 5, 1);
        label.position.set(x, -4, 0);
        skillBarsRef.current.add(label);
      }

      // Particles for each skill
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const skillColor = new THREE.Color(skill.color);
      
      for (let i = 0; i < particleCount; i++) {
        // Random positions around the bar
        const radius = 3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = x + radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = 0 + radius * Math.cos(phi) + Math.random() * 50;
        positions[i * 3 + 2] = 0 + radius * Math.sin(phi) * Math.sin(theta);
        
        // Random color variation
        colors[i * 3] = skillColor.r * (0.8 + Math.random() * 0.4);
        colors[i * 3 + 1] = skillColor.g * (0.8 + Math.random() * 0.4);
        colors[i * 3 + 2] = skillColor.b * (0.8 + Math.random() * 0.4);
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particles.visible = false; // Hide initially
      skillBarsRef.current.add(particles);
      particleSystemsRef.current.push(particles);

      // Animate the bars growing
      const animateCurrentBar = () => {
        let height = 0;
        const targetHeight = (skill.current - skill.initial) * 0.25;
        const animationDuration = 1500; // ms
        const startTime = Date.now();
        
        const animate = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / animationDuration, 1);
          height = progress * targetHeight;
          
          // Update geometry
          currentBar.geometry.dispose();
          currentBar.geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
          currentBar.position.y = initialHeight + height / 2;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // After current bar animation completes, animate target bar
            animateTargetBar();
          }
        };
        
        animate();
      };
      
      const animateTargetBar = () => {
        let height = 0;
        const initialHeight = skill.initial * 0.25;
        const currentHeight = (skill.current - skill.initial) * 0.25;
        const targetHeight = (skill.target - skill.current) * 0.25;
        const animationDuration = 1500; // ms
        const startTime = Date.now();
        
        const animate = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / animationDuration, 1);
          height = progress * targetHeight;
          
          // Update geometry
          targetBar.geometry.dispose();
          targetBar.geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
          targetBar.position.y = initialHeight + currentHeight + height / 2;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      };
      
      // Delay each bar's animation based on its index
      setTimeout(() => {
        animateCurrentBar();
      }, index * 200 + 500);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate particles
      particleSystemsRef.current.forEach(particles => {
        if (particles.visible) {
          const positions = particles.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            // Move particles upward
            positions[i + 1] += 0.05;
            
            // Reset particles that go too high
            if (positions[i + 1] > 60) {
              positions[i + 1] = Math.random() * 5;
            }
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Hide loading state after initialization
    setTimeout(() => setIsLoading(false), 1000);

    // Clean up
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials
      skillBarsRef.current.children.forEach(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      });
      
      particleSystemsRef.current.forEach(particles => {
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material instanceof THREE.Material) particles.material.dispose();
      });
      
      scene.clear();
    };
  }, [isMobile]);

  // Handle mouse/touch movement for highlighting and tooltips
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      checkIntersection();
    };
    
    const handleTouchStart = (event: TouchEvent) => {
      if (!containerRef.current) return;
      
      // Store the initial touch position
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      // Prevent default to avoid scrolling while interacting with the chart
      event.preventDefault();
      
      if (!containerRef.current || !sceneRef.current || !cameraRef.current || !touchStartRef.current) return;
      
      const touch = event.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((touch.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((touch.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      // Calculate drag distance
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);
      
      // Only check for intersections if drag distance is small (user is tapping, not dragging)
      if (dragDistance < 20) {
        checkIntersection();
      }
    };
    
    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };
    
    const checkIntersection = () => {
      if (!sceneRef.current || !cameraRef.current || skillBarsRef.current.children.length === 0) return;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(skillBarsRef.current.children);
      
      // Reset particle systems visibility
      particleSystemsRef.current.forEach(particles => {
        particles.visible = false;
      });
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const skillIndex = intersectedObject.userData.skillIndex;
        
        if (skillIndex !== undefined) {
          setHoveredSkill(skills[skillIndex]);
          
          // Show particles for the hovered skill
          if (particleSystemsRef.current[skillIndex]) {
            particleSystemsRef.current[skillIndex].visible = true;
          }
          
          // Position tooltip near the cursor
          if (tooltipRef.current) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              const x = (mouseRef.current.x + 1) / 2 * rect.width;
              const y = (1 - (mouseRef.current.y + 1) / 2) * rect.height;
              
              tooltipRef.current.style.left = `${x}px`;
              tooltipRef.current.style.top = `${y - 100}px`;
            }
          }
        }
      } else {
        setHoveredSkill(null);
      }
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
      containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
      containerRef.current.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
        containerRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [skills]);

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-100">Skill Progression</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Visualizing my technical growth journey at Finosauras, showing initial skill levels, 
          current proficiencies, and target goals.
        </p>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`w-full rounded-xl overflow-hidden ${isLoading ? 'hidden' : 'block'}`}
        style={{ height: isMobile ? '400px' : '500px' }}
      >
        {/* Tooltip for showing skill details */}
        {hoveredSkill && (
          <div
            ref={tooltipRef}
            className="absolute bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg z-10 text-white w-48 transform -translate-x-1/2"
            style={{ 
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2" style={{ color: hoveredSkill.color }}>
                {hoveredSkill.icon}
              </span>
              <h3 className="font-bold">{hoveredSkill.name}</h3>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <p className="text-gray-400">Initial</p>
                <p className="font-semibold">{hoveredSkill.initial}%</p>
              </div>
              <div>
                <p className="text-gray-400">Current</p>
                <p className="font-semibold">{hoveredSkill.current}%</p>
              </div>
              <div>
                <p className="text-gray-400">Target</p>
                <p className="font-semibold">{hoveredSkill.target}%</p>
              </div>
            </div>
            <div className="mt-1">
              <p className="text-gray-400 text-xs">Growth</p>
              <p className="text-green-400 font-semibold">+{hoveredSkill.current - hoveredSkill.initial}%</p>
            </div>
          </div>
        )}
        
        {/* Instructions overlay */}
        <div className={`absolute bottom-4 left-4 bg-gray-900/70 backdrop-blur-sm p-2 rounded-lg text-white text-xs ${isLoading ? 'hidden' : 'block'}`}>
          <p className="font-semibold mb-1">{isMobile ? 'Touch' : 'Mouse'} Controls:</p>
          <p>• {isMobile ? 'Drag' : 'Click + Drag'} to rotate view</p>
          <p>• {isMobile ? 'Pinch' : 'Scroll'} to zoom in/out</p>
          <p>• {isMobile ? 'Tap' : 'Hover over'} bars for details</p>
        </div>
      </div>
      
      <div className="mt-4 px-4 overflow-x-auto">
        <div className="flex space-x-2 min-w-max justify-center">
          {['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Languages', 'Tools'].map((category) => (
            <span 
              key={category}
              className="inline-block px-3 py-1 text-xs sm:text-sm rounded-full bg-gray-800 text-gray-300"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        <p>Chart Legend: Gray – Initial Level | Colored – Current Level | Light Colored – Target Level</p>
      </div>
    </motion.div>
  );
};

export default SkillProgressionChart;