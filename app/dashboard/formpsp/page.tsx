'use client';

import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
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
  const [currentGroup, setCurrentGroup] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // State untuk pengiriman dan penguncian skor
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setMarks(p.marks ?? {});
        setNotes(p.notes ?? {});
        setMeta({ nama: '', kota: '', tanggal: '', ...(p.meta ?? {}) });
        setIsSubmitted(p.isSubmitted ?? false);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ marks, notes, meta, isSubmitted })); 
    } catch {}
  }, [marks, notes, meta, isSubmitted, ready]);

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

  /* ============ PAGINATION ============ */
  const totalGroups = GROUPS.length;
  const group = GROUPS[currentGroup];
  const isFirst = currentGroup === 0;
  const isLast = currentGroup === totalGroups - 1;

  const isGroupComplete = (g: typeof GROUPS[0]) =>
    g.items.every(it => marks[it.no]);
  const groupComplete = group ? isGroupComplete(group) : false;

  const changePage = (idx: number) => {
    if (idx < 0 || idx >= totalGroups) return;
    setCurrentGroup(idx);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ============ HANDLERS ============ */
  // Jika ada perubahan data, sembunyikan kembali skor (harus kirim ulang untuk lihat skor baru)
  const handleDataChange = () => {
    if (isSubmitted) setIsSubmitted(false);
  };

  const setMark = (no: number, m: MarkKey) => {
    setMarks(p => ({ ...p, [no]: m }));
    handleDataChange();
  };
  
  const clearMark = (no: number) => {
    setMarks(p => { const n = { ...p }; delete n[no]; return n; });
    handleDataChange();
  };

  const handleNoteChange = (no: number, val: string) => {
    setNotes(p => ({ ...p, [no]: val }));
    handleDataChange();
  };

  const handleMetaChange = (key: keyof typeof meta, val: string) => {
    setMeta(prev => ({ ...prev, [key]: val }));
    handleDataChange();
  };

  const resetAll = () => {
    if (!confirm('Kosongkan seluruh penilaian dan keterangan?')) return;
    setMarks({}); setNotes({}); setShowResult(false);
    setIsSubmitted(false); setSendError('');
  };

  /* ============ EXCEL & EMAIL GENERATOR ============ */
  const generateExcelData = () => {
    const data: any[][] = [];
    
    data.push(["FORMULIR IDENTIFIKASI - PROGRAM STANDAR PMV/C", "", "", "", "", "Nama PMV/C", meta.nama, "", "", ""]);
    data.push(["SEKBER PMVBI (PEMUDA BUDDHAYANA)"]);
    data.push(["", "", "", "", "", "Kab/Kota", meta.kota, "Tgl. Identifikasi", meta.tanggal, ""]);
    data.push(["Catatan: Pengisian hanya dilakukan pada kolom warna kuning"]);
    data.push([]); 
    
    data.push(["No.", "Komponen", "Item", "Sub Item", "Indikator", "Penjelasan Tambahan", "Mark (V)", "", "", "Keterangan (Penjelasan Singkat)"]);
    data.push(["", "", "", "", "", "", "Exist, good", "Exist, not good", "Not exist", ""]);
    
    ITEMS.forEach(it => {
      const mark = marks[it.no];
      const kondisiStr = it.kondisi.map(([key, text]) => `- ${MARK_META[key].label}: ${text}`).join('\n');
      const fullIndikator = `${it.indikator}\n\nKondisi:\n${kondisiStr}`;

      data.push([
        it.no.toString(),
        it.komponen,
        it.item,
        it.subItem,
        fullIndikator,
        it.penjelasan || "-",
        mark === 'good' ? "V" : "",
        mark === 'notGood' ? "V" : "",
        mark === 'notExist' ? "V" : "",
        notes[it.no] || ""
      ]);
    });

    data.push([]);
    data.push([]);
    data.push(["", "", "", "", "", "Total Checklist", stats.good, stats.notGood, stats.notExist, ""]);
    data.push(["", "", "", "", "", "Total Point", stats.good * 2, stats.notGood * 1, stats.notExist * 0, ""]);
    data.push(["", "", "", "", "", "% Hasil", stats.percent, "", "", ""]);
    data.push(["", "", "", "", "", "Status", stats.complete ? "Complete" : "Not complete", "", "", ""]);
    data.push(["", "", "", "", "", "HASIL IDENTIFIKASI PSP", stats.level, "", "", ""]);

    return data;
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(generateExcelData());
    ws['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, 
      { wch: 50 }, { wch: 40 }, { wch: 12 }, { wch: 15 }, 
      { wch: 12 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Formulir Identifikasi PSP");
    XLSX.writeFile(wb, `Formulir_Identifikasi_${meta.nama.replace(/\s+/g, '_') || 'PMV'}.xlsx`);
  };

  const handleSendAndUnlock = async () => {
    setIsSending(true);
    setSendError('');

    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(generateExcelData());
      XLSX.utils.book_append_sheet(wb, ws, "Formulir Identifikasi PSP");
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const fileName = `Formulir_Identifikasi_${meta.nama.replace(/\s+/g, '_') || 'PMV'}.xlsx`;
      
      // PERBAIKAN 1: Gunakan objek File, bukan Blob
      const file = new File([excelBuffer], fileName, { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      const formData = new FormData();
      // PERBAIKAN 2: Gunakan nama key tanpa spasi/simbol khusus
      formData.append('Nama_PMVC', meta.nama);
      formData.append('Kabupaten_Kota', meta.kota);
      formData.append('Tanggal_Identifikasi', meta.tanggal);
      formData.append('Status', stats.complete ? 'Complete' : 'Not complete');
      formData.append('Hasil', stats.level);
      
      // PERBAIKAN 3: FormSubmit mewajibkan nama key persis 'attachment'
      formData.append('attachment', file); 

      const response = await fetch('https://formsubmit.co/ajax/psdmsekberpmvbisumut@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowResult(true); // Buka skor HANYA setelah email terkirim
      } else {
        setSendError('Gagal mengirim email. Periksa koneksi internet Anda dan coba lagi.');
      }
    } catch (error) {
      console.error(error);
      setSendError('Terjadi kesalahan sistem saat mengirim. Coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`psp-page ${stats.complete ? 'psp-page--complete' : ''}`}>
      {/* ---------- PAGE HEADER ---------- */}
      <div className="psp-pageHeader">
        <div>
          <p className="psp-kicker">SEKBER PMVBI (Pemuda Buddhayana)</p>
          <h1 className="psp-title">
            Formulir Identifikasi — Program Standar PMV/C
          </h1>
        </div>
        <div className="psp-metaGrid">
          <label className="psp-field">
            <span>Nama PMV/C</span>
            <input type="text" value={meta.nama}
              placeholder="cth. PMV Dharma Bakti"
              onChange={e => handleMetaChange('nama', e.target.value)} />
          </label>
          <label className="psp-field">
            <span>Kab / Kota</span>
            <input type="text" value={meta.kota}
              placeholder="cth. Jakarta Barat"
              onChange={e => handleMetaChange('kota', e.target.value)} />
          </label>
          <label className="psp-field">
            <span>Tgl. Identifikasi</span>
            <input type="date" value={meta.tanggal}
              onChange={e => handleMetaChange('tanggal', e.target.value)} />
          </label>
        </div>
      </div>

      {/* ---------- TOOLBAR + PAGER ---------- */}
      <div className="psp-toolbar">
        <p className="psp-toolbarText">
          <strong>{stats.filled}</strong> dari <strong>{stats.total}</strong> butir telah dinilai
        </p>
        <div className="psp-toolbarActions">
          <div className="psp-pager">
            <button type="button" className="psp-pagerBtn"
              onClick={() => changePage(currentGroup - 1)} disabled={isFirst}>
              ‹ Sebelumnya
            </button>
            <span className="psp-pagerInfo">
              <b>{currentGroup + 1}</b> / {totalGroups}
            </span>
            <button type="button" className="psp-pagerBtn psp-pagerBtnPrimary"
              onClick={() => changePage(currentGroup + 1)} disabled={isLast}>
              Selanjutnya ›
            </button>
          </div>
          <button type="button" className="psp-resetBtn" onClick={resetAll}>Reset Semua</button>
        </div>
      </div>

      {/* ---------- STEP INDICATOR ---------- */}
      <div className="psp-steps">
        {GROUPS.map((g, i) => {
          const done = isGroupComplete(g);
          return (
            <button key={g.key} type="button"
              onClick={() => changePage(i)}
              className={`psp-step ${i === currentGroup ? 'active' : ''} ${done ? 'done' : ''}`}
              title={`${g.komponen} › ${g.item}`}>
              <span className="psp-stepNo">{done ? '✓' : i + 1}</span>
              <span className="psp-stepLabel">{g.komponen}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- HALAMAN AKTIF ---------- */}
      {group && (
        <section className="psp-group">
          <h2 className="psp-groupTitle">
            <span className="psp-komponen">{group.komponen}</span>
            <span className="psp-groupSep">›</span>
            <span>{group.item}</span>
            {groupComplete && <span className="psp-groupDone">✓ Selesai</span>}
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
                    onChange={e => handleNoteChange(it.no, e.target.value)} />
                </article>
              );
            })}
          </div>

          {/* ---------- NAVIGASI BAWAH HALAMAN ---------- */}
          <div className="psp-groupNav">
            <button type="button" className="psp-pagerBtn"
              onClick={() => changePage(currentGroup - 1)} disabled={isFirst}>
              ‹ Sebelumnya
            </button>
            <span className="psp-groupNavInfo">
              Halaman {currentGroup + 1} dari {totalGroups}
              {groupComplete && <span className="psp-groupNavTick"> ✓ komponen ini lengkap</span>}
            </span>
            {isLast ? (
              stats.complete ? (
                isSubmitted ? (
                  <button type="button" className="psp-pagerBtn psp-pagerBtnPrimary"
                    onClick={() => setShowResult(true)}>
                    Lihat Rekap Hasil ›
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <button type="button" className="psp-pagerBtn psp-pagerBtnPrimary psp-pulse"
                      onClick={handleSendAndUnlock} disabled={isSending}>
                      {isSending ? 'Mengirim File...' : 'Kirim & Lihat Hasil ›'}
                    </button>
                    {sendError && <span style={{color: '#EF4444', fontSize: '12px'}}>{sendError}</span>}
                  </div>
                )
              ) : (
                <span className="psp-groupNavDone" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                  ⚠ Lengkapi dulu
                </span>
              )
            ) : (
              <button type="button" className="psp-pagerBtn psp-pagerBtnPrimary"
                onClick={() => changePage(currentGroup + 1)}>
                Selanjutnya ›
              </button>
            )}
          </div>
        </section>
      )}

      {/* ---------- DOCK AKUMULASI ---------- */}
      {stats.complete && (
        <div className="psp-dock">
          <div className="psp-dockInner">
            <div className="psp-progressRow">
              <div className="psp-progressTrack">
                <div className="psp-progressFill" data-level={isSubmitted ? stats.level : 'Merah'}
                  style={{ width: isSubmitted ? `${Math.min(stats.percent * 100, 100)}%` : '100%' }} />
              </div>
              <span className="psp-percentText">
                {isSubmitted ? `${(stats.percent * 100).toFixed(1)}%` : '?? %'}
              </span>
              <span className={`psp-levelBadge ${isSubmitted ? LEVEL_CLASS[stats.level] : 'psp-levelMerah'}`}>
                {isSubmitted ? stats.level : 'Terkunci'}
              </span>
            </div>
            <div className="psp-statRow">
              <span className="psp-stat"><span className="psp-dotGood" /> Exist, good <b>{isSubmitted ? stats.good : '?'}</b></span>
              <span className="psp-stat"><span className="psp-dotNotGood" /> Exist, not good <b>{isSubmitted ? stats.notGood : '?'}</b></span>
              <span className="psp-stat"><span className="psp-dotNotExist" /> Not exist <b>{isSubmitted ? stats.notExist : '?'}</b></span>
              <span className="psp-stat">Total Poin <b>{isSubmitted ? `${stats.point}/${stats.maxPoint}` : '?/?'}</b></span>
              <span className={`psp-statusPill ${isSubmitted ? 'psp-statusDone' : 'psp-statusPending'}`}>
                {isSubmitted ? 'Terkirim' : 'Belum Terkirim'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODAL REKAP HASIL ---------- */}
      {showResult && isSubmitted && (
        <div className="psp-modalOverlay" onClick={() => setShowResult(false)}>
          <div className="psp-modal" onClick={e => e.stopPropagation()}>
            <div className="psp-modalHeader">
              <h2 className="psp-modalTitle">Rekap Hasil Identifikasi</h2>
              <button className="psp-modalClose" onClick={() => setShowResult(false)}>✕</button>
            </div>
            
            <div className="psp-modalBody">
              <div className="psp-alert psp-alertSuccess" style={{ marginBottom: 0 }}>
                ✓ Jawaban telah berhasil dikirim ke email tujuan. Anda bisa mengubah jawaban, tapi harus mengirim ulang untuk melihat skor terbaru.
              </div>

              <div className="psp-modalHighlight">
                <div className="psp-modalLevel">
                  <span className={`psp-levelBadge ${LEVEL_CLASS[stats.level]}`} style={{ fontSize: '1.2rem', padding: '12px 24px' }}>
                    {stats.level}
                  </span>
                </div>
                <div className="psp-modalPercent">
                  <span>Persentase</span>
                  <strong>{(stats.percent * 100).toFixed(1)}%</strong>
                </div>
                <div className="psp-modalPoint">
                  <span>Total Poin</span>
                  <strong>{stats.point} / {stats.maxPoint}</strong>
                </div>
              </div>

              <div className="psp-modalStats">
                <div className="psp-modalStatItem psp-statGood">
                  <span className="psp-dotGood" /> Exist, good <b>{stats.good}</b>
                </div>
                <div className="psp-modalStatItem psp-statNotGood">
                  <span className="psp-dotNotGood" /> Exist, not good <b>{stats.notGood}</b>
                </div>
                <div className="psp-modalStatItem psp-statNotExist">
                  <span className="psp-dotNotExist" /> Not exist <b>{stats.notExist}</b>
                </div>
              </div>
            </div>

            <div className="psp-modalFooter">
              <button className="psp-pagerBtn" onClick={handleDownloadExcel}>
                ⬇ Download Salinan Excel
              </button>
              <button className="psp-pagerBtn psp-pagerBtnPrimary" onClick={() => setShowResult(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}