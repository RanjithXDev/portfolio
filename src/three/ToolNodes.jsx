import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AMBER = new THREE.Color('#FFB454');
const CYAN = new THREE.Color('#5EEAD4');

const TRAIL_SEGMENTS = 48;
const TRAIL_ARC = Math.PI * 0.62; // how far behind the node the trail reaches

/**
 * Small glowing spheres on tilted elliptical orbits, each dragging a fading
 * arc behind it — the "tools" the agent core is calling.
 */
export default function ToolNodes({ quality, sectionMix = 0 }) {
  const nodeRefs = useRef([]);
  const trailRefs = useRef([]);

  const orbits = useMemo(() => {
    const configs = [
      { a: 2.30, b: 1.72, speed: 0.42, tilt: [0.55, 0.20, 0.10], phase: 0.0, color: AMBER, size: 0.062 },
      { a: 2.72, b: 2.10, speed: -0.31, tilt: [-0.38, 0.85, 0.30], phase: 1.9, color: CYAN, size: 0.050 },
      { a: 1.98, b: 2.44, speed: 0.36, tilt: [0.95, -0.30, 0.55], phase: 3.4, color: CYAN, size: 0.044 },
      { a: 3.05, b: 2.28, speed: -0.24, tilt: [0.18, 0.42, -0.70], phase: 5.0, color: AMBER, size: 0.056 },
      { a: 2.52, b: 2.86, speed: 0.29, tilt: [-0.72, -0.25, 0.42], phase: 2.6, color: AMBER, size: 0.040 },
      { a: 2.16, b: 2.02, speed: -0.47, tilt: [0.30, 1.15, 0.85], phase: 4.3, color: CYAN, size: 0.048 },
    ];
    return configs.slice(0, quality.toolNodes);
  }, [quality.toolNodes]);

  // One trail geometry per orbit. Alpha is baked per-vertex as a gradient:
  // the head sits at the node, the tail fades to nothing.
  const trailGeometries = useMemo(
    () =>
      orbits.map(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array((TRAIL_SEGMENTS + 1) * 3);
        const alphas = new Float32Array(TRAIL_SEGMENTS + 1);
        for (let i = 0; i <= TRAIL_SEGMENTS; i += 1) {
          // i = 0 is the head (brightest), i = SEGMENTS the tail.
          alphas[i] = Math.pow(1 - i / TRAIL_SEGMENTS, 1.8);
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
        return geometry;
      }),
    [orbits]
  );

  useFrame((state) => {
    const t = quality.reducedMotion ? 0 : state.clock.elapsedTime;

    orbits.forEach((orbit, index) => {
      const angle = orbit.phase + t * orbit.speed;

      const node = nodeRefs.current[index];
      if (node) {
        node.position.set(Math.cos(angle) * orbit.a, Math.sin(angle) * orbit.b, 0);
        // Gentle self-rotation keeps the specular highlight alive.
        node.rotation.y = t * 0.8;
      }

      const geometry = trailGeometries[index];
      const positions = geometry.attributes.position.array;
      for (let i = 0; i <= TRAIL_SEGMENTS; i += 1) {
        const trailAngle = angle - (i / TRAIL_SEGMENTS) * TRAIL_ARC * Math.sign(orbit.speed || 1);
        positions[i * 3] = Math.cos(trailAngle) * orbit.a;
        positions[i * 3 + 1] = Math.sin(trailAngle) * orbit.b;
        positions[i * 3 + 2] = 0;
      }
      geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group>
      {orbits.map((orbit, index) => {
        // Blend each node toward the section accent without losing its identity.
        const color = orbit.color.clone().lerp(orbit.color === AMBER ? CYAN : AMBER, sectionMix * 0.35);

        return (
          <group key={`${orbit.a}-${orbit.phase}`} rotation={orbit.tilt}>
            {/* Node */}
            <mesh
              ref={(el) => {
                nodeRefs.current[index] = el;
              }}
            >
              <sphereGeometry args={[orbit.size, 12, 12]} />
              <meshBasicMaterial
                color={color}
                toneMapped={false}
                transparent
                opacity={0.95}
              />
            </mesh>

            {/* Trailing arc */}
            <line
              ref={(el) => {
                trailRefs.current[index] = el;
              }}
              geometry={trailGeometries[index]}
              frustumCulled={false}
            >
              <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{ uColor: { value: color } }}
                vertexShader={/* glsl */ `
                  attribute float aAlpha;
                  varying float vAlpha;
                  void main() {
                    vAlpha = aAlpha;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                `}
                fragmentShader={/* glsl */ `
                  uniform vec3 uColor;
                  varying float vAlpha;
                  void main() {
                    gl_FragColor = vec4(uColor, vAlpha * 0.85);
                  }
                `}
              />
            </line>
          </group>
        );
      })}
    </group>
  );
}
