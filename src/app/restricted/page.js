"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/components/socketContext';
import styles from './styles.module.css';

export default function RestrictedPage() {
  const router = useRouter();
  const socket = useSocket();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    
    // Force socket reconnection to get a new socket.id
    if (socket) {
      socket.disconnect();
      socket.connect();
      
      // Wait for connection and new socket.id
      socket.on('connect', () => {
        setIsGenerating(false);
        router.push('/archive');
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Access Restricted</h1>
        <p className={styles.message}>
          Sorry, you are not recognized as a magical girl. Only magical girls can access this space.
        </p>
        <div className={styles.helpText}>
          <p>Need to prove you're a magical girl?</p>
          <button 
            onClick={handleGenerateToken}
            disabled={isGenerating}
            className={styles.generateButton}
          >
            {isGenerating ? 'Generating...' : 'Generate Magical Token'}
          </button>
        </div>
      </div>
    </div>
  );
}