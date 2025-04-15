'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const logoMeshRef = useRef<THREE.Mesh | null>(null); // Ref for the logo mesh
  const mouse = useRef(new THREE.Vector2());
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20; // Moved camera slightly back
    cameraRef.current = camera;

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for pixel density
    renderer.setClearColor(0x000000, 0); 
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct way to set color space
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000; // Increased particle count for denser field
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Enhanced color palette
    const colorOptions = [
      new THREE.Color(0x5E81AC), // Nord Blue
      new THREE.Color(0x88C0D0), // Nord Frost Blue
      new THREE.Color(0x8FBCBB), // Nord Frost Teal
      new THREE.Color(0xB48EAD), // Nord Purple
      new THREE.Color(0xBF616A), // Nord Red (subtle accent)
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a wider, slightly deeper volume
      const radius = 30 * Math.random() + 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos((2 * Math.random()) - 1); // Distribute more evenly on a sphere slice

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // X
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // Y 
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.3; // Z (reduced depth)
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true, // Make particles smaller further away
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false, // Improves blending
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // --- Logo Plane --- 
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/F_logo.png', // Path to your logo in the public folder
      (texture) => {
        // Ensure texture settings are optimal for transparency
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const logoMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.15, // Increased opacity for better visibility
          depthWrite: false, // Render after particles typically
          side: THREE.DoubleSide, // Ensure visible if rotated
        });

        // Adjust plane size based on logo aspect ratio (assuming square for simplicity, adjust if needed)
        const logoSize = 12; // Slightly larger logo
        const logoGeometry = new THREE.PlaneGeometry(logoSize, logoSize);
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        
        logoMesh.position.z = -8; // Position further back to avoid overpowering text
        logoMeshRef.current = logoMesh;
        scene.add(logoMesh);
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error('Error loading logo texture:', error);
      }
    );
    // --- End Logo Plane ---

    // Mouse move listener
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update target rotation based on mouse position
      targetRotation.current.y = mouse.current.x * 0.08; // Slightly reduce mouse effect
      targetRotation.current.x = mouse.current.y * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      if (particleSystemRef.current) {
        // Smoothly interpolate current rotation towards target rotation (damping)
        particleSystemRef.current.rotation.x += (targetRotation.current.x - particleSystemRef.current.rotation.x) * 0.05;
        particleSystemRef.current.rotation.y += (targetRotation.current.y - particleSystemRef.current.rotation.y) * 0.05;
        // Keep a slow constant rotation as well
        particleSystemRef.current.rotation.z = elapsedTime * 0.04;
      }
      
      // Animate logo
      if (logoMeshRef.current) {
        logoMeshRef.current.rotation.z = elapsedTime * 0.06; // Slow rotation
        logoMeshRef.current.rotation.x = elapsedTime * 0.02;
      }
      
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      // Dispose Three.js objects
      particlesGeometry.dispose();
      particleMaterial.dispose();
      logoMeshRef.current?.geometry.dispose();
      (logoMeshRef.current?.material as THREE.Material)?.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Three.js container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 opacity-70" 
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-black/50 to-black/75"></div>
      
      {/* Content overlay - Simplified Structure */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-full sm:max-w-5xl flex flex-col items-center"> 

        {/* Large Quote */}
        <motion.blockquote
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-4 sm:mb-6 max-w-4xl mx-auto drop-shadow-lg leading-tight font-serif"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          &quot;The best way to predict the future is to invent it.&quot;
        </motion.blockquote>
        
        {/* Designation */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-blue-300 mb-6 sm:mb-10 tracking-wider font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Software Engineering Intern @ Finosauras
        </motion.p>
        
        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.8, duration: 0.8 }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 font-sans text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            onClick={() => document.getElementById('time-allocation')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore My Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 