'use client';

import React from 'react';
import {
  ChevronLeft, ChevronRight, Info, ExternalLink,
  CheckCircle2, XCircle,
} from 'lucide-react';
import { useUser } from './layout'; // Sesuaikan path jika berbeda
import './Dashboard.css'; // Sesuaikan path jika berbeda

export default function DashboardPage() {
  // 1. Ambil data dari Context Layout
  const { username, profile } = useUser();

  const upcomingEvents = [
    { id: 1, title: 'Rapat Koordinasi Pengurus', time: '10:00 - 12:00 WIB', location: 'Sekretariat' },
    { id: 2, title: 'Bakti Sosial Panti Asuhan', time: '08:00 - Selesai',     location: 'Panti Kasih' },
  ];

  return (
    <div className="content-grid">
      {/* Kolom Kiri & Tengah */}
      <div>
        <div className="card welcome-card">
          <div className="welcome-text">
            <h1>Hai, {username || 'User'}</h1>
            {/* 2. Gunakan tanda '?' (optional chaining) */}
            <p>Halo {profile?.divisi || 'Anggota'}! Bagaimana Kabarnya? Yuk tetap jaga nama baik Organisasi dan tetap berdampak baik kepada masyarakat ya!</p>
            <p style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
              Yuk Flashback xixixi...
            </p>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#F8FAFC' }}>
            Jadwal Acara
          </h2>
          <div className="schedule-grid">
            <div className="calendar-box">
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#94A3B8' }}>
                Pilih salah satu tanggal
              </p>
              <div className="calendar-header">
                <button type="button"><ChevronLeft size={20} /></button>
                <span>Oct 2026</span>
                <button type="button"><ChevronRight size={20} /></button>
              </div>
              <div className="calendar-days">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span>
                <span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div className="calendar-dates">
                <span className="muted">28</span><span className="muted">29</span><span className="muted">30</span>
                <span>1</span><span>2</span><span>3</span><span>4</span>
                <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span>
                <span className="active-date">24</span>
                <span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            <div>
              <h3 className="event-list-title">Acara Mendatang</h3>
              {upcomingEvents.map(e => (
                <div key={e.id} className="event-item">
                  <h4>{e.title}</h4>
                  <p>{e.time} • {e.location}</p>
                </div>
              ))}
              <h3 className="event-list-title" style={{ marginTop: 24 }}>
                Acara Selesai <Info size={14} style={{ color: '#FACC15' }} />
              </h3>
              <p className="empty-state">Belum ada acara yang selesai.</p>
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #1F2937', paddingTop: 16 }}>
            <a href="#" style={{ fontSize: 14, color: '#FACC15', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Selengkapnya <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div>
        <div className="card">
          <h2 className="section-title">
            Profil <a href="#"><ExternalLink size={12} /> Detail</a>
          </h2>
          <div className="profile-info">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-img" style={{ background: '#334155' }} />
            )}
            
            <h3 className="profile-name">{username || 'User'}</h3>
            <p className="profile-major">{profile?.major || 'Memuat...'}</p>
            
            <div className="status-grid">
              <div className="status-item">
                <p>Keaktifan</p>
                <span className={`status-value ${profile?.isActive ? 'green' : 'red'}`}>
                  {profile?.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {profile?.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
              <div className="status-item">
                <p>Status PSP</p>
                <span className={`status-value ${profile?.isPspActive ? 'green' : 'red'}`}>
                  {profile?.isPspActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {profile?.pspStatus || 'Memuat...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">
            Administrasi <a href="#"><ExternalLink size={12} /> Detail</a>
          </h2>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>
            Tidak ada tagihan atau administrasi tertunda.
          </p>
        </div>
      </div>
    </div>
  );
}