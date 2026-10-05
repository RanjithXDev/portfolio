import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from './scrollStore';
import { camera as cameraConfig } from '../data/sceneConfig';

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const desired = new THREE.Vector3();
const desiredTarget = new THREE.Vector3();
const lastPosition = new THREE.Vector3();

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * Samples the keyframe path at `progress`, lerping between the two bracketing
 * keyframes with an eased blend so segment boundaries are not felt.
 */
function sampleKeyframes(progress, outPosition, outTarget) {
  const frames = cameraConfig.keyframes;
  let i = 0;
  while (i < frames.length - 2 && progress > frames[i + 1].at) i += 1;

  const a = frames[i];
  const b = frames[i + 1] ?? frames[i];
  const span = b.at - a.at || 1;
  const localT = smoothstep(THREE.MathUtils.clamp((progress - a.at) / span, 0, 1));

  tmpA.fromArray(a.position);
  tmpB.fromArray(b.position);
  outPosition.copy(tmpA).lerp(tmpB, localT);

  tmpA.fromArray(a.target);
  tmpB.fromArray(b.target);
  outTarget.copy(tmpA).lerp(tmpB, localT);

  return THREE.MathUtils.lerp(a.mix, b.mix, localT);
}

/**
 * Horizontal framing offset. Looking at a point to the RIGHT of the core
 * pushes the core toward the left of the screen, seating it in the console
 * column instead of behind the body copy. On narrow layouts the console
 * collapses to a top block, so the core re-centres.
 */
function framingOffset(width) {
  const { minWidth, maxWidth, minOffset, maxOffset } = cameraConfig.framing;
  if (width < minWidth) return 0;
  // Scales with viewport so the core stays in the console band at any width.
  return THREE.MathUtils.mapLinear(
    THREE.MathUtils.clamp(width, minWidth, maxWidth),
    minWidth,
    maxWidth,
    minOffset,
    maxOffset
  );
}

export default function CameraRig({ quality }) {
  const { camera, size } = useThree();
  const initialised = useRef(false);

  useFrame((state, delta) => {
    const offsetX = framingOffset(size.width);

    if (quality.reducedMotion) {
      // Static framed composition — no fly-through at all.
      const [sx, sy, sz] = cameraConfig.staticFrame.position;
      camera.position.set(sx + offsetX, sy, sz);
      camera.lookAt(offsetX, 0, 0);
      scrollStore.mix = cameraConfig.staticFrame.mix;
      return;
    }

    const mix = sampleKeyframes(scrollStore.progress, desired, desiredTarget);
    scrollStore.mix = mix;

    // Shift both the eye and the target so the orbit is preserved but the
    // whole composition slides left on screen.
    desired.x += offsetX;
    desiredTarget.x += offsetX;

    // The intro pulls the camera back along its own view vector and eases in.
    const intro = scrollStore.intro;
    if (intro < 1) {
      const pullBack = (1 - intro) * cameraConfig.introPullBack;
      desired.multiplyScalar(1 + (1 - intro) * 0.35);
      desired.z += pullBack;
    }

    if (!initialised.current) {
      camera.position.copy(desired);
      lastPosition.copy(desired);
      initialised.current = true;
    }

    // Critically-damped follow: frame-rate independent and never overshoots.
    const damping = 1 - Math.exp(-cameraConfig.damping * delta);
    camera.position.lerp(desired, damping);
    camera.lookAt(desiredTarget);

    // Speed in world units per second, used to gate chromatic aberration.
    const distance = camera.position.distanceTo(lastPosition);
    scrollStore.velocity = delta > 0 ? distance / delta : 0;
    lastPosition.copy(camera.position);
  });

  return null;
}
