import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import NeuralCore from './NeuralCore';
import ParticleNetwork from './ParticleNetwork';
import ToolNodes from './ToolNodes';
import { getQuality } from './quality';
import styles from './Scene.module.css';

const BG = '#0A0E12';

function Lights() {
  return (
    <>
      {/* Moody accent rim lighting — no white key light. */}
      <ambientLight intensity={0.12} color="#2A3A48" />
      <pointLight position={[3.2, 2.4, 2.6]} intensity={22} color="#FFB454" distance={14} decay={2} />
      <pointLight position={[-3.4, -1.6, 2.0]} intensity={18} color="#5EEAD4" distance={14} decay={2} />
      <pointLight position={[0, -2.8, -3.2]} intensity={10} color="#FFB454" distance={12} decay={2} />
    </>
  );
}

export default function Scene({ sectionMix = 0 }) {
  const quality = useMemo(() => getQuality(), []);

  return (
    <div className={styles.scene} aria-hidden="true">
      <Canvas
        dpr={quality.dpr}
        gl={{
          antialias: quality.tier !== 'low',
          alpha: true,
          powerPreference: quality.tier === 'high' ? 'high-performance' : 'low-power',
        }}
        camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.95;
          // Exponential fog in the background colour so distant geometry
          // dissolves into the page rather than ending at a hard edge.
          scene.fog = new THREE.FogExp2(BG, 0.085);
        }}
        frameloop={quality.reducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Lights />
          <NeuralCore quality={quality} sectionMix={sectionMix} />
          <ParticleNetwork quality={quality} sectionMix={sectionMix} />
          <ToolNodes quality={quality} sectionMix={sectionMix} />

          {quality.postProcessing && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={quality.bloomIntensity}
                // Threshold sits above the core's mid-tones so only the rim
                // and node highlights bloom — keeps the glow from flooding.
                luminanceThreshold={0.42}
                luminanceSmoothing={0.22}
                mipmapBlur
                radius={0.62}
              />
              <Vignette offset={0.28} darkness={0.62} eskil={false} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
