"use client";

import React from 'react';

export function VolumeSlider({ volume, onVolumeChange, className, style }) {
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "10px", ...style }}>
      <label style={{ color: "#fff" }}>Volume:</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        style={{ width: "100px" }}
      />
    </div>
  );
}