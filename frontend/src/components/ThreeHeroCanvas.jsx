import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHeroCanvas({ tenantTheme }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;
    camera.position.y = 0.4;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // Fallback gracefully if WebGL is unsupported
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    currentMount.appendChild(renderer.domElement);

    // 2. Dynamic Lighting based on Tenant Theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const primaryHex = tenantTheme?.primaryColor || '#8b5cf6';
    const accentHex = tenantTheme?.accentColor || '#06b6d4';

    const pointLightPrimary = new THREE.PointLight(primaryHex, 3.5, 25);
    pointLightPrimary.position.set(-4, 3, 3);
    scene.add(pointLightPrimary);

    const pointLightAccent = new THREE.PointLight(accentHex, 3.0, 25);
    pointLightAccent.position.set(4, -3, 2);
    scene.add(pointLightAccent);

    // 3. Central Interactive Floating Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // A. Central Futuristic Holographic Crystal (Icosahedron)
    const crystalGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: primaryHex,
      emissive: 0x0a0a18,
      metalness: 0.25,
      roughness: 0.1,
      transmission: 0.75,
      thickness: 1.4,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const mainCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    mainGroup.add(mainCrystal);

    // B. Inner Wireframe Core for depth
    const innerWireGeo = new THREE.IcosahedronGeometry(1.1, 0);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    mainGroup.add(innerWire);

    // C. Floating 3D Metallic Credit Card / Vault Token
    const cardGroup = new THREE.Group();
    const cardGeo = new THREE.BoxGeometry(1.4, 0.85, 0.04);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x11131f,
      metalness: 0.9,
      roughness: 0.2,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardGroup.add(cardMesh);

    // Holographic Chip on Card
    const chipGeo = new THREE.BoxGeometry(0.25, 0.2, 0.05);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1,
    });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(-0.35, 0.1, 0.01);
    cardGroup.add(chipMesh);

    cardGroup.position.set(2.2, 0.8, 0.6);
    cardGroup.rotation.set(0.3, -0.4, 0.2);
    mainGroup.add(cardGroup);

    // D. Floating Cyber Capsule (representing luxury cosmetics / audio tech)
    const capsuleGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.9, 24);
    const capsuleMat = new THREE.MeshStandardMaterial({
      color: 0x242838,
      metalness: 0.85,
      roughness: 0.15,
    });
    const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
    capsuleMesh.position.set(-2.3, -0.7, 0.5);
    capsuleMesh.rotation.set(-0.4, 0.5, 0.6);
    mainGroup.add(capsuleMesh);

    // E. Dual Orbiting Astrolabe / Commerce Rings
    const ringGeo1 = new THREE.TorusGeometry(2.6, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.025, 16, 120);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: accentHex,
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.55,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 3;
    mainGroup.add(ring2);

    // F. Orbiting Satellites (Jewels, tokens, spheres)
    const satellites = [];
    const satCount = 6;
    for (let i = 0; i < satCount; i++) {
      const isJewel = i % 2 === 0;
      const satGeo = isJewel ? new THREE.OctahedronGeometry(0.22, 0) : new THREE.SphereGeometry(0.18, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: isJewel ? 0xffffff : primaryHex,
        metalness: 0.8,
        roughness: 0.15,
        emissive: isJewel ? 0x222233 : 0x120a28,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.5 + (i % 2) * 0.5;
      satMesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.7, Math.sin(angle) * radius);
      mainGroup.add(satMesh);
      satellites.push({ mesh: satMesh, angle, radius, speed: 0.014 + i * 0.003 });
    }

    // 4. Ambient Volumetric Cosmic Star Dust Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interactive Mouse Damping & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.75;
      targetY = y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
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
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth mouse damping
        mouseX += (targetX - mouseX) * 0.06;
        mouseY += (targetY - mouseY) * 0.06;

        // Group rotation & spatial floating
        mainGroup.rotation.y = elapsedTime * 0.22 + mouseX;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.15 - mouseY;
        mainGroup.position.y = Math.sin(elapsedTime * 1.1) * 0.14;

        // Astrolabe rings rotation
        ring1.rotation.z = elapsedTime * 0.32;
        ring2.rotation.y = -elapsedTime * 0.26;

        // Floating Card bobbing
        cardGroup.rotation.x = 0.3 + Math.sin(elapsedTime * 1.5) * 0.1;
        cardGroup.position.y = 0.8 + Math.sin(elapsedTime * 1.3) * 0.12;

        // Floating Capsule spin
        capsuleMesh.rotation.y = elapsedTime * 0.8;
        capsuleMesh.position.y = -0.7 + Math.cos(elapsedTime * 1.4) * 0.1;

        // Inner wireframe counter-spin
        innerWire.rotation.y = -elapsedTime * 0.4;
        innerWire.rotation.x = elapsedTime * 0.3;

        // Orbiting satellites
        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
          sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
          sat.mesh.position.y = Math.sin(sat.angle * 2.2 + elapsedTime) * 0.55;
          sat.mesh.rotation.x += 0.02;
          sat.mesh.rotation.y += 0.03;
        });

        // Background Star Dust Drift
        particles.rotation.y = elapsedTime * 0.025;
      }

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
      innerWireGeo.dispose();
      innerWireMat.dispose();
      cardGeo.dispose();
      cardMat.dispose();
      chipGeo.dispose();
      chipMat.dispose();
      capsuleGeo.dispose();
      capsuleMat.dispose();
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
