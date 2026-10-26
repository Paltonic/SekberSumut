'use client';

import React, {
  useState, useEffect, createContext, useContext,
} from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell, MessageCircle, User, Search, ChevronDown,
  Menu, LogOut,
} from 'lucide-react';
import './layout.css';
import logoIMG from '../assets/sekber_logo.png';
import logoPMBE from '../assets/logo_pmbe.png';

// ❌ HAPUS BARIS INI: export const instant = false;

/* ---------- Profil Dummy ---------- */
const userProfiles: Record<string, any> = {
  'Admin Sekber': {
    major: 'Administrator Sistem', divisi: 'Pengurus Pusat',
    status: '-', isActive: true, pspStatus: '-', isPspActive: true,
    avatarUrl: logoIMG.src,
  },
  'PMBE': {
    major: 'PMB Ehipassiko', divisi: 'Anggota Biasa',
    status: 'Tidak Aktif', isActive: true, pspStatus: 'Selesai', isPspActive: true,
    avatarUrl: logoPMBE.src,
  },
  'PMVDA': {
    major: 'PMV Dharma Aura', divisi: 'Divisi Humas',
    status: 'Aktif', isActive: true, pspStatus: 'Selesai', isPspActive: true,
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },
};

/* ---------- Menu ---------- */
const menuItems = [
  { name: 'Dashboard',       href: '/dashboard', hasSubmenu: false },
  { name: 'Profil Pengurus', href: '#', hasSubmenu: true,
    subItems: [{ name: 'Wasekprov', href: '#' }, { name: 'Bidang Humas', href: '#' }] },
  { name: 'List PMV/C',      href: '#', hasSubmenu: true,
    subItems: [{ name: 'PMV A', href: '#' }, { name: 'PMV B', href: '#' }, { name: 'PMV C', href: '#' }] },
  { name: 'PSP',             href: '/dashboard/formpsp', hasSubmenu: false },
  { name: 'Berita',          href: '#', hasSubmenu: false },
  { name: 'Pelatihan',       href: '#', hasSubmenu: false },
];

/* ---------- Context ---------- */
type UserCtx = { username: string; profile: any };
const UserContext = createContext<UserCtx | null>(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser harus di dalam DashboardLayout');
  return ctx;
}

/* ---------- Layout Component ---------- */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState('');
  const [profile, setProfile]   = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUser  = localStorage.getItem('username');
    if (!isLoggedIn || !savedUser) {
      router.push('/login');
      return;
    }
    setUsername(savedUser);
    setProfile(userProfiles[savedUser] || {
      major: 'Tidak Diketahui', divisi: 'Anggota',
      status: 'Tidak Aktif', isActive: false,
      pspStatus: 'Belum Lunas', isPspActive: false, avatarUrl: '',
    });
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const toggleDropdown = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  return (
    <UserContext.Provider value={{ username, profile }}>
      <div
        className="dashboard-container"
        data-sidebar={isSidebarOpen ? 'open' : 'closed'}
      >
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
            <div className="profile-dropdown-container">
              <div className="user-profile-btn" onClick={() => setIsProfileOpen(v => !v)}>
                <User size={18} style={{ color: '#FACC15' }} />
                <span>{username || 'User'}</span>
                <ChevronDown size={16} className={`profile-chevron ${isProfileOpen ? 'rotated' : ''}`} />
              </div>
              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  <button onClick={handleLogout} className="logout-item">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="main-layout">
          {/* Hamburger */}
          <button
            className={`floating-hamburger ${isSidebarOpen ? 'open' : 'closed'}`}
            onClick={() => setIsSidebarOpen(v => !v)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {isSidebarOpen && (
            <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* ================= SIDEBAR ================= */}
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
                const isActive = pathname === item.href;

                if (item.hasSubmenu) {
                  return (
                    <li key={item.name}>
                      <div
                        className={`menu-item-toggle ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                      </div>
                      {isOpen && (
                        <ul className="sub-menu">
                          {item.subItems?.map(sub => (
                            <li key={sub.name}><a href={sub.href}>{sub.name}</a></li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                if (item.href.startsWith('/')) {
                  return (
                    <li key={item.name}>
                      <Link href={item.href} className={isActive ? 'active' : ''}>
                        {item.name}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <a href={item.href}>{item.name}</a>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ================= KONTEN ================= */}
          <main className="content-area" style={{ position: 'relative' }}>
            
            {/* 1. SELALU RENDER CHILDREN (Agar Next.js tidak protes) */}
            {children}

            {/* 2. LOADING OVERLAY (Menutupi konten jika data belum siap) */}
            {isLoading && (
              <div style={{
                position: 'fixed', inset: 0, background: '#0f172a',
                zIndex: 9999, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '16px',
                color: '#fff'
              }}>
                <div className="spinner"></div>
                <p>Memuat data...</p>
              </div>
            )}

          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
}