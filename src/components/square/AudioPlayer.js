"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import chordFrequencies from "./audio/chordFrequencies";
import chordProgression from "./audio/chordProgressions";
import noteToFrequency from "./audio/webAudioFunc";

// 색상별 사운드 파일 매핑
const soundPaths = {
  red: ["/sounds/red/soojeong_103.mp3"],
  orange: ["/sounds/orange/me_ktx_to_seoul.mp3"],
  yellow: ["/sounds/yellow/eunji_study.mp3"],
  green: ["/sounds/green/jiwon_eulsukdo.mp3"],
  blue: ["/sounds/blue/20240214-creative-response4.mp3"],
  violet: ["/sounds/violet/minseo_yongsanstation.mp3"]
};

// 코드 요소를 주파수로 변환하는 함수
function getChordFrequencies(chordElement) {
  if (typeof chordElement === "string") {
    return chordFrequencies[chordElement]?.map(noteToFrequency) || [];
  }
  
  if (Array.isArray(chordElement)) {
    const frequencies = chordElement.map(chord => 
      chordFrequencies[chord]?.map(noteToFrequency) || []
    );
    return frequencies.flat();
  }
  
  return [];
}

export default function AudioPlayer({ socket, player, className, players }) {
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [volume, setVolume] = useState(0.1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const ambientAudioRef = useRef(null);
  const volumeRef = useRef(volume);
  const currentChordIndexRef = useRef(0);
  const bandpassFiltersRef = useRef([]);
  const sourceNodeRef = useRef(null);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (audioContext) return;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      await ctx.resume();

      const gain = ctx.createGain();
      const filters = Array(4).fill().map(() => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 440;
        filter.Q.value = 0;
        filter.connect(gain);
        return filter;
      });
      
      gain.connect(ctx.destination);
      gain.gain.value = volumeRef.current;
      
      setAudioContext(ctx);
      setGainNode(gain);
      bandpassFiltersRef.current = filters;
      setAudioEnabled(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }, [audioContext]);

  // Add touch/click listener for mobile
  useEffect(() => {
    const handleInteraction = async () => {
      await initializeAudio();
      // Remove listener after first interaction
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [initializeAudio]);

  // Keep volume ref in sync
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Update Q values based on number of players
  useEffect(() => {
    if (!bandpassFiltersRef.current.length || !players) return;
    
    const activeWands = Object.values(players).filter(p => p.entered === 1).length;
    const qValue = activeWands * 0.5;
    
    bandpassFiltersRef.current.forEach(filter => {
      if (filter) filter.Q.value = qValue;
    });
  }, [players]);

  // Volume change handler
  const handleVolumeChange = useCallback((event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.value = newVolume;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = newVolume;
    }
  }, [gainNode]);

  // Update filter frequencies based on chord progression
  useEffect(() => {
    if (!audioEnabled || !audioContext || !bandpassFiltersRef.current.length) return;
    
    const progression = chordProgression["marching_orig"];
    if (!progression) return;
    
    const updateFilterFrequencies = () => {
      const chord = progression[currentChordIndexRef.current];
      const frequencies = getChordFrequencies(chord);
      
      frequencies.forEach((freq, index) => {
        const filterIndex = index % bandpassFiltersRef.current.length;
        if (bandpassFiltersRef.current[filterIndex]) {
          bandpassFiltersRef.current[filterIndex].frequency.value = freq;
        }
      });
      
      currentChordIndexRef.current = (currentChordIndexRef.current + 1) % progression.length;
    };

    const intervalId = setInterval(updateFilterFrequencies, 2000);
    updateFilterFrequencies();
    
    return () => clearInterval(intervalId);
  }, [audioContext, audioEnabled]);

  // Play and process ambient sound
  useEffect(() => {
    // Check if player has a valid color that exists in soundPaths
    if (!audioEnabled || !player?.color || !soundPaths[player.color] || !audioContext || !bandpassFiltersRef.current.length) return;
    
    // Double check that the color is actually one of our valid colors
    const validColors = Object.keys(soundPaths);
    if (!validColors.includes(player.color)) return;

    const setupAudio = async () => {
      try {
        // Resume context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audio = new Audio(soundPaths[player.color][0]);
        audio.loop = true;
        
        const source = audioContext.createMediaElementSource(audio);
        sourceNodeRef.current = source;
        
        bandpassFiltersRef.current.forEach(filter => {
          source.connect(filter);
        });
        
        audio.volume = volumeRef.current;
        await audio.play();
        
        ambientAudioRef.current = audio;
      } catch (error) {
        console.error("Audio playback error:", error);
        // Retry after a user interaction
        setAudioEnabled(false);
      }
    };

    setupAudio();
    
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        ambientAudioRef.current = null;
      }
    };
  }, [player?.color, audioContext, audioEnabled]);

  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ color: "#fff" }}>Volume:</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        style={{ width: "100px" }}
      />
      {!audioEnabled && (
        <span style={{ color: "#fff", fontSize: "0.8em", marginLeft: "10px", width: "200px" }}>
          Tap screen to enable audio
        </span>
      )}
    </div>
  );
}