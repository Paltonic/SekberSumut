'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Info, ExternalLink,
  CheckCircle2, XCircle, Plus, Trash2
} from 'lucide-react';
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Pastikan path ini benar
import { useUser } from './layout'; 
import './Dashboard.css'; 

type EventType = {
  id: string;
  date: string; 
  title: string;
  time: string;
  location: string;
};

export default function DashboardPage() {
  const { username, profile } = useUser();
  const isAdmin = username === 'Admin Sekber';

  // ================= STATE KALENDER & WAKTU =================
  // Gunakan null dulu untuk menghindari error prerender Next.js
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [todayStr, setTodayStr] = useState<string>('');
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  // Inisialisasi waktu hanya setelah komponen di-mount di browser
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
    
    // Helper format tanggal ke YYYY-MM-DD
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    
    setTodayStr(formatDate(now));
    setIsCalendarLoading(false);
  }, []);

  // ================= LOGIKA FIREBASE (JADWAL) =================
  const [events, setEvents] = useState<EventType[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', location: '' });

  // 1. Tarik data real-time dari Firestore
  useEffect(() => {
    // Hanya jalankan jika database tersedia
    if (!db) return;

    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventType[];
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // 2. Tambah data ke Firestore
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time || !selectedDate) return;

    // Helper format tanggal (diperlukan di sini juga)
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    const selectedDateStr = formatDate(selectedDate);

    try {
      await addDoc(collection(db, "events"), {
        date: selectedDateStr,
        title: newEvent.title,
        time: newEvent.time,
        location: newEvent.location,
        createdAt: new Date(),
      });
      setNewEvent({ title: '', time: '', location: '' });
      setIsAddingEvent(false);
    } catch (error) {
      console.error("Gagal menambah jadwal: ", error);
      alert("Gagal menambah jadwal. Pastikan Anda sudah login sebagai admin.");
    }
  };

  // 3. Hapus data dari Firestore
  const handleDeleteEvent = async (id: string) => {
    if (!isAdmin) return;
    if (confirm('Hapus jadwal ini?')) {
      try {
        await deleteDoc(doc(db, "events", id));
      } catch (error) {
        console.error("Gagal menghapus jadwal: ", error);
      }
    }
  };

  // ================= LOGIKA KALENDER DINAMIS =================
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const currentYear = currentDate ? currentDate.getFullYear() : 0;
  const currentMonth = currentDate ? currentDate.getMonth() : 0;

  const prevMonth = () => {
    if (currentDate) setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const nextMonth = () => {
    if (currentDate) setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Senin = 0, Minggu = 6
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedDateStr = selectedDate ? formatDate(selectedDate) : '';
  
  // Generate array hari untuk kalender
  let calendarDays: { day: number; isCurrentMonth: boolean; dateObj: Date }[] = [];
  
  if (currentDate) {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false, dateObj: new Date(currentYear, currentMonth - 1, prevMonthDays - i) });
    }
    // Hari di bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, isCurrentMonth: true, dateObj: new Date(currentYear, currentMonth, i) });
    }
    // Hari dari bulan berikutnya
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({ day: i, isCurrentMonth: false, dateObj: new Date(currentYear, currentMonth + 1, i) });
    }
  }

  const eventsOnSelectedDate = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="content-grid">
      {/* Kolom Kiri & Tengah */}
      <div>
        <div className="card welcome-card">
          <div className="welcome-text">
            <h1>Hai, {username || 'User'}</h1>
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
            {/* KALENDER */}
            <div className="calendar-box">
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#94A3B8' }}>
                Pilih salah satu tanggal
              </p>
              
              {isCalendarLoading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  Memuat kalender...
                </div>
              ) : (
                <>
                  <div className="calendar-header">
                    <button type="button" onClick={prevMonth}><ChevronLeft size={20} /></button>
                    <span>{monthNames[currentMonth]} {currentYear}</span>
                    <button type="button" onClick={nextMonth}><ChevronRight size={20} /></button>
                  </div>
                  <div className="calendar-days">
                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span>
                    <span>Fr</span><span>Sa</span><span>Su</span>
                  </div>
                  <div className="calendar-dates">
                    {calendarDays.map((item, index) => {
                      const itemDateStr = formatDate(item.dateObj);
                      const isToday = itemDateStr === todayStr;
                      const isSelected = itemDateStr === selectedDateStr;

                      return (
                        <span
                          key={index}
                          onClick={() => setSelectedDate(item.dateObj)}
                          className={`
                            ${!item.isCurrentMonth ? 'muted' : ''} 
                            ${isToday ? 'today-marker' : ''} 
                            ${isSelected ? 'active-date' : ''}
                          `}
                          style={{ cursor: 'pointer', position: 'relative' }}
                        >
                          {item.day}
                          {events.some(e => e.date === itemDateStr) && !isSelected && (
                            <span style={{
                              position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
                              width: '4px', height: '4px', borderRadius: '50%', background: '#FACC15'
                            }} />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* LIST EVENT */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="event-list-title" style={{ margin: 0 }}>
                  Jadwal: {selectedDate 
                    ? selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                    : 'Memuat...'}
                </h3>
                
                {/* TOMBOL TAMBAH KHUSUS ADMIN */}
                {isAdmin && selectedDate && (
                  <button 
                    onClick={() => setIsAddingEvent(!isAddingEvent)}
                    style={{ 
                      background: '#FACC15', color: '#0f172a', border: 'none', 
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px', 
                      fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    {isAddingEvent ? 'Batal' : <><Plus size={14} /> Tambah</>}
                  </button>
                )}
              </div>

              {/* FORM TAMBAH EVENT (Hanya Admin) */}
              {isAdmin && isAddingEvent && (
                <form onSubmit={handleAddEvent} style={{ 
                  background: '#1E293B', padding: '16px', borderRadius: '8px', marginBottom: '16px',
                  border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                  <input 
                    type="text" placeholder="Nama Acara" required
                    value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    style={{ padding: '8px', borderRadius: '4px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '13px' }}
                  />
                  <input 
                    type="text" placeholder="Waktu (Cth: 10:00 - 12:00 WIB)" required
                    value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    style={{ padding: '8px', borderRadius: '4px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '13px' }}
                  />
                  <input 
                    type="text" placeholder="Lokasi (Cth: Sekretariat)"
                    value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    style={{ padding: '8px', borderRadius: '4px', background: '#0f172a', border: '1px solid #475569', color: '#fff', fontSize: '13px' }}
                  />
                  <button type="submit" style={{ 
                    background: '#10B981', color: '#fff', border: 'none', padding: '8px', 
                    borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px'
                  }}>
                    Simpan Jadwal
                  </button>
                </form>
              )}

              {/* LIST JADWAL */}
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map(e => (
                  <div key={e.id} className="event-item" style={{ position: 'relative' }}>
                    <h4>{e.title}</h4>
                    <p>{e.time} • {e.location}</p>
                    
                    {/* Tombol Hapus (Hanya Admin) */}
                    {isAdmin && (
                      <button 
                        onClick={() => handleDeleteEvent(e.id)}
                        style={{ 
                          position: 'absolute', top: '12px', right: '12px', background: 'transparent', 
                          border: 'none', color: '#EF4444', cursor: 'pointer' 
                        }}
                        title="Hapus Acara"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-state" style={{ marginTop: '16px' }}>
                  Tidak ada acara pada tanggal ini.
                </p>
              )}

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

      {/* Kolom Kanan (Profil & Admin) */}
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