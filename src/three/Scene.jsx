import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import NeuralCore from './NeuralCore';
import ParticleNetwork from './ParticleNetwork';
import ToolNodes from './ToolNodes';
import CameraRig from './CameraRig';
import Effects from './Effects';
import { getQuality } from './quality';
import styles from './Scene.module.css';

const BG = '#0A0E12';

function Lights() {
  return (
    <>
      {/* Moody accent rim lighting — no white key light. */}
      <ambientLight intensity={0.12} color="#2A3A48" />
      <pointLight position={[3.2, 2.4, 2.6]} intensity={22} color="#FFB454" distance={16} decay={2} />
      <pointLight position={[-3.4, -1.6, 2.0]} intensity={18} color="#5EEAD4" distance={16} decay={2} />
      <pointLight position={[0, -2.8, -3.2]} intensity={10} color="#FFB454" distance={14} decay={2} />
    </>
  );
}

export default function Scene() {
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
        camera={{ position: [0, 0, 16], fov: 42, near: 0.1, far: 80 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.95;
          scene.fog = new THREE.FogExp2(BG, 0.075);
        }}
      >
        <Suspense fallback={null}>
          <Lights />
          <CameraRig quality={quality} />

          <NeuralCore quality={quality} />
          <ParticleNetwork quality={quality} />
          <ToolNodes quality={quality} />

          {quality.grid && (
            <Grid
              position={[0, -3.4, 0]}
              args={[40, 40]}
              cellSize={0.7}
              cellThickness={0.5}
              cellColor="#223041"
              sectionSize={3.5}
              sectionThickness={0.8}
              sectionColor="#2E4256"
              fadeDistance={22}
              fadeStrength={2.4}
              infiniteGrid
              followCamera={false}
            />
          )}

          {quality.postProcessing && <Effects quality={quality} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
