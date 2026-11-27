'use client';

import React from 'react';
import { DEFAULT_TIME } from '../../../lib/events';

type Props = {
  value: string;              // 'HH:MM'
  onChange: (v: string) => void;
  label?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

/** Pemilih jam format 24 jam (tanpa AM/PM) + label WIB */
export default function TimePicker24({ value, onChange, label }: Props) {
  const [h, m] = (value || DEFAULT_TIME).split(':');
  // pertahankan menit lama yang bukan kelipatan 5 (dari data lama)
  const minutes = MINUTES.includes(m) ? MINUTES : [...MINUTES, m].sort();

  return (
    <div className="ev-time" role="group" aria-label={label}>
      <select aria-label={`${label || 'Jam'} - jam`} value={h} onChange={(e) => onChange(`${e.target.value}:${m}`)}>
        {HOURS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <span className="ev-time-sep">.</span>
      <select aria-label={`${label || 'Jam'} - menit`} value={m} onChange={(e) => onChange(`${h}:${e.target.value}`)}>
        {minutes.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <span className="ev-time-zone">WIB</span>
    </div>
  );
}
