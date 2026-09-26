"use client";

import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useConfigurator, type BowProfile } from "@/store/configurator";

const hullColours = {
  white: "#f4f5f3",
  silver: "#bdc3c3",
  graphite: "#343b3c",
  teal: "#174f56",
};

const deckColours = {
  natural: "#b28a61",
  smoked: "#756252",
  graphite: "#373a38",
};

function createHullGeometry(length: number, beam: number, profile: BowProfile) {
  const geometry = new THREE.BufferGeometry();
  const lengthSegments = 42;
  const ringSegments = 18;
  const vertices: number[] = [];
  const indices: number[] = [];
  const exponent = profile === "fine" ? 1.7 : profile === "bold" ? 0.7 : 1.08;

  for (let i = 0; i <= lengthSegments; i += 1) {
    const t = i / lengthSegments;
    const sternFactor = t < 0.13 ? 0.66 + (t / 0.13) * 0.34 : 1;
    const bowProgress = Math.max(0, (t - 0.68) / 0.32);
    const bowFactor = t > 0.68 ? Math.max(0.035, Math.pow(1 - bowProgress, exponent)) : 1;
    const halfWidth = (beam / 2) * sternFactor * bowFactor;
    const rise = Math.pow(bowProgress, 2) * 1.1;

    for (let j = 0; j < ringSegments; j += 1) {
      const angle = (j / ringSegments) * Math.PI * 2;
      const cosine = Math.cos(angle);
      const verticalScale = cosine > 0 ? 0.68 : 1.75;
      const y = 0.1 + cosine * verticalScale + rise;
      const z = Math.sin(angle) * halfWidth;
      const rake = profile === "fine" ? 0.9 : profile === "bold" ? 0.2 : 0.55;
      const x = (t - 0.5) * length + bowProgress * rake * Math.max(0, cosine);
      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < lengthSegments; i += 1) {
    for (let j = 0; j < ringSegments; j += 1) {
      const next = (j + 1) % ringSegments;
      const a = i * ringSegments + j;
      const b = i * ringSegments + next;
      const c = (i + 1) * ringSegments + next;
      const d = (i + 1) * ringSegments + j;
      indices.push(a, b, d, b, c, d);
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function WindowBand({ length, beam, glazing, y }: { length: number; beam: number; glazing: number; y: number }) {
  const width = length * (0.28 + glazing * 0.0037);
  return (
    <>
      {[1, -1].map((side) => (
        <RoundedBox
          key={side}
          args={[width, 0.72, 0.1]}
          radius={0.12}
          smoothness={4}
          position={[-1.3, y, side * beam * 0.34]}
        >
          <meshPhysicalMaterial color="#18292d" roughness={0.15} metalness={0.2} clearcoat={0.75} />
        </RoundedBox>
      ))}
    </>
  );
}

export function YachtModel() {
  const configuration = useConfigurator((state) => state.configuration);
  const hullGeometry = useMemo(
    () => createHullGeometry(configuration.length, configuration.beam, configuration.bowProfile),
    [configuration.length, configuration.beam, configuration.bowProfile],
  );

  useEffect(() => () => hullGeometry.dispose(), [hullGeometry]);

  const { length, beam, superstructure, upperDeck, glazing, hullColour, deckFinish } = configuration;

  return (
    <group position={[0, 1.35, 0]}>
      <mesh geometry={hullGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={hullColours[hullColour]}
          roughness={0.34}
          metalness={0.04}
          clearcoat={0.42}
          clearcoatRoughness={0.24}
        />
      </mesh>

      <RoundedBox args={[length * 0.8, 0.32, beam * 0.88]} radius={0.18} smoothness={4} position={[-length * 0.055, 1.05, 0]} castShadow>
        <meshStandardMaterial color="#eef0ed" roughness={0.42} />
      </RoundedBox>

      <RoundedBox args={[length * 0.58, 1.55 * superstructure, beam * 0.68]} radius={0.44} smoothness={5} position={[-length * 0.08, 2 + superstructure * 0.2, 0]} castShadow>
        <meshStandardMaterial color="#f7f7f4" roughness={0.32} />
      </RoundedBox>
      <WindowBand length={length} beam={beam} glazing={glazing} y={2.35} />

      <RoundedBox args={[length * 0.39 * upperDeck, 1.36 * superstructure, beam * 0.52]} radius={0.38} smoothness={5} position={[-length * 0.13, 3.42 + superstructure * 0.32, 0]} castShadow>
        <meshStandardMaterial color="#f2f3f0" roughness={0.34} />
      </RoundedBox>
      <WindowBand length={length * 0.7 * upperDeck} beam={beam * 0.76} glazing={glazing * 0.72} y={3.72 + superstructure * 0.28} />

      <RoundedBox args={[length * 0.27 * upperDeck, 0.28, beam * 0.57]} radius={0.14} smoothness={4} position={[-length * 0.16, 4.52 + superstructure * 0.55, 0]} castShadow>
        <meshStandardMaterial color={deckColours[deckFinish]} roughness={0.58} />
      </RoundedBox>

      <mesh position={[-length * 0.19, 5.52 + superstructure * 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.18, 2.2, 16]} />
        <meshStandardMaterial color="#394142" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[-length * 0.19, 6.25 + superstructure * 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 2.25, 12]} />
        <meshStandardMaterial color="#394142" metalness={0.55} roughness={0.32} />
      </mesh>

      {[-0.22, -0.1, 0.02, 0.14].map((offset) => (
        <mesh key={offset} position={[length * offset, 0.3, beam * 0.505]}>
          <boxGeometry args={[0.72, 0.34, 0.06]} />
          <meshStandardMaterial color="#18292d" roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
