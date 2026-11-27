'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, CalendarDays, List, Clock, MapPin, Plus,
  Pencil, Trash2, X, CalendarRange, History,
} from 'lucide-react';
import {
  Division, EventType, DIVISION_COLORS, DIVISION_LABELS, MONTHS_ID, MONTHS_SHORT_ID, WEEKDAYS_ID,
  addDays, buildMonthGrid, daysBetween, eventEnd, formatRange, formatWeekdayLong, fromKey,
  isEventOnDate, isMultiDay, sortEvents, toKey,
} from '../../../lib/events';
import './events.css';

type Props = {
  events: EventType[];
  loading?: boolean;
  error?: string | null;
  canManage?: boolean;
  onAdd?: (dateKey: string) => void;
  onEdit?: (e: EventType) => void;
  onDelete?: (e: EventType) => void;
  /** tampilkan label "Publik/Internal" di kartu (untuk admin) */
  showVisibility?: boolean;
};

type View = 'month' | 'agenda';
const MAX_LANES = 3;

type Segment = { event: EventType; col: number; span: number; lane: number; isStart: boolean; isEnd: boolean };

/** Hitung batang acara per minggu (agar acara multi-hari tampil menyambung) */
function layoutWeek(weekDays: Date[], events: EventType[]) {
  const ws = toKey(weekDays[0]);
  const we = toKey(weekDays[6]);
  const overlapping = events
    .filter((e) => e.date <= we && eventEnd(e) >= ws)
    .sort((a, b) =>
      a.date === b.date ? daysBetween(b.date, eventEnd(b)) - daysBetween(a.date, eventEnd(a)) : a.date.localeCompare(b.date),
    );
  const laneEnds: string[] = [];
  const segments: Segment[] = [];
  const hiddenPerDay = Array(7).fill(0) as number[];

  for (const ev of overlapping) {
    const segStart = ev.date > ws ? ev.date : ws;
    const segEnd = eventEnd(ev) < we ? eventEnd(ev) : we;
    let lane = laneEnds.findIndex((end) => end < segStart);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(segEnd); } else { laneEnds[lane] = segEnd; }
    const col = daysBetween(ws, segStart);
    const span = daysBetween(segStart, segEnd) + 1;
    if (lane < MAX_LANES) {
      segments.push({ event: ev, col, span, lane, isStart: segStart === ev.date, isEnd: segEnd === eventEnd(ev) });
    } else {
      for (let i = col; i < col + span; i++) hiddenPerDay[i]++;
    }
  }
  return { segments, hiddenPerDay };
}

