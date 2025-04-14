// app/layout.js
"use client";

import { AnimatePresence } from "framer-motion";
import { SocketProvider } from "../components/socketContext";
import AuthGuard from "../components/authGuard";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbit&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Special+Gothic+Expanded+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: "0" }}>
        <AnimatePresence mode="wait">
          <SocketProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </SocketProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
