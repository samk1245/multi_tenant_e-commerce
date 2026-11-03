import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHeroCanvas({ tenantTheme }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 0.5;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // Fallback gracefully if WebGL is unsupported
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting with Dynamic Tenant Theme Color
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const primaryHex = tenantTheme?.primaryColor || '#10b981';
    const pointLight = new THREE.PointLight(primaryHex, 3, 20);
    pointLight.position.set(-4, 3, 3);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(tenantTheme?.accentColor || '#6366f1', 2.5, 20);
    accentLight.position.set(4, -3, 2);
    scene.add(accentLight);

    // 3. Central 3D Floating Geometry (Multi-Faceted Floating Jewel / Shopping Icon Cube)
    const group = new THREE.Group();
    scene.add(group);

    // Central Icosahedron Crystal
    const crystalGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: primaryHex,
      emissive: 0x051515,
      metalness: 0.15,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 1.2,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const mainMesh = new THREE.Mesh(crystalGeo, crystalMat);
    group.add(mainMesh);

    // Surrounding Floating Orbiting Rings (representing Multi-Tenant E-Commerce Orbit)
    const ringGeo1 = new THREE.TorusGeometry(2.5, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
      opacity: 0.6,
      transparent: true,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.0, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: tenantTheme?.accentColor || '#818cf8',
      metalness: 0.9,
      roughness: 0.1,
      opacity: 0.5,
      transparent: true,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 3;
    group.add(ring2);

    // Floating 3D Micro-Cubes / Spheres in Orbit
    const satellites = [];
    const satCount = 6;
    for (let i = 0; i < satCount; i++) {
      const satGeo = i % 2 === 0 ? new THREE.OctahedronGeometry(0.25, 0) : new THREE.SphereGeometry(0.2, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffffff : primaryHex,
        metalness: 0.7,
        roughness: 0.2,
        emissive: i % 2 === 0 ? 0x222222 : 0x0a2218,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.4 + (i % 2) * 0.6;
      satMesh.position.set(Math.cos(angle) * radius, (Math.sin(angle * 2) * 0.8), Math.sin(angle) * radius);
      group.add(satMesh);
      satellites.push({ mesh: satMesh, angle, radius, speed: 0.015 + (i * 0.003) });
    }

    // 4. Volumetric Ambient Particle Field
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interactive Mouse Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Observer
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation
      group.rotation.y = elapsedTime * 0.25 + mouseX;
      group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 - mouseY;
      group.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

      // Rings differential spin
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.y = -elapsedTime * 0.28;

      // Orbiting satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2.5 + elapsedTime) * 0.6;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [tenantTheme]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-hidden"
    />
  );
}
