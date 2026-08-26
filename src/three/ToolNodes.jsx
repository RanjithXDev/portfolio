import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { toolNodes as cfg, palette, resolveColor } from '../data/sceneConfig';

const TRAIL_SEGMENTS = cfg.trailSegments;
const TRAIL_ARC = cfg.trailArc;

/**
 * Small glowing spheres on tilted elliptical orbits, each dragging a fading
 * arc behind it — the "tools" the agent core is calling.
 */
export default function ToolNodes({ quality }) {
  const nodeRefs = useRef([]);
  const trailRefs = useRef([]);

  const orbits = useMemo(
    () =>
      cfg.orbits.slice(0, quality.toolNodes).map((orbit) => ({
        ...orbit,
        color: new THREE.Color(resolveColor(orbit.color)),
      })),
    [quality.toolNodes]
  );

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
        const color = orbit.color.clone();

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
                uniforms={{
                  uColor: { value: color },
                  uTrailOpacity: { value: cfg.trailOpacity },
                }}
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
                  uniform float uTrailOpacity;
                  varying float vAlpha;
                  void main() {
                    gl_FragColor = vec4(uColor, vAlpha * uTrailOpacity);
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
