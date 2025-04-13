"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("wss://wssserver.chaeryeongoh.com/", {
      path: "/socket.io",
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("websocket connected", socketInstance.id);
    });
    socketInstance.on("disconnect", () => {
      console.log("websocket disconnected");
    });

    // App Router에서는 페이지 전환 시에도 이 컴포넌트는 계속 유지되도록 _layout.js 또는 layout.js에서 SocketProvider로 감싸야 합니다.
    // cleanup 함수는 socket 연결을 끊지 않도록 생략하거나 별도로 관리합니다.
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
