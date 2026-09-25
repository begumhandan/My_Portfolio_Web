"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Canvas,
  events as defaultEvents,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
  type EventManager,
  type RootState,
  type ThreeEvent,
} from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { siteConfig } from "@/data/site";
import { CARD_HEIGHT, CARD_WIDTH, createLanyardTextures, type LanyardTextures } from "./textures";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    // The constructor parameters are optional at runtime.
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, "args"> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>;
    };
  }
}

/**
 * The rope is anchored just above the top edge of the canvas (hidden), so the band looks
 * like it hangs down from the top of the page. Long segments keep the card resting in the
 * middle of the hero: anchor (top + 0.5) − 3 × SEGMENT ≈ 2.96 units below the top edge.
 */
const ANCHOR_ABOVE_TOP = 0.5;
const SEGMENT = 1.14;
/** Where the card's own clip ring sits, relative to the card centre. */
const CARD_CLIP_Y = CARD_HEIGHT / 2 + 0.1;

const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 3,
  linearDamping: 3,
};

/**
 * The canvas is click-through (pointer-events: none) and receives events from the whole hero
 * section instead, so the card can be dragged anywhere over the hero without blocking the
 * text & buttons. R3F's default compute uses offsetX of the hit element, which is wrong when
 * that element is a button or paragraph — so map client coordinates onto the canvas rect.
 */
function sectionEvents(store: Parameters<typeof defaultEvents>[0]): EventManager<HTMLElement> {
  return {
    ...defaultEvents(store),
    compute(event, state: RootState) {
      const rect = state.gl.domElement.getBoundingClientRect();
      state.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
  };
}

const metal = { color: "#cfd4dc", metalness: 1, roughness: 0.28 } as const;

function CardClip() {
  return (
    <group position={[0, CARD_HEIGHT / 2, 0]}>
      <RoundedBox args={[0.3, 0.12, 0.05]} radius={0.02} position={[0, 0.02, 0]}>
        <meshStandardMaterial {...metal} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.05, 0.013, 12, 32]} />
        <meshStandardMaterial {...metal} />
      </mesh>
    </group>
  );
}

function Band({
  textures,
  anchorX,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  textures: LanyardTextures;
  /** Horizontal anchor position as a fraction of the canvas width (0 = left, 1 = right). */
  anchorX: number;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  // Smoothed positions of the middle joints — keeps the band from jittering.
  const lerped = useRef<[THREE.Vector3 | null, THREE.Vector3 | null]>([null, null]);

  const { size, viewport } = useThree();
  const [anchor] = useState(() => ({
    x: (anchorX - 0.5) * viewport.width,
    y: viewport.height / 2 + ANCHOR_ABOVE_TOP,
  }));
  const [temp] = useState(() => ({
    vec: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    ang: new THREE.Vector3(),
    rot: new THREE.Vector3(),
  }));
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed, j1, [[0, -0.05, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_CLIP_Y, 0],
  ]);

  useEffect(() => {
    if (!hovered && !dragOffset) return;
    document.body.style.cursor = dragOffset ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragOffset]);

  // Safety net: end a drag even if the pointer is released outside the canvas.
  useEffect(() => {
    if (!dragOffset) return;
    const end = () => setDragOffset(null);
    // Don't select hero text while dragging the card across it.
    document.body.style.userSelect = "none";
    window.addEventListener("pointerup", end);
    window.addEventListener("blur", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("blur", end);
      document.body.style.userSelect = "";
    };
  }, [dragOffset]);

  useFrame((state, delta) => {
    const { vec, dir, ang, rot } = temp;
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    if (dragOffset) {
      // Project the pointer onto the card's plane (z = 0).
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragOffset.x,
        y: vec.y - dragOffset.y,
        z: vec.z - dragOffset.z,
      });
    }

    [j1, j2].forEach((ref, i) => {
      const body = ref.current!;
      const target = body.translation();
      const current = (lerped.current[i] ??= new THREE.Vector3().copy(target));
      const dist = Math.max(0.1, Math.min(1, current.distanceTo(target)));
      current.lerp(target, Math.min(1, delta * (minSpeed + dist * (maxSpeed - minSpeed))));
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(lerped.current[1]!);
    curve.points[2].copy(lerped.current[0]!);
    curve.points[3].copy(fixed.current.translation()).add({ x: 0, y: -0.05, z: 0 });
    band.current?.geometry.setPoints(curve.getPoints(32));

    // Gently turn the card back to face the viewer.
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    (e.nativeEvent.target as Element).setPointerCapture?.(e.pointerId);
    const t = card.current!.translation();
    setDragOffset(new THREE.Vector3().copy(e.point).sub(temp.vec.set(t.x, t.y, t.z)));
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    (e.nativeEvent.target as Element).releasePointerCapture?.(e.pointerId);
    setDragOffset(null);
  }

  // Joints start bunched up next to the (off-screen) anchor, so on mount the card
  // drops in, swings through and settles at rest — the entrance animation is pure physics.
  return (
    <>
      <group position={[anchor.x, anchor.y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody ref={j1} position={[0.3, 0.2, 0]} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        <RigidBody ref={j2} position={[0.6, 0.35, 0]} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        <RigidBody ref={j3} position={[0.9, 0.45, 0]} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        <RigidBody
          ref={card}
          position={[0.9, 0.45 - CARD_CLIP_Y, 0]}
          {...segmentProps}
          type={dragOffset ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, 0.01]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
              <meshPhysicalMaterial
                map={textures.front}
                alphaTest={0.5}
                clearcoat={1}
                clearcoatRoughness={0.18}
                roughness={0.45}
                metalness={0.1}
              />
            </mesh>
            <mesh position={[0, 0, -0.002]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
              <meshPhysicalMaterial
                map={textures.back}
                alphaTest={0.5}
                clearcoat={1}
                clearcoatRoughness={0.18}
                roughness={0.45}
                metalness={0.1}
              />
            </mesh>
            <CardClip />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(size.width, size.height)}
          useMap={1}
          map={textures.band}
          repeat={new THREE.Vector2(-4, 1)}
          lineWidth={0.9}
        />
      </mesh>
    </>
  );
}

interface LanyardSceneProps {
  active: boolean;
  anchorX: number;
  /** Element whose pointer events drive the scene (the hero section). */
  eventSource: HTMLElement;
}

export default function LanyardScene({ active, anchorX, eventSource }: LanyardSceneProps) {
  const [textures, setTextures] = useState<LanyardTextures | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: LanyardTextures | null = null;
    createLanyardTextures(siteConfig.photo)
      .then((t) => {
        created = t;
        if (!cancelled) setTextures(t);
        else Object.values(t).forEach((tex) => tex.dispose());
      })
      .catch((err) => console.error("[lanyard] texture creation failed", err));
    return () => {
      cancelled = true;
      if (created) Object.values(created).forEach((tex) => tex.dispose());
    };
  }, []);

  return (
    <Canvas
      // Stop the render loop entirely while the hero is off-screen.
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 13], fov: 25 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={eventSource}
      events={sectionEvents}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      {textures && (
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate paused={!active}>
          <Band textures={textures} anchorX={anchorX} />
        </Physics>
      )}
      <Environment resolution={256}>
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="#93c5fd"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="#6ee7b7"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}
