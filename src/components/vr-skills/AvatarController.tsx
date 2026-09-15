"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export type AvatarAnimation = "idle" | "listen" | "speak" | "think" | "gesture" | "walk";

export function AvatarController({
  name,
  role,
  palette,
  position = [0, 0, 0],
  animation = "idle",
  active = false,
  showLabel = true,
  onSelect,
}: {
  name: string;
  role: string;
  palette: string;
  position?: [number, number, number];
  animation?: AvatarAnimation;
  active?: boolean;
  showLabel?: boolean;
  onSelect?: () => void;
}) {
  const group = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) group.current.position.y = position[1] + Math.sin(time * 1.8) * (animation === "walk" ? 0.035 : 0.012);
    if (leftArm.current) leftArm.current.rotation.x = animation === "gesture" || animation === "speak" ? -0.45 + Math.sin(time * 2.8) * 0.18 : Math.sin(time * 1.3) * 0.035;
    if (rightArm.current) rightArm.current.rotation.x = animation === "walk" ? Math.sin(time * 4) * 0.45 : animation === "speak" ? -0.3 + Math.cos(time * 2.4) * 0.14 : 0;
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(event) => { event.stopPropagation(); onSelect?.(); }}
      onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { document.body.style.cursor = "default"; }}
    >
      <mesh castShadow position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.23, 24, 24]} />
        <meshStandardMaterial color="#704c38" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.15, 0]}>
        <capsuleGeometry args={[0.34, 0.68, 8, 20]} />
        <meshStandardMaterial color={palette} roughness={0.58} />
      </mesh>
      <group ref={leftArm} position={[-0.43, 1.38, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}><capsuleGeometry args={[0.09, 0.48, 6, 12]} /><meshStandardMaterial color={palette} /></mesh>
      </group>
      <group ref={rightArm} position={[0.43, 1.38, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}><capsuleGeometry args={[0.09, 0.48, 6, 12]} /><meshStandardMaterial color={palette} /></mesh>
      </group>
      <mesh castShadow position={[-0.18, 0.45, 0]}><capsuleGeometry args={[0.11, 0.62, 6, 12]} /><meshStandardMaterial color="#27364a" /></mesh>
      <mesh castShadow position={[0.18, 0.45, 0]}><capsuleGeometry args={[0.11, 0.62, 6, 12]} /><meshStandardMaterial color="#27364a" /></mesh>
      {showLabel ? <Html center position={[0, 3, 0]}>
        <button type="button" onClick={onSelect} className={`w-28 rounded-lg border px-2 py-1.5 text-center text-[10px] font-bold leading-tight shadow-xl ${active ? "border-teal-200 bg-teal-700 text-white" : "border-white/70 bg-slate-950/90 text-white"}`}>
          <span className="block">{name}</span><span className="mt-0.5 block text-[9px] font-semibold opacity-70">{role}</span>
        </button>
      </Html> : null}
    </group>
  );
}
