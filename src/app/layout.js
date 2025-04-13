'use client';

import { AnimatePresence } from 'framer-motion';
import { SocketProvider } from "../components/socketContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:"0"}}>
        {/* 페이지 전환 애니메이션 */}
        <AnimatePresence mode="wait" initial={false}>
          {/* SocketProvider로 children을 감싸서 소켓 연결을 제공 */}
          <SocketProvider>
          {children}
          </SocketProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
