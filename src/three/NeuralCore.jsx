import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { simplexNoise3D } from './glsl/noise';

const AMBER = new THREE.Color('#FFB454');
const CYAN = new THREE.Color('#5EEAD4');

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uDistortion;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vNoise;

  ${simplexNoise3D}

  void main() {
    // Two octaves: a slow swell plus a faster ripple, so the surface reads as
    // "thinking" rather than uniformly wobbling.
    float slow = snoise(position * 1.6 + vec3(0.0, 0.0, uTime * 0.25));
    float fast = snoise(position * 3.4 - vec3(uTime * 0.4, 0.0, 0.0));
    float n = slow * 0.7 + fast * 0.3;

    vNoise = n;

    float amount = uDistortion * (0.65 + uPulse * 0.55);
    vec3 displaced = position + normal * n * amount;

    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uAmber;
  uniform vec3 uCyan;
  uniform float uMix;      // 0 = amber dominant, 1 = cyan dominant
  uniform float uPulse;
  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vNoise;

  void main() {
    // Fresnel: bright at grazing angles, dark facing the camera, which gives
    // the core a hollow, rim-lit look instead of a solid ball.
    float fresnel = 1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0);
    // High exponent keeps the rim a thin band; a fat rim is what blows out
    // once bloom is applied.
    float rim = pow(fresnel, 4.2);

    // Amber owns the rim, cyan fills the interior, and uMix slides the whole
    // balance per section. Tying colour *positively* to fresnel washed the
    // amber out entirely, since the rim is where fresnel peaks.
    float grad = clamp(0.42 - rim * 0.55 + vNoise * 0.22 + uMix * 0.55, 0.0, 1.0);
    vec3 color = mix(uAmber, uCyan, grad);

    // Noise ridges catch a little extra light.
    float ridge = smoothstep(0.35, 0.85, vNoise) * 0.18;

    // Held below 1.0 so bloom lifts the colour rather than clipping it white.
    float intensity = rim * (0.62 + uPulse * 0.22) + ridge;
    intensity = clamp(intensity, 0.0, 0.92);

    // Faint inner fill so the silhouette is never fully black.
    vec3 finalColor = color * intensity + color * 0.045;

    gl_FragColor = vec4(finalColor, clamp(intensity * 1.1 + 0.06, 0.0, 0.9));
  }
`;

/**
 * The signature centrepiece: a noise-displaced, fresnel-lit sphere wrapped in
 * counter-rotating wireframe shells.
 */
export default function NeuralCore({ quality, sectionMix = 0, radius = 1.05 }) {
  const materialRef = useRef();
  const groupRef = useRef();
  const shellRefs = useRef([]);
  const mixRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uMix: { value: 0 },
      uDistortion: { value: 0.24 },
      uAmber: { value: AMBER.clone() },
      uCyan: { value: CYAN.clone() },
    }),
    []
  );

  // Shell configuration: differing radii, opacity and rotation axes give the
  // core visual depth without extra geometry cost.
  const shells = useMemo(() => {
    const configs = [
      { scale: 1.28, detail: 1, opacity: 0.085, color: AMBER, speed: 0.14, axis: [0.4, 1, 0.15] },
      { scale: 1.55, detail: 1, opacity: 0.045, color: CYAN, speed: -0.09, axis: [1, 0.25, 0.5] },
      { scale: 1.84, detail: 1, opacity: 0.028, color: AMBER, speed: 0.05, axis: [0.2, 0.6, 1] },
    ];
    return configs.slice(0, quality.shellCount);
  }, [quality.shellCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uTime.value = quality.reducedMotion ? 0.0 : t;

      // Breathing pulse — a slow sine with a sharper "thought spike" layered on.
      const breathe = Math.sin(t * 0.9) * 0.5 + 0.5;
      const spike = Math.pow(Math.sin(t * 0.31) * 0.5 + 0.5, 6.0);
      u.uPulse.value = quality.reducedMotion ? 0.35 : breathe * 0.6 + spike * 0.8;

      // Ease toward the section's colour balance so transitions never snap.
      mixRef.current += (sectionMix - mixRef.current) * Math.min(1, delta * 1.8);
      u.uMix.value = mixRef.current;
    }

    if (quality.reducedMotion) return;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }

    shellRefs.current.forEach((shell, i) => {
      if (!shell) return;
      const config = shells[i];
      shell.rotation.y = t * config.speed;
      shell.rotation.x = t * config.speed * 0.6;
      shell.rotation.z = t * config.speed * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Core */}
      <mesh>
        <icosahedronGeometry args={[radius, quality.coreDetail >= 32 ? 6 : 4]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Layered wireframe shells */}
      {shells.map((shell, i) => (
        <mesh
          key={shell.scale}
          ref={(el) => {
            shellRefs.current[i] = el;
          }}
          rotation={[shell.axis[0], shell.axis[1], shell.axis[2]]}
        >
          <icosahedronGeometry args={[radius * shell.scale, shell.detail]} />
          <meshBasicMaterial
            color={shell.color}
            wireframe
            transparent
            opacity={shell.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
