"use client";

import React from 'react';
import Wand from '@/components/wand.js';
import colors from '@/components/generalInfo.js';

// 완드 그룹 컴포넌트 - 개별 플레이어의 완드 시각화를 담당
export default function WandGroup({ player, pivotRef }) {
  const modelIndex = player.model;
  const colorKey = player.color;
  const hue = colors[colorKey] || 0;
  const x = player.x;
  const y = player.y;
  const z = player.z || 0;

  return (
    <group
      position={[x, y, z]}
      ref={pivotRef}
    >
      <Wand modelIndex={modelIndex} hue={hue} />
    </group>
  );
}