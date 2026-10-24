'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, MessageCircle, User, Search, ChevronDown, 
  ChevronLeft, ChevronRight, Info, ExternalLink, CheckCircle2, XCircle,
  Menu, LogOut // <-- Tambahkan import LogOut
} from 'lucide-react';
import './Dashboard.css';
import logoIMG from '../assets/sekber_logo.png';
import logoPMBE from '../assets/logo_pmbe.png';

// ... (Database dummy userProfiles tetap sama) ...
const userProfiles: Record<string, { 
  major: string; 
  divisi: string; 
  status: string; 
  isActive: boolean; 
  pspStatus: string; 
  isPspActive: boolean;
  avatarUrl: string; 
}> = {
  'Admin Sekber': {
    major: 'Administrator Sistem',
    divisi: 'Pengurus Pusat',
    status: '-',
    isActive: true,
    pspStatus: '-',
    isPspActive: true,
    avatarUrl: logoIMG.src, 
  },
  'PMBE': {
    major: 'PMB Ehipassiko',
    divisi: 'Anggota Biasa',
    status: 'Tidak Aktif',
    isActive: true,
    pspStatus: 'Selesai',
    isPspActive: true,
    avatarUrl: logoPMBE.src, 
  },
  'PMVDA': {
    major: 'PMV Dharma Aura',
    divisi: 'Divisi Humas',
    status: 'Aktif',
    isActive: true,
    pspStatus: 'Selesai',
    isPspActive: true, 
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },
};

// ... (menuItems tetap sama) ...
const menuItems = [
  { name: 'Dashboard', href: '#', hasSubmenu: false },
  { 
    name: 'Profil Pengurus', 
    href: '#', 
    hasSubmenu: true,
    subItems: [
      { name: 'Wasekprov', href: '#' },
      { name: 'Bidang Humas', href: '#' }
    ]
  },
  { 
    name: 'List PMV/C', 
    href: '#', 
    hasSubmenu: true,
    subItems: [
      { name: 'PMV A', href: '#' },
      { name: 'PMV B', href: '#' },
      { name: 'PMV C', href: '#' }
    ]
  },
  { name: 'PSP', href: '#', hasSubmenu: false },
  { name: 'Berita', href: '#', hasSubmenu: false },
  { name: 'Pelatihan', href: '#', hasSubmenu: false },
];

