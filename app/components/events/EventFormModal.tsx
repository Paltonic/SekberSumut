'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, Save, Globe, Lock } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Division, EventType, DIVISION_LABELS } from '../../../lib/events';
import RangeDatePicker from './RangeDatePicker';
import './events.css';

type Props = {
  open: boolean;
  /** null = tambah baru, berisi event = mode edit */
  editing: EventType | null;
  /** tanggal awal yang diisi otomatis saat menambah */
  defaultDate: string;
  onClose: () => void;
};

type FormState = {
  title: string;
  time: string;
  location: string;
  description: string;
  division: Division;
  startDate: string;
  endDate: string;
};

const VISIBILITY_TEXT: Record<Division, string> = {
  all: 'Semua orang, tampil juga di landing page',
  pmv: 'Hanya akun PMV (dan admin)',
  pengurus: 'Hanya akun Pengurus (dan admin)',
  both: 'Akun PMV & Pengurus (dan admin)',
};

const emptyForm = (date: string): FormState => ({
  title: '', time: '', location: '', description: '',
  division: 'all', startDate: date, endDate: date,
});

export default function EventFormModal({ open, editing, defaultDate, onClose }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm(defaultDate));
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Isi form setiap kali modal dibuka
  useEffect(() => {
    if (!open) return;
    setErrorMsg('');
    if (editing) {
      setForm({
        title: editing.title || '',
        time: editing.time || '',
        location: editing.location || '',
        description: editing.description || '',
        division: editing.division || 'all',
        startDate: editing.date,
        endDate: editing.endDate || editing.date,
      });
    } else {
      setForm(emptyForm(defaultDate));
    }
  }, [open, editing, defaultDate]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { setErrorMsg('Koneksi database belum siap.'); return; }
    if (!form.startDate) { setErrorMsg('Pilih tanggal acara terlebih dahulu.'); return; }
    if (!form.title.trim() || !form.time.trim()) { setErrorMsg('Nama acara dan waktu wajib diisi.'); return; }

    const endDate = form.endDate && form.endDate >= form.startDate ? form.endDate : form.startDate;
    const payload = {
      date: form.startDate,
      endDate,
      title: form.title.trim(),
      time: form.time.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      division: form.division,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'events', editing.id), { ...payload, updatedAt: new Date() });
      } else {
        await addDoc(collection(db, 'events'), { ...payload, createdAt: new Date() });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(editing ? 'Gagal menyimpan perubahan.' : 'Gagal menambah jadwal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing || !db) return;
    if (!confirm(`Hapus jadwal "${editing.title}"?`)) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'events', editing.id));
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menghapus jadwal.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ev-modal-backdrop" onMouseDown={onClose}>
      <div
        className="ev-modal"
        role="dialog"
        aria-modal="true"
        aria-label={editing ? 'Edit jadwal' : 'Tambah jadwal'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="ev-modal-head">
          <div>
            <h3>{editing ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
            <p>{editing ? 'Ubah detail acara lalu simpan.' : 'Pilih rentang tanggal, lalu isi detail acara.'}</p>
          </div>
          <button type="button" className="ev-icon-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ev-form">
          <RangeDatePicker
            start={form.startDate}
            end={form.endDate}
            onChange={(s, en) => setForm((f) => ({ ...f, startDate: s, endDate: en }))}
          />

          <div className="ev-form-grid">
            <label className="ev-field full">
              <span>Nama Acara *</span>
              <input
                type="text" required placeholder="Cth: Monthly Recharge"
                value={form.title} onChange={(e) => set('title', e.target.value)}
              />
            </label>
            <label className="ev-field">
              <span>Waktu *</span>
              <input
                type="text" required placeholder="Cth: 10:00 - 12:00 WIB"
                value={form.time} onChange={(e) => set('time', e.target.value)}
              />
            </label>
            <label className="ev-field">
              <span>Lokasi</span>
              <input
                type="text" placeholder="Cth: Buddhayana Center"
                value={form.location} onChange={(e) => set('location', e.target.value)}
              />
            </label>
            <label className="ev-field full">
              <span>Deskripsi (opsional)</span>
              <textarea
                rows={3} placeholder="Info singkat acara, dress code, kontak panitia, dll."
                value={form.description} onChange={(e) => set('description', e.target.value)}
              />
            </label>
            <label className="ev-field">
              <span>Divisi</span>
              <select value={form.division} onChange={(e) => set('division', e.target.value as Division)}>
                {(Object.keys(DIVISION_LABELS) as Division[]).map((d) => (
                  <option key={d} value={d}>{d === 'all' ? 'Umum (Semua + halaman publik)' : DIVISION_LABELS[d]}</option>
                ))}
              </select>
            </label>
            <div className="ev-field">
              <span>Siapa yang bisa melihat</span>
              <div className={`ev-toggle ${form.division === 'all' ? 'on' : ''}`}>
                {form.division === 'all' ? <Globe size={15} /> : <Lock size={15} />}
                {VISIBILITY_TEXT[form.division]}
              </div>
            </div>
          </div>

          {errorMsg && <p className="ev-form-error">{errorMsg}</p>}

          <div className="ev-modal-actions">
            {editing ? (
              <button type="button" className="ev-btn danger" onClick={handleDelete} disabled={saving}>
                <Trash2 size={15} /> Hapus
              </button>
            ) : <span />}
            <div className="ev-modal-actions-right">
              <button type="button" className="ev-btn ghost" onClick={onClose} disabled={saving}>Batal</button>
              <button type="submit" className="ev-btn primary" disabled={saving}>
                <Save size={15} /> {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Jadwal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
