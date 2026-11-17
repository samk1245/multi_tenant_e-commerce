import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, Play, Pause, ZoomIn, ZoomOut, Sparkles, Layers, RefreshCw } from 'lucide-react';

export default function Product3DViewer({ product }) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [lightingPreset, setLightingPreset] = useState('cyber'); // 'cyber' | 'studio' | 'gold'

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const wireframeModeRef = useRef(wireframeMode);
  wireframeModeRef.current = wireframeMode;

  const resetRotationRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.6);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    currentMount.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimColor = lightingPreset === 'cyber' ? 0x8b5cf6 : lightingPreset === 'gold' ? 0xf59e0b : 0x06b6d4;
    const rimLight = new THREE.PointLight(rimColor, 3.2, 12);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.1);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // Illuminated Circular Pedestal
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const discGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.16, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e18,
      metalness: 0.85,
      roughness: 0.18,
    });
    const pedestal = new THREE.Mesh(discGeo, discMat);
    pedestal.position.y = -1.15;
    pedestalGroup.add(pedestal);

    // Glowing Neon Ring on Pedestal
    const neonRingGeo = new THREE.TorusGeometry(1.66, 0.03, 16, 64);
    const neonRingMat = new THREE.MeshBasicMaterial({ color: rimColor });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -1.06;
    pedestalGroup.add(neonRing);

    // 3D Product Core Form
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    const textureLoader = new THREE.TextureLoader();
    const imageUrl =
      product.thumbnail ||
      product.images?.[0] ||
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';

    let productMesh = null;
    let frameMesh = null;

    textureLoader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;

      const boxGeo = new THREE.BoxGeometry(1.8, 1.8, 0.36);
      const materials = [
        new THREE.MeshStandardMaterial({ color: 0x181a28, metalness: 0.7, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0x181a28, metalness: 0.7, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0x0f111c, metalness: 0.85, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x0f111c, metalness: 0.85, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.18,
          metalness: 0.12,
          wireframe: wireframeModeRef.current,
        }),
        new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.18,
          metalness: 0.12,
          wireframe: wireframeModeRef.current,
        }),
      ];
      productMesh = new THREE.Mesh(boxGeo, materials);
      productMesh.position.y = 0.2;
      productMesh.castShadow = true;
      productGroup.add(productMesh);

      // Subtle Outer Holographic Frame
      const frameGeo = new THREE.BoxGeometry(1.88, 1.88, 0.4);
      const frameWireMat = new THREE.MeshBasicMaterial({
        color: rimColor,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      frameMesh = new THREE.Mesh(frameGeo, frameWireMat);
      frameMesh.position.y = 0.2;
      productGroup.add(frameMesh);
    });

    // Reset rotation handler
    resetRotationRef.current = () => {
      productGroup.rotation.set(0, 0, 0);
    };

    // Orbit Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      productGroup.rotation.y += deltaX * 0.01;
      productGroup.rotation.x = Math.max(-0.6, Math.min(0.6, productGroup.rotation.x + deltaY * 0.008));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Mobile touch interaction
    let touchStartX = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const delta = e.touches[0].clientX - touchStartX;
        productGroup.rotation.y += delta * 0.012;
        touchStartX = e.touches[0].clientX;
      }
    };
    dom.addEventListener('touchstart', onTouchStart);
    dom.addEventListener('touchmove', onTouchMove);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotatingRef.current && !isDragging) {
        productGroup.rotation.y += 0.008;
      }

      // Smooth floating bobbing
      productGroup.position.y = Math.sin(elapsed * 2) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      discGeo.dispose();
      discMat.dispose();
      neonRingGeo.dispose();
      neonRingMat.dispose();
    };
  }, [product, lightingPreset]);

  return (
    <div className="relative w-full aspect-square rounded-2xl bg-[#06070f] border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-2xl">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Studio Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-lg">
          <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive 360° Studio</span>
        </span>
      </div>

      {/* Top Right Studio Lighting Presets */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setLightingPreset('cyber')}
          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition ${
            lightingPreset === 'cyber'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-neutral-900/80 text-neutral-400 hover:text-white'
          }`}
          title="Cyber Neon Aura"
        >
          Cyber
        </button>
        <button
          type="button"
          onClick={() => setLightingPreset('studio')}
          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition ${
            lightingPreset === 'studio'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-neutral-900/80 text-neutral-400 hover:text-white'
          }`}
          title="Studio Cyan"
        >
          Studio
        </button>
        <button
          type="button"
          onClick={() => setLightingPreset('gold')}
          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition ${
            lightingPreset === 'gold'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-neutral-900/80 text-neutral-400 hover:text-white'
          }`}
          title="Luxury Gold"
        >
          Gold
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20">
        <span className="text-[10px] text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
          Drag to orbit 360°
        </span>

        <div className="flex items-center gap-1.5">
          {/* Reset Rotation */}
          <button
            type="button"
            onClick={() => {
              if (resetRotationRef.current) resetRotationRef.current();
            }}
            className="p-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer backdrop-blur-md"
            title="Reset Angle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Auto Spin */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer backdrop-blur-md"
            title={isRotating ? 'Pause Rotation' : 'Resume 360 Auto-Spin'}
          >
            {isRotating ? (
              <Pause className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
