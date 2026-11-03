import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, Play, Pause, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

export default function Product3DViewer({ product }) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 380;
    const height = currentMount.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    currentMount.appendChild(renderer.domElement);

    // Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.0);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x10b981, 2.5, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Illuminated Circular Pedestal
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const discGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.15, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      metalness: 0.8,
      roughness: 0.2,
    });
    const pedestal = new THREE.Mesh(discGeo, discMat);
    pedestal.position.y = -1.1;
    pedestalGroup.add(pedestal);

    // Glowing Neon Rim Ring on pedestal
    const neonRingGeo = new THREE.TorusGeometry(1.62, 0.03, 16, 64);
    const neonRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -1.02;
    pedestalGroup.add(neonRing);

    // 3D Product Core - Texture mapped from product image
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    const textureLoader = new THREE.TextureLoader();
    const imageUrl = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
    
    textureLoader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      
      // Floating Curved Display Monolith or Geometric Form
      const boxGeo = new THREE.BoxGeometry(1.8, 1.8, 0.35);
      const materials = [
        new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.3 }), // right
        new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.3 }), // left
        new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 }), // top
        new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 }), // bottom
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.15, metalness: 0.1 }), // front
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.15, metalness: 0.1 }), // back
      ];
      const productMesh = new THREE.Mesh(boxGeo, materials);
      productMesh.position.y = 0.2;
      productMesh.castShadow = true;
      productGroup.add(productMesh);

      // Surrounding subtle floating metallic frame
      const frameGeo = new THREE.BoxGeometry(1.86, 1.86, 0.38);
      const frameWireMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.35 });
      const frameMesh = new THREE.Mesh(frameGeo, frameWireMat);
      frameMesh.position.y = 0.2;
      productGroup.add(frameMesh);
    });

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

    // Touch support for mobile
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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotatingRef.current && !isDragging) {
        productGroup.rotation.y += 0.008;
      }

      // Smooth floating motion
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
    };
  }, [product]);

  return (
    <div className="relative w-full aspect-square rounded-2xl bg-neutral-950/90 border border-neutral-800 overflow-hidden flex items-center justify-center select-none shadow-2xl">
      {/* 3D Canvas Mounting Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Interaction Control Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
          <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive 360° Studio</span>
        </span>
      </div>

      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20">
        <span className="text-[10px] text-neutral-400 bg-neutral-900/80 px-2 py-1 rounded-md backdrop-blur-sm border border-neutral-800">
          Drag to orbit &bull; 360 view
        </span>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="p-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer backdrop-blur-md"
          title={isRotating ? 'Pause Rotation' : 'Resume 360 Auto-Spin'}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
}
