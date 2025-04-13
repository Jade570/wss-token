'use client';

import { AnimatePresence } from 'framer-motion';
import { SocketProvider } from "../components/socketContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
<link href="https://fonts.googleapis.com/css2?family=Orbit&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Special+Gothic+Expanded+One&display=swap" rel="stylesheet"></link>
      </head>
      <body style={{margin:"0"}}>
        {/* 페이지 전환 애니메이션 */}
        <AnimatePresence mode="wait">
          {/* SocketProvider로 children을 감싸서 소켓 연결을 제공 */}
          <SocketProvider>
          {children}
          </SocketProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}
