// components/AuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSocket } from "./socketContext";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const socket = useSocket();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // If we're already on the restricted page, don't redirect
    if (pathname === "/restricted") {
      setReady(true);
      return;
    }

    if (!socket) {
      setReady(false);
      return;
    }

    const handleConnect = () => {
      if (socket.id) {
        setReady(true);
      } else {
        router.push("/restricted");
      }
    };

    const handleDisconnect = () => {
      setReady(false);
      if (pathname !== "/restricted") {
        router.push("/restricted");
      }
    };

    // Check initial connection state
    if (socket.connected && socket.id) {
      setReady(true);
    } else {
      router.push("/restricted");
    }

    // Listen for connection events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, router, pathname]);

  if (!ready) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontFamily: '"PT Serif", serif'
      }}>
        Loading...
      </div>
    );
  }

  return children;
}
