'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion } from 'framer-motion';

interface SkillData {
  name: string;
  icon: string;
  initial: number;
  current: number;
  target: number;
  logoUrl: string;
  color?: string;
  categories?: string[];
}

const SkillProgressionChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillData | null>(null);
  const [interactionText, setInteractionText] = useState<string>('');
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const barObjectsRef = useRef<THREE.Mesh[][]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Enhanced skill data with online logo URLs and categories
  const skills: SkillData[] = [
    { 
      name: 'Node.js', 
      icon: '/icons/nodejs.svg', 
      initial: 5, 
      current: 8, 
      target: 10,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg',
      color: '#3C873A',
      categories: ['Backend', 'JavaScript']
    },
    { 
      name: 'Next.js', 
      icon: '/icons/nextjs.svg', 
      initial: 5, 
      current: 9, 
      target: 10,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/next-js.svg',
      color: '#FFFFFF',
      categories: ['Frontend', 'JavaScript']
    },
    { 
      name: 'MongoDB', 
      icon: '/icons/mongodb.svg', 
      initial: 3, 
      current: 7, 
      target: 10,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg',
      color: '#4DB33D',
      categories: ['Database', 'NoSQL']
    },
    { 
      name: 'Python', 
      icon: '/icons/python.svg', 
      initial: 2.7, 
      current: 7, 
      target: 10,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/python-5.svg',
      color: '#366B98',
      categories: ['Backend', 'Data Science']
    },
    { 
      name: 'REST APIs', 
      icon: '/icons/api.svg', 
      initial: 4, 
      current: 8, 
      target: 10,
      logoUrl: 'https://cdn3.iconfinder.com/data/icons/technology-1-1/512/technology-machine-electronic-device-09-512.png',
      color: '#FF5733',
      categories: ['Backend', 'Web']
    },
    { 
      name: 'CI/CD', 
      icon: '/icons/cicd.svg', 
      initial: 2, 
      current: 6, 
      target: 9,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/gitlab-1.svg',
      color: '#FC6D26',
      categories: ['DevOps', 'Automation']
    },
    { 
      name: 'AWS', 
      icon: '/icons/aws.svg', 
      initial: 3, 
      current: 4, 
      target: 9,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg',
      color: '#FF9900',
      categories: ['Cloud', 'DevOps']
    },
    { 
      name: 'DevOps', 
      icon: '/icons/devops.svg', 
      initial: 2, 
      current: 7, 
      target: 10,
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/devops-2.svg',
      color: '#0DB7ED',
      categories: ['DevOps', 'Automation']
    },
  ];

  useEffect(() => {
    // Set the interaction text based on device capabilities
    // This prevents hydration mismatch as it only runs client-side
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setInteractionText('Swipe to rotate | Pinch to zoom');
    } else {
      setInteractionText('Click and drag to rotate | Scroll to zoom');
    }

    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#161a2c');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 15, 30);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 15;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add spotlight for dramatic effect
    const spotlight = new THREE.SpotLight(0x4682b4, 3);
    spotlight.position.set(0, 30, 0);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 100;
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);

    // Enhanced environment
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x202040, 0.8);
    scene.add(hemiLight);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Create bars
    const barWidth = 1;
    const barDepth = 1;
    const platformSize = 1.5;
    const spacing = 4;
    const startX = -((skills.length - 1) * spacing) / 2;

    const textureLoader = new THREE.TextureLoader();
    
    // Base materials for each segment (will be customized per skill)
    // Improved contrasting colors
    const initialMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x242936, // Even darker for better contrast
      shininess: 60,
      specular: 0x111111 
    });
    
    const currentMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4C6B99, // Adjusted blue for higher contrast
      shininess: 80,
      specular: 0x222222
    });
    
    const targetMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x89C4FF, // Brighter blue for target
      shininess: 100,
      specular: 0x333333,
      transparent: true,
      opacity: 0.85
    });

    const barObjects: THREE.Mesh[][] = [];

    // Create base plane
    const baseGeometry = new THREE.PlaneGeometry(40, 40);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a2e,
      side: THREE.DoubleSide,
      shininess: 0
    });
    const basePlane = new THREE.Mesh(baseGeometry, baseMaterial);
    basePlane.rotation.x = -Math.PI / 2;
    basePlane.position.y = -0.01; // Slightly below grid to avoid z-fighting
    basePlane.receiveShadow = true;
    scene.add(basePlane);

    // Create square platform under each bar
    skills.forEach((skill, index) => {
      const x = startX + index * spacing;
      
      // Add square platform for cuboidal bars
      const platformGeometry = new THREE.BoxGeometry(platformSize, 0.1, platformSize);
      const platformMaterial = new THREE.MeshPhongMaterial({
        color: skill.color ? new THREE.Color(skill.color).multiplyScalar(0.7) : 0x333344,
        shininess: 80
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.set(x, 0.05, 0);
      platform.castShadow = true;
      platform.receiveShadow = true;
      scene.add(platform);
    });

    // Create cuboidal bars for each skill
    skills.forEach((skill, index) => {
      const x = startX + index * spacing;
      const barSegments: THREE.Mesh[] = [];
      
      // Create custom materials using skill colors with higher contrast
      const skillInitialMaterial = new THREE.MeshPhongMaterial({
        color: skill.color ? new THREE.Color(skill.color).multiplyScalar(0.4) : initialMaterial.color, // Darker for better contrast
        shininess: 60,
        specular: 0x333333
      });
      
      const skillCurrentMaterial = new THREE.MeshPhongMaterial({
        color: skill.color ? new THREE.Color(skill.color) : currentMaterial.color, // Full color for current level
        shininess: 80,
        specular: 0x444444
      });
      
      const skillTargetMaterial = new THREE.MeshPhongMaterial({
        color: skill.color ? new THREE.Color(skill.color).multiplyScalar(1.3) : targetMaterial.color, // Brighter for target
        shininess: 100,
        specular: 0x555555,
        transparent: true,
        opacity: 0.85
      });
      
      // Add edge materials for better segment distinction
      const edgeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
      });
      
      // Initial skill level - using BoxGeometry (cuboidal shape)
      if (skill.initial > 0) {
        const initialHeight = skill.initial;
        // Add a small reduction to create visual gaps between segments
        const initialGeometry = new THREE.BoxGeometry(barWidth, initialHeight * 0.95, barDepth);
        const initialBar = new THREE.Mesh(initialGeometry, skillInitialMaterial);
        initialBar.position.set(x, initialHeight / 2 * 0.95, 0);
        initialBar.castShadow = true;
        initialBar.receiveShadow = true;
        initialBar.userData = { skillName: skill.name, segment: 'initial', skill };
        scene.add(initialBar);
        barSegments.push(initialBar);
        
        // Add thin edge highlight on top of initial segment
        const edgeGeometry = new THREE.BoxGeometry(barWidth + 0.05, 0.08, barDepth + 0.05);
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.set(x, initialHeight, 0);
        scene.add(edge);
      }

      // Current growth segment - using BoxGeometry (cuboidal shape)
      if (skill.current > skill.initial) {
        const currentGrowthHeight = skill.current - skill.initial;
        // Add a small reduction to create visual gaps between segments
        const currentGeometry = new THREE.BoxGeometry(barWidth, currentGrowthHeight * 0.95, barDepth);
        const currentBar = new THREE.Mesh(currentGeometry, skillCurrentMaterial);
        const yPos = skill.initial + currentGrowthHeight / 2 * 0.95;
        // Position up a bit to create a visible gap
        currentBar.position.set(x, yPos + 0.1, 0);
        currentBar.castShadow = true;
        currentBar.receiveShadow = true;
        currentBar.userData = { skillName: skill.name, segment: 'current', skill };
        scene.add(currentBar);
        barSegments.push(currentBar);
        
        // Add thin edge highlight on top of current segment
        const edgeGeometry = new THREE.BoxGeometry(barWidth + 0.05, 0.08, barDepth + 0.05);
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.set(x, skill.current, 0);
        scene.add(edge);
      }

      // Target growth segment - using BoxGeometry (cuboidal shape)
      if (skill.target > skill.current) {
        const targetGrowthHeight = skill.target - skill.current;
        // Add a small reduction to create visual gaps between segments
        const targetGeometry = new THREE.BoxGeometry(barWidth, targetGrowthHeight * 0.95, barDepth);
        const targetBar = new THREE.Mesh(targetGeometry, skillTargetMaterial);
        const yPos = skill.current + targetGrowthHeight / 2 * 0.95;
        // Position up a bit to create a visible gap
        targetBar.position.set(x, yPos + 0.1, 0);
        targetBar.castShadow = true;
        targetBar.receiveShadow = true;
        targetBar.userData = { skillName: skill.name, segment: 'target', skill };
        scene.add(targetBar);
        barSegments.push(targetBar);
        
        // Add thin edge highlight on top of target segment
        const edgeGeometry = new THREE.BoxGeometry(barWidth + 0.05, 0.08, barDepth + 0.05);
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.set(x, skill.target, 0);
        scene.add(edge);
      }

      barObjects.push(barSegments);

      // Add floating particles around target area
      if (skill.target > skill.current) {
        const particleCount = 10;
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: skill.color || 0x88C0D0,
          transparent: true,
          opacity: 0.7
        });
        
        for (let i = 0; i < particleCount; i++) {
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          const angle = (i / particleCount) * Math.PI * 2;
          const radius = barWidth * 0.8;
          
          particle.position.set(
            x + Math.cos(angle) * radius,
            skill.current + Math.random() * (skill.target - skill.current),
            Math.sin(angle) * radius
          );
          
          scene.add(particle);
          
          // Animate particles
          const animateParticle = () => {
            const time = Date.now() * 0.001;
            particle.position.x = x + Math.cos(angle + time) * radius;
            particle.position.z = Math.sin(angle + time) * radius;
            requestAnimationFrame(animateParticle);
          };
          
          animateParticle();
        }
      }

      // Load and add 3D box-shaped logo above each bar with enhanced 3D effect
      textureLoader.load(skill.logoUrl, (texture) => {
        // Create actual 3D cube with logo on all sides
        const cubeSize = 1.5;
        const logoGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        
        // Create materials for all 6 sides of the cube
        const materials = [];
        for (let i = 0; i < 6; i++) {
          materials.push(new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.2,
            metalness: 0.4,
            roughness: 0.6
          }));
        }
        
        const logo = new THREE.Mesh(logoGeometry, materials);
        
        // Position logo above the bar
        logo.position.set(x, skill.target + 2, 0);
        scene.add(logo);
        
        // Add enhanced glow effect behind logo
        const glowGeometry = new THREE.SphereGeometry(cubeSize * 0.9, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: skill.color || 0x88C0D0,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(logo.position);
        scene.add(glow);
        
        // Add subtle shadow beneath logo for better depth perception
        const shadowGeometry = new THREE.CircleGeometry(cubeSize * 0.7, 16);
        const shadowMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide
        });
        
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.position.set(x, skill.target + 0.1, 0);
        shadow.rotation.x = -Math.PI / 2;
        scene.add(shadow);
        
        // Animate logo to float and rotate with more pronounced 3D movement
        const animateLogo = () => {
          const time = Date.now() * 0.001;
          logo.position.y = skill.target + 2 + Math.sin(time) * 0.4;
          logo.rotation.y += 0.008; // Faster rotation
          logo.rotation.x = Math.sin(time * 0.5) * 0.2; // More pronounced tilt
          glow.position.copy(logo.position);
          
          // Update shadow position to follow logo
          shadow.position.x = x + Math.sin(time * 0.5) * 0.1;
          shadow.position.z = Math.cos(time * 0.5) * 0.1;
          shadow.scale.set(
            1 + Math.sin(time) * 0.05, 
            1 + Math.sin(time) * 0.05, 
            1
          );
          
          requestAnimationFrame(animateLogo);
        };
        
        animateLogo();
        
        // Add skill name floating below the bar
        const textCanvas = document.createElement('canvas');
        const context = textCanvas.getContext('2d');
        textCanvas.width = 256;
        textCanvas.height = 64;
        
        if (context) {
          context.fillStyle = '#ffffff';
          context.font = 'bold 28px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(skill.name, 128, 32);
          
          const textTexture = new THREE.CanvasTexture(textCanvas);
          const textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            side: THREE.DoubleSide
          });
          
          const textGeometry = new THREE.PlaneGeometry(3, 0.8);
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(x, -0.6, 0);
          textMesh.rotation.x = -Math.PI / 4;
          scene.add(textMesh);
        }
      });
    });

    barObjectsRef.current = barObjects;

    // Animation setup - scale bars from 0 to full height with staggered timing
    barObjects.forEach((segments, barIndex) => {
      segments.forEach((mesh, segmentIndex) => {
        const originalScaleY = mesh.scale.y;
        mesh.scale.y = 0;
        
        // Create animation using GSAP-like approach
        let startTime = Date.now();
        const baseDelay = 300; // ms
        const delay = barIndex * 150 + segmentIndex * 300; // Staggered delay
        const duration = 1500 + segmentIndex * 300; // Longer duration for higher segments
        
        const animateBar = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          
          // Easing function (cubic ease out)
          const easeOutCubic = (t: number) => {
            return 1 - Math.pow(1 - t, 3);
          };
          
          const scale = Math.min(elapsed / duration, 1);
          mesh.scale.y = easeOutCubic(scale) * originalScaleY;
          
          if (scale < 1) {
            requestAnimationFrame(animateBar);
          }
        };
        
        setTimeout(() => {
          startTime = Date.now();
          animateBar();
        }, baseDelay + delay); // Staggered delay
      });
    });

    // Mouse interaction for selecting bars
    const raycaster = raycasterRef.current;
    const mouse = mouseRef.current;

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(barObjects.flat());
      
      // Reset all bars to original color
      barObjects.flat().forEach(bar => {
        const material = bar.material as THREE.MeshPhongMaterial;
        material.emissive.set(0x000000);
      });
      
      if (intersects.length > 0) {
        // Highlight the hovered bar
        const hoveredBar = intersects[0].object as THREE.Mesh;
        const material = hoveredBar.material as THREE.MeshPhongMaterial;
        material.emissive.set(0x334455);
        
        // Set the hovered skill for tooltip display
        setHoveredSkill(hoveredBar.userData.skill);
        
        // Highlight all segments of the same bar
        barObjects.flat().forEach(bar => {
          if (bar.userData.skillName === hoveredBar.userData.skillName) {
            const barMaterial = bar.material as THREE.MeshPhongMaterial;
            barMaterial.emissive.set(0x334455);
          }
        });
      } else {
        setHoveredSkill(null);
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    // Add particle system in background
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 60;
      particlePositions[i3 + 1] = Math.random() * 40;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 60;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x8888ff,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Animate particles
    const animateParticles = () => {
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += 0.01 + Math.random() * 0.01;
        
        // Reset particles that go too high
        if (positions[i3 + 1] > 40) {
          positions[i3 + 1] = 0;
        }
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Rotate scene slightly for subtle movement
      if (sceneRef.current && !hoveredSkill) {
        sceneRef.current.rotation.y = Math.sin(Date.now() * 0.0001) * 0.1;
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      // Dispose of geometries and materials
      barObjects.flat().forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <section id="skills" className="min-h-screen py-20 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <motion.div
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">My Skill Progression</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Interactive 3D visualization of my proficiency growth across key technologies.
        </p>
      </motion.div>

      <motion.div
        className="chart-container w-full max-w-5xl mx-auto bg-gray-800 bg-opacity-30 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div ref={containerRef} className="w-full h-[600px] rounded-lg"></div>
        
        {hoveredSkill && (
          <div className="absolute bg-gray-900 bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700 text-white z-10"
               style={{ 
                 left: `${mouseRef.current.x * 50 + 50}%`, 
                 top: `${mouseRef.current.y * 50 + 50}%`,
                 transform: 'translate(10px, 10px)'
               }}
          >
            <div className="font-bold text-lg mb-2" style={{ color: hoveredSkill.color || '#ffffff' }}>{hoveredSkill.name}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="text-gray-300">Initial:</div>
              <div className="font-medium">{hoveredSkill.initial}/10</div>
              <div className="text-gray-300">Current:</div>
              <div className="font-medium">{hoveredSkill.current}/10</div>
              <div className="text-gray-300">Target:</div>
              <div className="font-medium">{hoveredSkill.target}/10</div>
              {hoveredSkill.categories && (
                <>
                  <div className="text-gray-300">Categories:</div>
                  <div className="font-medium">{hoveredSkill.categories.join(', ')}</div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Better aligned and styled legend */}
        <div className="absolute top-6 right-6 bg-gray-900 bg-opacity-80 backdrop-blur-sm p-4 rounded-lg border border-blue-900 shadow-xl">
          <div className="text-sm font-bold text-white mb-3 border-b border-blue-800 pb-1">Skill Level Legend</div>
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 bg-[#242936] mr-3 shadow-md rounded-sm"></div>
            <span className="text-sm text-white">Initial Level</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 bg-[#4C6B99] mr-3 shadow-md rounded-sm"></div>
            <span className="text-sm text-white">Current Growth</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-[#89C4FF] mr-3 shadow-md rounded-sm"></div>
            <span className="text-sm text-white">Target Growth</span>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 text-sm text-white bg-gray-900 bg-opacity-80 backdrop-blur-sm p-2 rounded-lg">
          {interactionText && <p>{interactionText}</p>}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillProgressionChart;