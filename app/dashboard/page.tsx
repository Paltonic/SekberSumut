'use client';

import React, { useState, useCallback } from 'react';
import {
  ExternalLink, CheckCircle2, XCircle, Shield, Users, HeartHandshake,
} from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { EventType, isPublicEvent, toKey } from '../../lib/events';
import { useEvents } from '../components/events/useEvents';
import EventCalendar from '../components/events/EventCalendar';
import EventFormModal from '../components/events/EventFormModal';
import { useUser } from './layout';
import './Dashboard.css';

// ============================================================
// KONFIGURASI ROLE & JABATAN MANUAL DI CODE
// ============================================================
const ROLE_LISTS: Record<'admin' | 'pmv' | 'pengurus', string[]> = {
  admin:    ['Admin Sekber'],
  pmv:      ['PMBE', 'PMVMAS', 'PMVDA'],
  pengurus: ['Ricky Martin', 'Felicia Livana', 'Sher Lie'],
};

const JABATAN_BY_USERNAME: Record<string, string> = {
  'Admin Sekber':   'Administrator',
  'PMBE':           'Anggota PMV/C',
  'PMVMAS':         'Anggota PMV/C',
  'PMVDA':          'Anggota PMV/C',
  'Ricky Martin':   'Sekretaris Provinsi',
  'Felicia Livana': 'Wakil Sekretaris Provinsi III',
  'Sher Lie':       'Wakil Sekretaris Provinsi IV',
};

// ================= TIPE =================
type UserRole = 'admin' | 'pmv' | 'pengurus' | 'member';

const ROLE_META: Record<UserRole, { label: string; color: string; Icon: any }> = {
  admin:    { label: 'Admin',    color: '#FACC15', Icon: Shield },
  pmv:      { label: 'PMV/C',    color: '#3B82F6', Icon: HeartHandshake },
  pengurus: { label: 'Pengurus', color: '#8B5CF6', Icon: Users },
  member:   { label: 'Anggota',  color: '#94A3B8', Icon: Users },
};

// ================= FUNGSI PINTAR UNTUK GAMBAR (GOOGLE DRIVE) =================
function getAvatarSrc(url?: string) {
  if (!url) return '';
  let fileId = '';
  if (url.includes('drive.google.com')) {
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) fileId = matchD[1];
    else if (matchId && matchId[1]) fileId = matchId[1];
  } 
  else if (!url.startsWith('http')) {
    fileId = url;
  } else {
    return url;
  }
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
  return url;
}

// ================= RESOLVE ROLE =================
function resolveRole(username?: string): UserRole {
  const u = (username || '').trim();
  if (!u) return 'member';
  if (ROLE_LISTS.admin.includes(u)) return 'admin';
  if (ROLE_LISTS.pmv.includes(u)) return 'pmv';
  if (ROLE_LISTS.pengurus.includes(u)) return 'pengurus';
  return 'member';
}

// ================= RESOLVE JABATAN =================
function resolveJabatan(username: string | undefined, role: UserRole): string {
  const u = (username || '').trim();
  return JABATAN_BY_USERNAME[u] || ROLE_META[role].label;
}