export default function EventCalendar({
  events, loading, error, canManage, onAdd, onEdit, onDelete, showVisibility,
}: Props) {
  const [todayKey, setTodayKey] = useState('');
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [selectedKey, setSelectedKey] = useState('');
  const [view, setView] = useState<View>('month');
  const [filter, setFilter] = useState<Division | 'semua'>('semua');
  const [detail, setDetail] = useState<EventType | null>(null);
  const [showPast, setShowPast] = useState(false);

  // Tanggal dihitung di client agar tidak terjadi hydration mismatch
  useEffect(() => {
    const now = new Date();
    setTodayKey(toKey(now));
    setSelectedKey(toKey(now));
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }, []);

  const divisionsPresent = useMemo(() => {
    const s = new Set<Division>();
    events.forEach((e) => s.add(e.division || 'all'));
    return (Object.keys(DIVISION_LABELS) as Division[]).filter((d) => s.has(d));
  }, [events]);

  const filtered = useMemo(
    () => sortEvents(filter === 'semua' ? events : events.filter((e) => (e.division || 'all') === filter)),
    [events, filter],
  );

  const ready = !!todayKey;
  const grid = ready ? buildMonthGrid(viewYear, viewMonth) : [];
  const weeks = Array.from({ length: grid.length / 7 }, (_, i) => grid.slice(i * 7, i * 7 + 7));

  const shiftMonth = (n: number) => {
    const d = new Date(viewYear, viewMonth + n, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const goToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedKey(toKey(now));
  };
  const selectDay = (d: Date) => {
    setSelectedKey(toKey(d));
    if (d.getMonth() !== viewMonth) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
  };

  const eventsOnSelected = filtered.filter((e) => isEventOnDate(e, selectedKey));
  const upcoming = filtered.filter((e) => eventEnd(e) >= todayKey);
  const past = filtered.filter((e) => eventEnd(e) < todayKey).reverse();

  // ---------- Kartu acara ----------
  const EventCard = ({ e, compact }: { e: EventType; compact?: boolean }) => {
    const div: Division = e.division || 'all';
    const color = DIVISION_COLORS[div];
    const isPast = eventEnd(e) < todayKey;
    const isOngoing = e.date <= todayKey && eventEnd(e) >= todayKey;
    const d = fromKey(e.date);
    return (
      <div
        className={`ev-card ${isPast ? 'past' : ''} ${compact ? 'compact' : ''}`}
        style={{ ['--ev-color' as any]: color }}
        onClick={() => setDetail(e)}
        role="button"
        tabIndex={0}
        onKeyDown={(k) => { if (k.key === 'Enter') setDetail(e); }}
      >
        <div className="ev-card-date">
          <span className="ev-card-day">{d.getDate()}</span>
          <span className="ev-card-mon">{MONTHS_SHORT_ID[d.getMonth()]}</span>
        </div>
        <div className="ev-card-body">
          <div className="ev-card-tags">
            <span className="ev-tag" style={{ background: `${color}22`, color, borderColor: `${color}55` }}>
              {DIVISION_LABELS[div]}
            </span>
            {isOngoing && <span className="ev-tag live">Berlangsung</span>}
            {isMultiDay(e) && <span className="ev-tag muted">{daysBetween(e.date, eventEnd(e)) + 1} hari</span>}
            {showVisibility && (
              <span className="ev-tag muted">{div === 'all' ? 'Publik' : 'Internal'}</span>
            )}
          </div>
          <h4>{e.title}</h4>
          <div className="ev-card-meta">
            <span><CalendarRange size={13} /> {formatRange(e.date, e.endDate)}</span>
            {e.time && <span><Clock size={13} /> {e.time}</span>}
            {e.location && <span><MapPin size={13} /> {e.location}</span>}
          </div>
        </div>
        {canManage && (
          <div className="ev-card-actions" onClick={(x) => x.stopPropagation()}>
            <button type="button" className="ev-icon-btn" title="Edit" onClick={() => onEdit?.(e)}>
              <Pencil size={15} />
            </button>
            <button type="button" className="ev-icon-btn danger" title="Hapus" onClick={() => onDelete?.(e)}>
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ---------- Tampilan Agenda (dikelompokkan per bulan) ----------
  const agendaList = showPast ? past : upcoming;
  const agendaGroups = useMemo(() => {
    const groups: { label: string; items: EventType[] }[] = [];
    agendaList.forEach((e) => {
      const d = fromKey(e.date);
      const label = `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
      const g = groups[groups.length - 1];
      if (g && g.label === label) g.items.push(e); else groups.push({ label, items: [e] });
    });
    return groups;
  }, [agendaList]);

  return (
    <>
    <div className="ev-root">
      {/* ===== TOOLBAR ===== */}
      <div className="ev-toolbar">
        <div className="ev-toolbar-left">
          {view === 'month' ? (
            <>
              <button type="button" className="ev-icon-btn" onClick={() => shiftMonth(-1)} aria-label="Bulan sebelumnya">
                <ChevronLeft size={20} />
              </button>
              <h3 className="ev-month-title">{ready ? `${MONTHS_ID[viewMonth]} ${viewYear}` : '—'}</h3>
              <button type="button" className="ev-icon-btn" onClick={() => shiftMonth(1)} aria-label="Bulan berikutnya">
                <ChevronRight size={20} />
              </button>
              <button type="button" className="ev-btn ghost sm" onClick={goToday}>Hari ini</button>
            </>
          ) : (
            <>
              <h3 className="ev-month-title">{showPast ? 'Acara Selesai' : 'Acara Mendatang'}</h3>
              <button type="button" className="ev-btn ghost sm" onClick={() => setShowPast(!showPast)}>
                <History size={14} /> {showPast ? 'Lihat mendatang' : 'Lihat yang sudah lewat'}
              </button>
            </>
          )}
        </div>
        <div className="ev-toolbar-right">
          <div className="ev-segmented" role="tablist">
            <button type="button" className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>
              <CalendarDays size={15} /> Kalender
            </button>
            <button type="button" className={view === 'agenda' ? 'active' : ''} onClick={() => setView('agenda')}>
              <List size={15} /> Agenda
            </button>
          </div>
          {canManage && (
            <button type="button" className="ev-btn primary" onClick={() => onAdd?.(selectedKey || todayKey)}>
              <Plus size={16} /> Tambah Jadwal
            </button>
          )}
        </div>
      </div>

      {divisionsPresent.length > 1 && (
        <div className="ev-filters">
          <button type="button" className={`ev-chip ${filter === 'semua' ? 'active' : ''}`} onClick={() => setFilter('semua')}>
            Semua
          </button>
          {divisionsPresent.map((d) => (
            <button
              key={d}
              type="button"
              className={`ev-chip ${filter === d ? 'active' : ''}`}
              onClick={() => setFilter(d)}
              style={{ ['--ev-color' as any]: DIVISION_COLORS[d] }}
            >
              <i className="ev-chip-dot" /> {DIVISION_LABELS[d]}
            </button>
          ))}
        </div>
      )}

      {error && <p className="ev-error">{error}</p>}

      {view === 'month' ? (
        <div className="ev-layout">
          {/* ===== GRID BULAN ===== */}
          <div className="ev-month">
            <div className="ev-weekdays">
              {WEEKDAYS_ID.map((w, i) => <span key={w} className={i >= 5 ? 'weekend' : ''}>{w}</span>)}
            </div>
            {!ready || loading ? (
              <div className="ev-skeleton">Memuat kalender...</div>
            ) : (
              weeks.map((week, wi) => {
                const { segments, hiddenPerDay } = layoutWeek(week, filtered);
                return (
                  <div key={wi} className="ev-week">
                    {week.map((d, di) => {
                      const key = toKey(d);
                      const dayEvents = filtered.filter((e) => isEventOnDate(e, key));
                      const cls = [
                        'ev-day',
                        d.getMonth() !== viewMonth ? 'other' : '',
                        key === todayKey ? 'today' : '',
                        key === selectedKey ? 'selected' : '',
                        di >= 5 ? 'weekend' : '',
                        key < todayKey ? 'past' : '',
                      ].join(' ');
                      return (
                        <button
                          key={key}
                          type="button"
                          className={cls}
                          style={{ gridColumn: di + 1 }}
                          onClick={() => selectDay(d)}
                          onDoubleClick={() => canManage && onAdd?.(key)}
                          aria-label={`${formatWeekdayLong(key)}, ${dayEvents.length} acara`}
                        >
                          <span className="ev-day-num">{d.getDate()}</span>
                          {dayEvents.length > 0 && (
                            <span className="ev-day-dots">
                              {dayEvents.slice(0, 3).map((e) => (
                                <i key={e.id} style={{ background: DIVISION_COLORS[e.division || 'all'] }} />
                              ))}
                            </span>
                          )}
                          {hiddenPerDay[di] > 0 && <span className="ev-day-more">+{hiddenPerDay[di]} lagi</span>}
                        </button>
                      );
                    })}
                    <div className="ev-week-bars">
                      {segments.map((s) => {
                        const color = DIVISION_COLORS[s.event.division || 'all'];
                        return (
                          <button
                            key={`${s.event.id}-${wi}`}
                            type="button"
                            className={`ev-bar ${s.isStart ? 'start' : ''} ${s.isEnd ? 'end' : ''} ${eventEnd(s.event) < todayKey ? 'past' : ''}`}
                            style={{
                              gridColumn: `${s.col + 1} / span ${s.span}`,
                              gridRow: s.lane + 1,
                              ['--ev-color' as any]: color,
                            }}
                            onClick={() => { setSelectedKey(toKey(addDays(week[0], s.col))); setDetail(s.event); }}
                            title={`${s.event.title} • ${formatRange(s.event.date, s.event.endDate)}`}
                          >
                            {s.event.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
            <div className="ev-legend">
              {(Object.keys(DIVISION_LABELS) as Division[]).filter((d) => divisionsPresent.includes(d)).map((d) => (
                <span key={d}><i style={{ background: DIVISION_COLORS[d] }} /> {DIVISION_LABELS[d]}</span>
              ))}
              {canManage && <span className="ev-legend-tip">Tip: klik dua kali pada tanggal untuk menambah jadwal</span>}
            </div>
          </div>

          {/* ===== PANEL SAMPING ===== */}
          <aside className="ev-side">
            <div className="ev-side-head">
              <span className="ev-side-label">Jadwal pada</span>
              <h4>{selectedKey ? formatWeekdayLong(selectedKey) : '—'}</h4>
            </div>
            <div className="ev-side-list">
              {eventsOnSelected.length > 0 ? (
                eventsOnSelected.map((e) => <EventCard key={e.id} e={e} compact />)
              ) : (
                <div className="ev-empty">
                  <CalendarDays size={28} />
                  <p>Tidak ada acara pada tanggal ini.</p>
                  {canManage && selectedKey && (
                    <button type="button" className="ev-btn ghost sm" onClick={() => onAdd?.(selectedKey)}>
                      <Plus size={14} /> Tambah di tanggal ini
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="ev-side-head" style={{ marginTop: 20 }}>
              <span className="ev-side-label">Segera hadir</span>
            </div>
            <div className="ev-side-list">
              {upcoming.filter((e) => !isEventOnDate(e, selectedKey)).slice(0, 3).map((e) => (
                <EventCard key={e.id} e={e} compact />
              ))}
              {upcoming.length === 0 && <p className="ev-muted">Belum ada acara mendatang.</p>}
            </div>
          </aside>
        </div>
      ) : (
        /* ===== TAMPILAN AGENDA ===== */
        <div className="ev-agenda">
          {loading ? (
            <div className="ev-skeleton">Memuat agenda...</div>
          ) : agendaGroups.length === 0 ? (
            <div className="ev-empty">
              <CalendarDays size={32} />
              <p>{showPast ? 'Belum ada acara yang selesai.' : 'Belum ada acara mendatang.'}</p>
            </div>
          ) : (
            agendaGroups.map((g) => (
              <div key={g.label} className="ev-agenda-group">
                <h5>{g.label}</h5>
                <div className="ev-agenda-items">
                  {g.items.map((e) => <EventCard key={e.id} e={e} />)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>

      {/* ===== DETAIL ACARA (di luar .ev-root agar position: fixed tidak terkurung container) ===== */}
      {detail && (
        <div className="ev-modal-backdrop" onMouseDown={() => setDetail(null)}>
          <div className="ev-modal ev-detail" onMouseDown={(x) => x.stopPropagation()} role="dialog" aria-modal="true">
            <div
              className="ev-detail-banner"
              style={{ ['--ev-color' as any]: DIVISION_COLORS[detail.division || 'all'] }}
            >
              <span className="ev-tag solid">{DIVISION_LABELS[detail.division || 'all']}</span>
              <button type="button" className="ev-icon-btn" onClick={() => setDetail(null)} aria-label="Tutup">
                <X size={20} />
              </button>
            </div>
            <div className="ev-detail-body">
              <h3>{detail.title}</h3>
              <ul className="ev-detail-meta">
                <li>
                  <CalendarRange size={16} />
                  <div>
                    <b>{formatRange(detail.date, detail.endDate)}</b>
                    {isMultiDay(detail) && <small>{daysBetween(detail.date, eventEnd(detail)) + 1} hari</small>}
                  </div>
                </li>
                {detail.time && <li><Clock size={16} /><div><b>{detail.time}</b></div></li>}
                {detail.location && <li><MapPin size={16} /><div><b>{detail.location}</b></div></li>}
              </ul>
              {detail.description && <p className="ev-detail-desc">{detail.description}</p>}
              {canManage && (
                <div className="ev-modal-actions">
                  <button type="button" className="ev-btn danger" onClick={() => { const d = detail; setDetail(null); onDelete?.(d); }}>
                    <Trash2 size={15} /> Hapus
                  </button>
                  <button type="button" className="ev-btn primary" onClick={() => { const d = detail; setDetail(null); onEdit?.(d); }}>
                    <Pencil size={15} /> Edit Jadwal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