export default function DashboardPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State untuk melacak dropdown menu mana yang sedang terbuka
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  
  // State untuk Dropdown Profil (Logout)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State untuk menyimpan data profil user yang sedang login
  const [profile, setProfile] = useState({
    major: 'Memuat...',
    divisi: 'Memuat...',
    status: 'Memuat...',
    isActive: false,
    pspStatus: 'Memuat...',
    isPspActive: false,
    avatarUrl: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('username');

    if (!isLoggedIn || !savedUser) {
      router.push('/login');
    } else {
      setUsername(savedUser);
      
      const userData = userProfiles[savedUser] || {
        major: 'Tidak Diketahui',
        divisi: 'Anggota',
        status: 'Tidak Aktif',
        isActive: false,
        pspStatus: 'Belum Lunas',
        isPspActive: false,
        avatarUrl: ''
      };
      
      setProfile(userData);
      setIsLoading(false);
    }
  }, [router]);

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  // Fungsi untuk buka/tutup dropdown sidebar
  const toggleDropdown = (menuName: string) => {
    setOpenMenus((prev) => 
      prev.includes(menuName) 
        ? prev.filter(item => item !== menuName) 
        : [...prev, menuName]
    );
  };

  const upcomingEvents = [
    { id: 1, title: 'Rapat Koordinasi Pengurus', time: '10:00 - 12:00 WIB', location: 'Sekretariat' },
    { id: 2, title: 'Bakti Sosial Panti Asuhan', time: '08:00 - Selesai', location: 'Panti Kasih' },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* ================= TOPBAR ================= */}
      <header className="topbar">
        <div className="topbar-left">
          <img src={logoIMG.src} alt="Logo SEKBER" className="topbar-logo" />
          <div className="brand-text">
            <h1>SEKBER</h1>
            <h1 className="sec">PMVBI</h1>
          </div>
        </div>
        
        <div className="topbar-right">
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn"><MessageCircle size={20} /></button>
          
          {/* DROPDOWN PROFIL & LOGOUT */}
          <div className="profile-dropdown-container">
            <div 
              className="user-profile-btn" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User size={18} style={{ color: '#FACC15' }} />
              <span>{username}</span>
              <ChevronDown 
                size={16} 
                className={`profile-chevron ${isProfileOpen ? 'rotated' : ''}`} 
              />
            </div>

            {isProfileOpen && (
              <div className="profile-dropdown-menu">
                <button onClick={handleLogout} className="logout-item">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      <div className="main-layout">
        {/* ... (Sisa kode Sidebar dan Konten Utama tetap persis sama) ... */}
        
        {/* ================= TOMBOL HAMBURGER FLOATING ================= */}
        <button 
          className={`floating-hamburger ${isSidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Overlay gelap di HP saat sidebar terbuka */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* ================= SIDEBAR KIRI ================= */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-search">
            <div className="search-wrapper">
              <input type="text" placeholder="Cari Menu Secara Cepat..." />
              <Search className="search-icon" size={16} />
            </div>
          </div>

          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const isOpen = openMenus.includes(item.name);
              return (
                <li key={item.name}>
                  {item.hasSubmenu ? (
                    <>
                      <div 
                        className={`menu-item-toggle ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown 
                          size={14} 
                          className={`chevron-icon ${isOpen ? 'rotated' : ''}`} 
                        />
                      </div>
                      {isOpen && (
                        <ul className="sub-menu">
                          {item.subItems?.map((sub) => (
                            <li key={sub.name}>
                              <a href={sub.href}>{sub.name}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a href={item.href} className={item.name === 'Dashboard' ? 'active' : ''}>
                      {item.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ================= KONTEN UTAMA ================= */}
        <main className="content-area">
          <div className="content-grid">
            
            {/* Kolom Kiri & Tengah */}
            <div>
              <div className="card welcome-card">
                <div className="welcome-text">
                  <h1>Hai, {username}</h1>
                  <p>Halo {profile.divisi}! Bagaimana Kabarnya? Yuk tetap jaga nama baik Organisasi dan tetap berdampak baik kepada masyarakat ya!</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>Yuk Flashback xixixi...</p>
                </div>
              </div>

              <div className="card">
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#F8FAFC' }}>Jadwal Acara</h2>
                
                <div className="schedule-grid">
                  <div className="calendar-box">
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#94A3B8' }}>
                      Pilih salah satu tanggal
                    </p>
                    <div className="calendar-header">
                      <button type="button"><ChevronLeft size={20} /></button>
                      <span>Oct 2026</span>
                      <button type="button"><ChevronRight size={20} /></button>
                    </div>
                    <div className="calendar-days">
                      <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
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
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="event-item">
                        <h4>{event.title}</h4>
                        <p>{event.time} • {event.location}</p>
                      </div>
                    ))}
                    <h3 className="event-list-title" style={{ marginTop: '24px' }}>
                      Acara Selesai <Info size={14} style={{ color: '#FACC15' }} />
                    </h3>
                    <p className="empty-state">Belum ada acara yang selesai.</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #1F2937', paddingTop: '16px' }}>
                  <a href="#" style={{ fontSize: '14px', color: '#FACC15', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Selengkapnya <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div>
              <div className="card">
                <h2 className="section-title">Profil <a href="#"><ExternalLink size={12}/> Detail</a></h2>
                <div className="profile-info">
                  <img src={profile.avatarUrl} alt="Profile" className="profile-img" />
                  <h3 className="profile-name">{username}</h3>
                  <p className="profile-major">{profile.major}</p>
                  
                  <div className="status-grid">
                    <div className="status-item">
                      <p>Keaktifan</p>
                      <span className={`status-value ${profile.isActive ? 'green' : 'red'}`}>
                        {profile.isActive ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                        {profile.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    <div className="status-item">
                      <p>Status PSP</p>
                      <span className={`status-value ${profile.isPspActive ? 'green' : 'red'}`}>
                        {profile.isPspActive ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                        {profile.pspStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="section-title">Administrasi <a href="#"><ExternalLink size={12}/> Detail</a></h2>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>Tidak ada tagihan atau administrasi tertunda.</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}