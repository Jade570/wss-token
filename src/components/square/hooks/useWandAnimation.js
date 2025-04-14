"use client";

import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

// 완드 애니메이션을 위한 커스텀 훅
export default function useWandAnimation({ socket, myId, playerPivotRefs }) {
  const animatingRef = useRef(false);

  // 노드 애니메이션 핸들러
  const nodWand = useCallback(() => {
    if (animatingRef.current || !myId || !playerPivotRefs.current[myId]) return;

    animatingRef.current = true;
    gsap
      .timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      })
      .to(playerPivotRefs.current[myId].rotation, {
        duration: 0.2,
        x: "+=0.3",
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
      })
      .to(playerPivotRefs.current[myId].rotation, {
        duration: 0.2,
        x: "+=0.3",
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
      });
    
    socket.emit("shake", { id: myId });
  }, [socket, myId, playerPivotRefs]);

  // 다른 플레이어의 노드 애니메이션 처리
  useEffect(() => {
    if (!socket) return;

    const handleShake = (data) => {
      const { id } = data;
      if (playerPivotRefs.current[id]) {
        gsap.timeline().to(playerPivotRefs.current[id].rotation, {
          duration: 0.2,
          x: "+=0.3",
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        });
      }
    };

    socket.on("shake", handleShake);
    return () => socket.off("shake", handleShake);
  }, [socket, playerPivotRefs]);

  return { nodWand };
}