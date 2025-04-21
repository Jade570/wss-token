"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './globals.css';
import styles from './page.module.css';
import WandCanvas from "@/components/wandCanvas";
import { useSocket } from "@/components/socketContext";

export default function Home() {
  const router = useRouter();
  const socket = useSocket();
  const [modelIndex, setModelIndex] = useState(0);
  
  useEffect(() => {
    if (!socket) return;

    // Request initial player data
    socket.emit("getPlayers");

    // Listen for initial player data and updates
    socket.on("playerData", (data) => {
      if (data.players[data.id]) {
        setModelIndex(data.players[data.id].model);
      }
    });

    socket.on("players", (players) => {
      if (socket.id && players[socket.id]) {
        setModelIndex(players[socket.id].model);
      }
    });

    return () => {
      socket.off("playerData");
      socket.off("players");
    };
  }, [socket]);

  return (
    <div className={styles.page}>
      <WandCanvas
        canvasStyle={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          background: "transparent",
        }}
        cameraProps={{ position: [0, 0, 20], fov: 45 }}
        modelIndex={modelIndex}
        hue={[255, 255, 255]}
        useOrbit={false}
      />
      <div className={styles.main} style={{ 
        textAlign: 'center', 
        maxWidth: '800px', 
        color: '#fff',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '40px',
        borderRadius: '10px'
      }}>
        <h1 style={{ 
          fontFamily: '"Special Gothic Expanded One", sans-serif',
          marginBottom: '0px'
        }}>
          Welcome to the Magical Space!
        </h1>
        <p style={{ 
          fontFamily: '"PT Serif", serif',
          lineHeight: '1.5',
          color: '#ccc',
          textAlign: 'left',
          textIndent: '0',
          marginBottom: '40px'
        }}>
          Welcome to my private space of tender and shy thoughts - where sorrows,
          cherished memories, and hopes intertwine. Explore the reflections tied
          to each color and discover your own magical hue.
        </p>

        <button
          onClick={() => router.push('/archive/red')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontFamily: '"Special Gothic Expanded One", sans-serif',
            border: '2px solid #fff',
            borderRadius: '4px',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '20px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
          }}
        >
          Enter!
        </button>
      </div>
    </div>
  );
}
