"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useConfigurator, type CameraView } from "@/store/configurator";
import { YachtModel } from "./YachtModel";

const viewPositions: Record<CameraView, [number, number, number]> = {
  perspective: [38, 22, 48],
  profile: [0, 12, 72],
  top: [0, 64, 0.1],
  front: [45, 9, 0],
};

function CameraRig() {
  const cameraView = useConfigurator((state) => state.cameraView);
  const length = useConfigurator((state) => state.configuration.length);
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const [x, y, z] = viewPositions[cameraView];
    const scale = length / 42;
    camera.position.set(x * scale, y * scale, z * scale);
    camera.lookAt(0, 2.5, 0);
    camera.updateProjectionMatrix();
    controls.current?.target.set(0, 2.5, 0);
    controls.current?.update();
  }, [camera, cameraView, length]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan
      enableDamping
      dampingFactor={0.075}
      minDistance={18}
      maxDistance={115}
      maxPolarAngle={Math.PI * 0.49}
      target={[0, 2.5, 0]}
    />
  );
}

function Lighting() {
  const environment = useConfigurator((state) => state.configuration.environment);
  const dusk = environment === "dusk";

  return (
    <>
      <ambientLight intensity={dusk ? 0.55 : 1.25} color={dusk ? "#c8d6d8" : "#ffffff"} />
      <directionalLight
        castShadow
        position={[18, 34, 24]}
        intensity={dusk ? 2.2 : 3.3}
        color={dusk ? "#ffb27a" : "#ffffff"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-22, 14, -14]} intensity={dusk ? 1.1 : 1.5} color="#b9e1e4" />
    </>
  );
}

function Studio() {
  const environment = useConfigurator((state) => state.configuration.environment);
  const background = environment === "dusk" ? "#343a3b" : environment === "daylight" ? "#eef8f8" : "#f7f7f5";
  const grid = environment === "dusk" ? "#667071" : "#cfd4d1";

  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 58, 112]} />
      <Grid
        args={[115, 115]}
        position={[0, -0.48, 0]}
        cellSize={2}
        cellThickness={0.32}
        cellColor={grid}
        sectionSize={10}
        sectionThickness={0.65}
        sectionColor={grid}
        fadeDistance={76}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows
        position={[0, -0.44, 0]}
        opacity={environment === "dusk" ? 0.38 : 0.2}
        scale={72}
        blur={2.2}
        far={28}
        resolution={512}
        color={environment === "dusk" ? "#0e1516" : "#657070"}
      />
    </>
  );
}

export function YachtScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: viewPositions.perspective, fov: 32, near: 0.1, far: 180 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      aria-label="Interactive three-dimensional yacht concept. Drag to orbit, scroll to zoom."
    >
      <Suspense fallback={null}>
        <Lighting />
        <Studio />
        <YachtModel />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
