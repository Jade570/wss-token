// app/layout.js
"use client";

import { AnimatePresence } from "framer-motion";
import { SocketProvider } from "../components/socketContext";
import { ToggleProvider } from "../components/toggleContext";
import AuthGuard from "../components/authGuard";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbit&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Special+Gothic+Expanded+One&display=swap"
          rel="stylesheet"
          as="style"
        />
      </head>
      <body style={{ margin: "0", background: "#000" }}>
        <AnimatePresence mode="wait">
          <ToggleProvider>
            <SocketProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </SocketProvider>
          </ToggleProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
