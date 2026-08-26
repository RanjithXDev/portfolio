import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from './scrollStore';

const AMBER = new THREE.Color('#FFB454');
const CYAN = new THREE.Color('#5EEAD4');

const INNER_RADIUS = 2.05;
const OUTER_RADIUS = 3.05;
const LINK_DISTANCE = 0.92;

/**
 * Deterministic PRNG so the layout is identical across reloads — a random
 * cloud that reshuffles every refresh reads as noise rather than design.
 */
function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aPhase;
  attribute float aTint;

  varying float vAlpha;
  varying float vTint;

  void main() {
    vTint = aTint;

    // Twinkle in brightness only. Positions stay fixed in local space so the
    // connector lines below always terminate exactly on a particle.
    float twinkle = sin(uTime * 1.4 + aPhase * 6.283) * 0.5 + 0.5;
    vAlpha = 0.25 + twinkle * 0.75;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective size attenuation.
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uAmber;
  uniform vec3 uCyan;
  uniform float uMix;

  varying float vAlpha;
  varying float vTint;

  void main() {
    // Soft round sprite from the point coordinate — no texture needed.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float mask = smoothstep(0.5, 0.08, d);
    if (mask < 0.01) discard;

    vec3 color = mix(uAmber, uCyan, clamp(vTint + uMix * 0.4, 0.0, 1.0));
    gl_FragColor = vec4(color, mask * vAlpha * 0.62);
  }
`;

const linesVertex = /* glsl */ `
  uniform float uTime;

  attribute float aPhase;
  attribute float aTint;

  varying float vAlpha;
  varying float vTint;

  void main() {
    vTint = aTint;

    // Each link breathes on its own cycle, so the network reads as traffic
    // moving through a graph rather than a static cage.
    float wave = sin(uTime * 0.55 + aPhase * 6.283);
    vAlpha = smoothstep(0.15, 0.95, wave);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const linesFragment = /* glsl */ `
  uniform vec3 uAmber;
  uniform vec3 uCyan;
  uniform float uMix;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vTint;

  void main() {
    vec3 color = mix(uAmber, uCyan, clamp(vTint + uMix * 0.4, 0.0, 1.0));
    gl_FragColor = vec4(color, vAlpha * uOpacity);
  }
`;

/**
 * A sparse spherical shell of points with animated connector lines between
 * near neighbours — the "neural net breathing around the core".
 */
export default function ParticleNetwork({ quality }) {
  const groupRef = useRef();
  const pointsMatRef = useRef();
  const linesMatRef = useRef();
  const mixRef = useRef(0);

  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const rand = mulberry32(20260827);
    const count = quality.particleCount;

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const tints = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Even angular distribution; radius biased outward so the core stays
      // readable through the middle of the cloud.
      const theta = Math.acos(2 * rand() - 1);
      const phi = rand() * Math.PI * 2;
      const radius = INNER_RADIUS + Math.pow(rand(), 0.65) * (OUTER_RADIUS - INNER_RADIUS);

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      scales[i] = 0.55 + rand() * 1.05;
      phases[i] = rand();
      tints[i] = rand();
    }

    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pg.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    pg.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    pg.setAttribute('aTint', new THREE.BufferAttribute(tints, 1));

    // Link pairs are computed ONCE against the static layout. Recomputing
    // neighbours per frame would be O(n^2) — 810k distance checks at 900
    // points — and buys nothing, since the cloud moves as a rigid group.
    const linkPositions = [];
    const linkPhases = [];
    const linkTints = [];

    if (quality.linkCount > 0) {
      const maxLinks = quality.linkCount;
      const linkDistSq = LINK_DISTANCE * LINK_DISTANCE;
      // Stride sampling keeps candidate generation bounded regardless of count.
      const stride = Math.max(1, Math.floor(count / 260));

      outer: for (let i = 0; i < count; i += stride) {
        for (let j = i + 1; j < count; j += 1) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq > 0 && distSq < linkDistSq) {
            linkPositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
            const phase = rand();
            const tint = (tints[i] + tints[j]) * 0.5;
            linkPhases.push(phase, phase);
            linkTints.push(tint, tint);

            if (linkPositions.length / 6 >= maxLinks) break outer;
          }
        }
      }
    }

    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(linkPositions, 3));
    lg.setAttribute('aPhase', new THREE.Float32BufferAttribute(linkPhases, 1));
    lg.setAttribute('aTint', new THREE.Float32BufferAttribute(linkTints, 1));

    return { pointsGeometry: pg, linesGeometry: lg };
  }, [quality.particleCount, quality.linkCount]);

  const pointsUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 9.5 },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
      uMix: { value: 0 },
      uAmber: { value: AMBER.clone() },
      uCyan: { value: CYAN.clone() },
    }),
    []
  );

  const linesUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uOpacity: { value: 0.16 },
      uAmber: { value: AMBER.clone() },
      uCyan: { value: CYAN.clone() },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    mixRef.current += (scrollStore.mix - mixRef.current) * Math.min(1, delta * 1.8);

    if (pointsMatRef.current) {
      pointsMatRef.current.uniforms.uTime.value = quality.reducedMotion ? 0 : t;
      pointsMatRef.current.uniforms.uMix.value = mixRef.current;
    }
    if (linesMatRef.current) {
      linesMatRef.current.uniforms.uTime.value = quality.reducedMotion ? 0 : t;
      linesMatRef.current.uniforms.uMix.value = mixRef.current;
    }

    if (quality.reducedMotion || !groupRef.current) return;

    // Slow counter-rotation against the core, plus a gentle radial breathe.
    groupRef.current.rotation.y = -t * 0.035;
    groupRef.current.rotation.x = Math.sin(t * 0.11) * 0.16;
    const breathe = 1 + Math.sin(t * 0.42) * 0.022;
    groupRef.current.scale.setScalar(breathe);
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeometry}>
        <shaderMaterial
          ref={pointsMatRef}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={pointsUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {quality.linkCount > 0 && (
        <lineSegments geometry={linesGeometry}>
          <shaderMaterial
            ref={linesMatRef}
            vertexShader={linesVertex}
            fragmentShader={linesFragment}
            uniforms={linesUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}
