"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 클라이언트 마운트 전엔 아무것도 렌더링하지 않음

  return (
    <div style={{background:"#000000ff", margin: 0, overflow: 'hidden' }}>
      Hi
    </div>
  );
}
