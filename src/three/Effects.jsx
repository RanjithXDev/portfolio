import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { scrollStore } from './scrollStore';
import { postProcessing as cfg } from '../data/sceneConfig';

const MAX_OFFSET = cfg.chromaticAberration.maxOffset;

export default function Effects({ quality }) {
  const current = useRef(0);

  // Must be a real Vector2 that we mutate in place. Passing a plain array
  // replaces the effect's internal Vector2 and breaks .set().
  const offsetVec = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, delta) => {
    // Aberration only during fast camera moves; at rest it fades to zero so
    // static frames stay clean.
    const target = THREE.MathUtils.clamp(
      scrollStore.velocity / cfg.chromaticAberration.velocityScale,
      0,
      1
    );
    current.current += (target - current.current) * Math.min(1, delta * 5);

    const offset = current.current * MAX_OFFSET;
    offsetVec.set(offset, offset * 0.6);
  });

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        intensity={quality.bloomIntensity}
        luminanceThreshold={cfg.bloom.luminanceThreshold}
        luminanceSmoothing={cfg.bloom.luminanceSmoothing}
        mipmapBlur
        radius={cfg.bloom.radius}
      />
      {quality.chromaticAberration ? (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={offsetVec}
          radialModulation={false}
          modulationOffset={0}
        />
      ) : (
        <></>
      )}
      <Vignette offset={cfg.vignette.offset} darkness={cfg.vignette.darkness} eskil={false} />
    </EffectComposer>
  );
}
