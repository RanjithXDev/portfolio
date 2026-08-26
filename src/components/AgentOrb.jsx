import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './AgentOrb.module.css';

const AMBER = new THREE.Color('#FFB454');
const CYAN = new THREE.Color('#5EEAD4');

/**
 * The 3D "agent orb": an icosahedron wireframe with a vertex-displaced inner
 * shell and an orbiting particle shell. Rotation follows scroll, and the orb
 * leans toward the pointer. Raw Three.js — no react-three-fiber.
 *
 * Everything created here (geometries, materials, renderer, listeners, RAF)
 * is disposed in the cleanup so remounts do not leak GPU memory.
 */
export default function AgentOrb() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL can be unavailable (older devices, blocked contexts). Fail quietly
    // rather than throwing into the React tree.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const orb = new THREE.Group();
    scene.add(orb);

    // --- Outer wireframe shell -------------------------------------------
    const shellGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: AMBER,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    orb.add(shell);

    // --- Inner core, displaced per-vertex on each frame -------------------
    const coreGeometry = new THREE.IcosahedronGeometry(0.92, 4);
    // Keep a pristine copy of the positions to displace from.
    const basePositions = coreGeometry.attributes.position.array.slice();
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    orb.add(core);

    // --- Orbiting particle shell -----------------------------------------
    const PARTICLE_COUNT = 420;
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      // Even-ish distribution on a sphere.
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.5;
      particlePositions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(theta);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: CYAN,
      size: 0.022,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    orb.add(particles);

    // --- Interaction state ------------------------------------------------
    // Targets are set by input handlers; the render loop eases toward them so
    // motion stays smooth regardless of event frequency.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;
    let scrollTarget = 0;

    const handlePointerMove = (event) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Resize -----------------------------------------------------------
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // ResizeObserver tracks the panel, which changes size at the 900px
    // breakpoint without the window necessarily resizing.
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // --- Render loop ------------------------------------------------------
    const clock = new THREE.Clock();
    let frameId;

    const renderFrame = () => {
      frameId = requestAnimationFrame(renderFrame);

      const elapsed = clock.getElapsedTime();

      // Ease interaction values toward their targets.
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;
      scrollProgress += (scrollTarget - scrollProgress) * 0.06;

      // Scroll drives a full rotation down the page; pointer adds a lean.
      orb.rotation.y = scrollProgress * Math.PI * 2 + pointer.x * 0.4 + elapsed * 0.05;
      orb.rotation.x = pointer.y * 0.3 + scrollProgress * 0.6;

      // Counter-rotate the particles so the shells feel independent.
      particles.rotation.y = -elapsed * 0.04;
      particles.rotation.z = elapsed * 0.02;

      // Breathing displacement on the core.
      const positions = coreGeometry.attributes.position.array;
      const amplitude = 0.06 + scrollProgress * 0.05;
      for (let i = 0; i < positions.length; i += 3) {
        const bx = basePositions[i];
        const by = basePositions[i + 1];
        const bz = basePositions[i + 2];
        const wave =
          Math.sin(bx * 3 + elapsed * 1.1) *
          Math.cos(by * 3 + elapsed * 0.9) *
          Math.sin(bz * 3 + elapsed * 0.7);
        const scale = 1 + wave * amplitude;
        positions[i] = bx * scale;
        positions[i + 1] = by * scale;
        positions[i + 2] = bz * scale;
      }
      coreGeometry.attributes.position.needsUpdate = true;

      // Accent shifts from amber toward cyan as the visitor scrolls down.
      shellMaterial.color.copy(AMBER).lerp(CYAN, scrollProgress * 0.8);

      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      // Draw one static frame instead of animating.
      resize();
      renderer.render(scene, camera);
    } else {
      renderFrame();
    }

    // --- Cleanup ----------------------------------------------------------
    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);

      shellGeometry.dispose();
      shellMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.orb} aria-hidden="true" />;
}
