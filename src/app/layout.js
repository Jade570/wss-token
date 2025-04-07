'use client';

import { AnimatePresence } from 'framer-motion';
import { SocketProvider } from "../socketContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:"0"}}>
        {/* 페이지 전환 애니메이션 */}
        <AnimatePresence mode="wait" initial={false}>
          <SocketProvider>
          {children}
          </SocketProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
