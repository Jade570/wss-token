// app/contexts/ToggleContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const ToggleContext = createContext();

export function ToggleProvider({ children }) {
  const [toggle, setToggle] = useState(false);
  return (
    <ToggleContext.Provider value={{ toggle, setToggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggle must be used within a ToggleProvider");
  }
  return context;
}
