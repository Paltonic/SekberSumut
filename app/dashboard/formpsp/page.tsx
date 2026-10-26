'use client';

import { useEffect, useMemo, useState } from 'react';
import './formpsp.css'; 
import { GROUPS, ITEMS, MARK_META, STORAGE_KEY, type MarkKey } from '../../data/psp';

const LEVEL_CLASS: Record<string, string> = {
  Hijau: 'levelHijau',
  Kuning: 'levelKuning',
  Merah: 'levelMerah',
};

export default function PspPage() {
  const [marks, setMarks] = useState<Partial<Record<number, MarkKey>>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [meta, setMeta] = useState({ nama: '', kota: '', tanggal: '' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setMarks(p.marks ?? {});
        setNotes(p.notes ?? {});
        setMeta({ nama: '', kota: '', tanggal: '', ...(p.meta ?? {}) });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ marks, notes, meta })); } catch {}
  }, [marks, notes, meta, ready]);

  const stats = useMemo(() => {
    let good = 0, notGood = 0, notExist = 0, point = 0, filled = 0;
    for (const it of ITEMS) {
      const m = marks[it.no];
      if (!m) continue;
      filled++;
      point += MARK_META[m].point;
      if (m === 'good') good++;
      else if (m === 'notGood') notGood++;
      else notExist++;
    }
    const maxPoint = filled * 2;
    const percent = maxPoint === 0 ? 0 : point / maxPoint;
    const level = percent >= 0.65 ? 'Hijau' : percent >= 0.3 ? 'Kuning' : 'Merah';
    return { good, notGood, notExist, point, filled, maxPoint, percent, level,
             total: ITEMS.length, complete: filled === ITEMS.length };
  }, [marks]);

  const setMark   = (no: number, m: MarkKey) => setMarks(p => ({ ...p, [no]: m }));
  const clearMark = (no: number) => setMarks(p => { const n = { ...p }; delete n[no]; return n; });
  const resetAll  = () => {
    if (!confirm('Kosongkan seluruh penilaian dan keterangan?')) return;
    setMarks({}); setNotes({});
  };

  return (
    <div className="psp-page">
      {/* ---------- PAGE HEADER ---------- */}
      <div className="psp-pageHeader">
        <div>
          <p className="psp-kicker">SEKBER PMVBI (Pemuda Buddhayana)</p>
          <h1 className="psp-title">Formulir Identifikasi — Program Standar PMV/C</h1>
        </div>
        <div className="psp-metaGrid">
          <label className="psp-field">
            <span>Nama PMV/C</span>
            <input type="text" value={meta.nama}
              placeholder="cth. PMV Dharma Bakti"
              onChange={e => setMeta({ ...meta, nama: e.target.value })} />
          </label>
          <label className="psp-field">
            <span>Kab / Kota</span>
            <input type="text" value={meta.kota}
              placeholder="cth. Jakarta Barat"
              onChange={e => setMeta({ ...meta, kota: e.target.value })} />
          </label>
          <label className="psp-field">
            <span>Tgl. Identifikasi</span>
            <input type="date" value={meta.tanggal}
              onChange={e => setMeta({ ...meta, tanggal: e.target.value })} />
          </label>
        </div>
      </div>

      {/* ---------- TOOLBAR ---------- */}
      <div className="psp-toolbar">
        <p className="psp-toolbarText">
          <strong>{stats.filled}</strong> dari <strong>{stats.total}</strong> butir telah dinilai
        </p>
        <button type="button" className="psp-resetBtn" onClick={resetAll}>Reset Semua</button>
      </div>

      {/* ---------- DAFTAR BUTIR ---------- */}
      {GROUPS.map(group => (
        <section key={group.key} className="psp-group">
          <h2 className="psp-groupTitle">
            <span className="psp-komponen">{group.komponen}</span>
            <span className="psp-groupSep">›</span>
            <span>{group.item}</span>
          </h2>
          <div className="psp-cards">
            {group.items.map(it => {
              const mark = marks[it.no];
              return (
                <article key={it.no} className="psp-card" data-state={mark ?? 'empty'}>
                  <div className="psp-cardHead">
                    <span className="psp-no">{it.no}</span>
                    <h3 className="psp-cardTitle">{it.subItem}</h3>
                    <span className={`psp-pointChip ${mark ? 'psp-pointChipActive' : ''}`}>
                      {mark ? `${MARK_META[mark].point} poin` : '0 poin'}
                    </span>
                  </div>
                  <p className="psp-indikator">{it.indikator}</p>
                  <ul className="psp-kondisi">
                    {it.kondisi.map(([key, text]) => (
                      <li key={key}>
                        <span className={`psp-badge psp-${MARK_META[key].badgeClass}`}>
                          {MARK_META[key].label}
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  {it.penjelasan && <p className="psp-penjelasan">{it.penjelasan}</p>}
                  <div className="psp-options">
                    {it.kondisi.map(([key]) => (
                      <label key={key}
                        className={`psp-option psp-${MARK_META[key].optionClass}`}
                        data-active={mark === key}>
                        <input type="radio" name={`mark-${it.no}`}
                          checked={mark === key}
                          onChange={() => setMark(it.no, key)} />
                        <span className="psp-optionDot" />
                        <span>{MARK_META[key].label}</span>
                      </label>
                    ))}
                    <button type="button" className="psp-clearBtn"
                      onClick={() => clearMark(it.no)} disabled={!mark}>
                      Kosongkan
                    </button>
                  </div>
                  <input type="text" className="psp-note"
                    placeholder="Keterangan (penjelasan singkat)…"
                    value={notes[it.no] ?? ''}
                    onChange={e => setNotes(p => ({ ...p, [it.no]: e.target.value }))} />
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {/* ---------- DOCK AKUMULASI ---------- */}
      <div className="psp-dock">
        <div className="psp-dockInner">
          <div className="psp-progressRow">
            <div className="psp-progressTrack">
              <div className="psp-progressFill" data-level={stats.level}
                style={{ width: `${Math.min(stats.percent * 100, 100)}%` }} />
            </div>
            <span className="psp-percentText">{(stats.percent * 100).toFixed(1)}%</span>
            <span className={`psp-levelBadge ${LEVEL_CLASS[stats.level]}`}>
              {stats.level}
            </span>
          </div>
          <div className="psp-statRow">
            <span className="psp-stat"><span className="psp-dotGood" /> Exist, good <b>{stats.good}</b></span>
            <span className="psp-stat"><span className="psp-dotNotGood" /> Exist, not good <b>{stats.notGood}</b></span>
            <span className="psp-stat"><span className="psp-dotNotExist" /> Not exist <b>{stats.notExist}</b></span>
            <span className="psp-stat">Total Poin <b>{stats.point}/{stats.maxPoint}</b></span>
            <span className={`psp-statusPill ${stats.complete ? 'psp-statusDone' : 'psp-statusPending'}`}>
              {stats.complete ? 'Complete' : 'Not complete'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}