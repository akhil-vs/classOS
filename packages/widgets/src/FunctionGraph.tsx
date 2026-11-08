"use client";

import { PointerSlider } from "@classos/input-kit";
import { useMemo, useState } from "react";

export function FunctionGraph() {
  const [amplitude, setAmplitude] = useState(2);
  const [frequency, setFrequency] = useState(1);

  const path = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = i / 120;
      const angle = (x * 2 - 1) * Math.PI * frequency;
      const y = 0.5 - (Math.sin(angle) * amplitude) / 8;
      points.push(`${x * 280},${y * 140}`);
    }
    return `M ${points.join(" L ")}`;
  }, [amplitude, frequency]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <svg viewBox="0 0 280 140" width="100%" height={140} role="img" aria-label="Sine graph">
        <rect width="280" height="140" fill="rgba(0,0,0,0.25)" rx="8" />
        <line x1="0" y1="70" x2="280" y2="70" stroke="rgba(214,230,212,0.25)" />
        <line x1="140" y1="0" x2="140" y2="140" stroke="rgba(214,230,212,0.25)" />
        <path d={path} fill="none" stroke="var(--co-accent)" strokeWidth="2.5" />
      </svg>
      <PointerSlider
        label="Amplitude A"
        value={amplitude}
        min={0.5}
        max={4}
        step={0.5}
        onChange={setAmplitude}
      />
      <PointerSlider
        label="Frequency B"
        value={frequency}
        min={0.5}
        max={4}
        step={0.5}
        onChange={setFrequency}
      />
      <div style={{ fontFamily: "var(--co-font-mono)", fontSize: 13 }}>
        y = {amplitude} sin({frequency}x)
      </div>
    </div>
  );
}
