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
import {
  palette,
  camera as cameraConfig,
  environment,
  resolveColor,
} from '../data/sceneConfig';
import styles from './Scene.module.css';

function Lights() {
  return (
    <>
      {/* Moody accent rim lighting — no white key light. */}
      <ambientLight intensity={environment.ambientIntensity} color={palette.ambient} />
      {environment.lights.map((light) => (
        <pointLight
          key={light.position.join(',')}
          position={light.position}
          intensity={light.intensity}
          color={resolveColor(light.color)}
          distance={light.distance}
          decay={2}
        />
      ))}
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
        camera={{
          position: [0, 0, 16],
          fov: cameraConfig.fov,
          near: cameraConfig.near,
          far: cameraConfig.far,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = environment.toneMappingExposure;
          scene.fog = new THREE.FogExp2(palette.background, environment.fogDensity);
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
              position={environment.grid.position}
              args={[40, 40]}
              cellSize={environment.grid.cellSize}
              cellThickness={0.5}
              cellColor={environment.grid.cellColor}
              sectionSize={environment.grid.sectionSize}
              sectionThickness={0.8}
              sectionColor={environment.grid.sectionColor}
              fadeDistance={environment.grid.fadeDistance}
              fadeStrength={environment.grid.fadeStrength}
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
