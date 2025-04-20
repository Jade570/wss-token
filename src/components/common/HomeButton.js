"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomeButton({ onClick }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "10px",
        zIndex: 1000,
        width: "35px",
        height: "35px",
        backgroundColor: "#fff",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.3s",
        backgroundImage: "url('/home.png')",
        backgroundSize: "80%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></button>
  );
}
