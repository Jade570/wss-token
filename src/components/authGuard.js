// components/AuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./socketContext";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const socket = useSocket();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 소켓 인스턴스가 아직 null이면 연결 중이므로 대기
    if (!socket) return;

    // 소켓이 연결되었으나 socket.id가 없다면 /restricted로 리디렉션
    if (!socket.id) {
      router.push("/restricted");
    } else {
      setReady(true);
    }
  }, [socket, router]);

  if (!ready) {
    // 로딩 상태 또는 빈 화면을 렌더링합니다.
    return <div>Loading...</div>;
  }

  return children;
}