export default function DashboardPage() {
  const { username, profile } = useUser();
  const role = resolveRole(username);
  const jabatan = resolveJabatan(username, role);
  const isAdmin = role === 'admin';
  const isPengurus = role === 'pengurus';

  // ================= FIREBASE: EVENTS (realtime) =================
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  // ================= HAK AKSES & CRUD =================
  const canManageEvents = isAdmin;
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [formDate, setFormDate] = useState('');

  const openAdd = (dateKey: string) => {
    if (!canManageEvents) return;
    setEditingEvent(null);
    setFormDate(dateKey || toKey(new Date()));
    setFormOpen(true);
  };

  const openEdit = (ev: EventType) => {
    if (!canManageEvents) return;
    setEditingEvent(ev);
    setFormOpen(true);
  };

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingEvent(null);
  }, []);

  const handleDeleteEvent = async (ev: EventType) => {
    if (!isAdmin || !db) return;
    if (!confirm(`Hapus jadwal "${ev.title}"?`)) return;
    try { await deleteDoc(doc(db, 'events', ev.id)); }
    catch (e) { console.error(e); alert('Gagal menghapus jadwal.'); }
  };

  // ================= FILTER EVENT SESUAI ROLE =================
  const visibleEvents = events.filter(e => {
    const div = e.division || 'all';
    if (role === 'admin' || role === 'member') return true;
    return div === 'all' || div === role;
  });

  // ================= BADGE JABATAN =================
  const jabatanBadge = (() => {
    const { color, Icon } = ROLE_META[role];
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: `${color}22`, color, padding: '2px 10px',
        borderRadius: 999, fontSize: 12, fontWeight: 600,
        border: `1px solid ${color}55`
      }}>
        <Icon size={12} /> {jabatan}
      </span>
    );
  })();

  return (
    <div className="content-grid">
      {/* Kolom Kiri & Tengah */}
      <div>
        <div className="card welcome-card">
          <div className="welcome-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0 }}>Hai, {username || 'User'}</h1>
              {jabatanBadge}
            </div>
            
            <p style={{ marginTop: 12, lineHeight: 1.6 }}>
              {role === 'admin' ? (
                <>Selamat datang kembali, Administrator! Semoga harimu menyenangkan dan diberikan kelancaran dalam mengelola dan memajukan <b>Sekber PMVBI (pemuda buddhayana) Sumatera Utara</b>.</>
              ) : (
                <>Selamat datang kembali! Semoga harimu menyenangkan dan penuh semangat dalam menjalankan aktivitas di <b>{profile?.major || 'organisasi kita'}</b>.</>
              )}
            </p>
            
            <p style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
              Yuk Berkarya dan Melayani ...
            </p>
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#F8FAFC' }}>
              Jadwal Acara
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8' }}>
              {canManageEvents
                ? 'Klik acara untuk melihat detail, edit, atau hapus. Jadwal bertanda "Publik" juga tampil di halaman depan.'
                : 'Klik tanggal atau acara untuk melihat detailnya.'}
            </p>
          </div>

          <EventCalendar
            events={visibleEvents}
            loading={eventsLoading}
            error={eventsError}
            canManage={canManageEvents}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDeleteEvent}
            showVisibility={canManageEvents}
            isPublicFn={isPublicEvent}
          />
        </div>

        {canManageEvents && (
          <EventFormModal
            open={formOpen}
            editing={editingEvent}
            defaultDate={formDate}
            onClose={closeForm}
          />
        )}
      </div>

      {/* Kolom Kanan */}
      <div>
        <div className="card">
          <h2 className="section-title">
            Profil <a href="#"><ExternalLink size={12} /> Detail</a>
          </h2>
          <div className="profile-info">
            {profile?.avatarUrl ? (
              <img 
                src={getAvatarSrc(profile.avatarUrl)} 
                alt="Profile" 
                className="profile-img" 
                referrerPolicy="no-referrer" 
                style={{ 
                  width: '120px', height: '120px', 
                  borderRadius: isPengurus ? '50%' : '0px',
                  objectFit: 'cover', display: 'block', margin: '0 auto'
                }}
              />
            ) : (
              <div 
                className="profile-img" 
                style={{ 
                  background: '#334155', width: '120px', height: '120px', 
                  borderRadius: isPengurus ? '50%' : '0px',
                  margin: '0 auto'
                }} 
              />
            )}

            <h3 className="profile-name">{username || 'User'}</h3>
            <p className="profile-major">{profile?.major || 'Memuat...'}</p>

            <div style={{ marginTop: 8, textAlign: 'center' }}>{jabatanBadge}</div>

            <div
              className="status-grid"
              style={{ marginTop: 12, ...(isPengurus ? { gridTemplateColumns: '1fr' } : {}) }}
            >
              <div className="status-item">
                <p>Keaktifan</p>
                <span className={`status-value ${profile?.isActive ? 'green' : 'red'}`}>
                  {profile?.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {profile?.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>

              {!isPengurus && (
                <div className="status-item">
                  <p>Status PSP</p>
                  <span className={`status-value ${profile?.isPspActive ? 'green' : 'red'}`}>
                    {profile?.isPspActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {profile?.pspStatus || 'Memuat...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="card">
            <h2 className="section-title">
              Administrasi <a href="#"><ExternalLink size={12} /> Detail</a>
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>
              Tidak ada tagihan atau administrasi tertunda.
            </p>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>
              Total jadwal organisasi: <b style={{ color: '#F8FAFC' }}>{events.length}</b>
            </p>
          </div>
        )}

        {role === 'pmv' && (
          <div className="card">
            <h2 className="section-title">
              Ringkasan PMV <a href="#"><ExternalLink size={12} /> Detail</a>
            </h2>
          </div>
        )}

        {isPengurus && (
          <div className="card">
            <h2 className="section-title">
              Ringkasan Kepengurusan <a href="#"><ExternalLink size={12} /> Detail</a>
            </h2>
          </div>
        )}

        {role === 'member' && (
          <div className="card">
            <h2 className="section-title">Info Anggota</h2>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>
              Senang bisa bertemu denganmu di sini. Jangan ragu untuk terus belajar dan berkembang!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}