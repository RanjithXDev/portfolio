import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { scrollStore } from './scrollStore';

const MAX_OFFSET = 0.0016;

export default function Effects({ quality }) {
  const current = useRef(0);

  // Must be a real Vector2 that we mutate in place. Passing a plain array
  // replaces the effect's internal Vector2 and breaks .set().
  const offsetVec = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, delta) => {
    // Aberration only during fast camera moves; at rest it fades to zero so
    // static frames stay clean.
    const target = THREE.MathUtils.clamp(scrollStore.velocity / 14, 0, 1);
    current.current += (target - current.current) * Math.min(1, delta * 5);

    const offset = current.current * MAX_OFFSET;
    offsetVec.set(offset, offset * 0.6);
  });

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        intensity={quality.bloomIntensity}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.22}
        mipmapBlur
        radius={0.62}
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
      <Vignette offset={0.26} darkness={0.66} eskil={false} />
    </EffectComposer>
  );
}
