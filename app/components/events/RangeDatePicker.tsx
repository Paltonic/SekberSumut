'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import {
  MONTHS_ID, WEEKDAYS_ID, buildMonthGrid, daysBetween, formatWeekdayLong, toKey, fromKey,
} from '../../../lib/events';

type Props = {
  start: string;           // YYYY-MM-DD ('' = belum dipilih)
  end: string;             // YYYY-MM-DD ('' = belum dipilih)
  onChange: (start: string, end: string) => void;
};

/**
 * Pemilih rentang tanggal ala booking hotel / tiket pesawat:
 * klik tanggal mulai, lalu klik tanggal selesai. Dua bulan tampil berdampingan.
 */
export default function RangeDatePicker({ start, end, onChange }: Props) {
  const initial = start ? fromKey(start) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [hoverKey, setHoverKey] = useState<string>('');
  // true = klik berikutnya menentukan tanggal selesai
  const [pickingEnd, setPickingEnd] = useState(false);

  const todayKey = toKey(new Date());

  const months = useMemo(() => {
    const m1 = { y: viewYear, m: viewMonth };
    const next = new Date(viewYear, viewMonth + 1, 1);
    const m2 = { y: next.getFullYear(), m: next.getMonth() };
    return [m1, m2];
  }, [viewYear, viewMonth]);

  const shift = (n: number) => {
    const d = new Date(viewYear, viewMonth + n, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handlePick = (key: string) => {
    if (!pickingEnd || !start || key < start) {
      onChange(key, key);
      setPickingEnd(true);
      return;
    }
    onChange(start, key);
    setPickingEnd(false);
    setHoverKey('');
  };

  // Rentang yang di-highlight (termasuk pratinjau saat hover)
  const previewEnd = pickingEnd && hoverKey && start && hoverKey >= start ? hoverKey : end;
  const rangeStart = start;
  const rangeEnd = previewEnd || start;

  const totalDays = start && end ? daysBetween(start, end) + 1 : 0;

  return (
    <div className="ev-range">
      <div className="ev-range-summary">
        <button
          type="button"
          className={`ev-range-box ${!pickingEnd ? 'focus' : ''}`}
          onClick={() => setPickingEnd(false)}
        >
          <span className="ev-range-label">Mulai</span>
          <span className="ev-range-value">{start ? formatWeekdayLong(start) : 'Pilih tanggal'}</span>
        </button>
        <div className="ev-range-arrow">
          <CalendarDays size={16} />
          {totalDays > 0 && <span>{totalDays} hari</span>}
        </div>
        <button
          type="button"
          className={`ev-range-box ${pickingEnd ? 'focus' : ''}`}
          onClick={() => start && setPickingEnd(true)}
        >
          <span className="ev-range-label">Selesai</span>
          <span className="ev-range-value">{end ? formatWeekdayLong(end) : 'Pilih tanggal'}</span>
        </button>
      </div>

      <p className="ev-range-hint">
        {pickingEnd
          ? 'Sekarang klik tanggal selesai (klik tanggal yang sama untuk acara 1 hari).'
          : 'Klik tanggal mulai acara.'}
      </p>

      <div className="ev-range-months" onMouseLeave={() => setHoverKey('')}>
        {months.map(({ y, m }, idx) => {
          const grid = buildMonthGrid(y, m);
          return (
            <div key={`${y}-${m}`} className={`ev-range-month ${idx === 1 ? 'second' : ''}`}>
              <div className="ev-range-month-head">
                <button
                  type="button"
                  className={`ev-icon-btn ${idx === 0 ? '' : 'ev-hide-desktop'}`}
                  onClick={() => shift(-1)}
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{MONTHS_ID[m]} {y}</span>
                <button
                  type="button"
                  className={`ev-icon-btn ${idx === 1 ? '' : 'ev-hide-desktop-next'}`}
                  onClick={() => shift(1)}
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="ev-range-weekdays">
                {WEEKDAYS_ID.map((w) => <span key={w}>{w}</span>)}
              </div>
              <div className="ev-range-grid">
                {grid.map((d) => {
                  const key = toKey(d);
                  const inMonth = d.getMonth() === m;
                  if (!inMonth) return <span key={key} className="ev-range-cell empty" />;
                  const isStart = key === rangeStart;
                  const isEnd = key === rangeEnd;
                  const inRange = rangeStart && key > rangeStart && key < rangeEnd;
                  const cls = [
                    'ev-range-cell',
                    isStart ? 'start' : '',
                    isEnd ? 'end' : '',
                    inRange ? 'in-range' : '',
                    isStart && isEnd ? 'single' : '',
                    rangeStart && rangeEnd > rangeStart && (isStart || isEnd || inRange) ? 'has-range' : '',
                    key === todayKey ? 'today' : '',
                  ].join(' ');
                  return (
                    <button
                      key={key}
                      type="button"
                      className={cls}
                      onClick={() => handlePick(key)}
                      onMouseEnter={() => setHoverKey(key)}
                    >
                      <span>{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
