'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './LoginPage.css';
import logoImg from '../assets/sekber_logo.png'; 
import loginImg from '../assets/bg_login.png'; 

// --- DAFTAR AKUN (TAMBAHKAN DI SINI) ---
const validUsers = [
  { username: 'Admin Sekber', password: '@Admin123' },
  { username: 'PMBE', password: '@User88' },
  { username: 'PMVDA', password: '@User123' }
];

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Simulasi loading
    setTimeout(() => {
      setIsLoading(false);

      // Cek apakah username & password ada di dalam list validUsers
      const isValidUser = validUsers.some(
        (user) => user.username === username && user.password === password
      );

      if (isValidUser) {
        // Jika cocok
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        router.push('/dashboard');
      } else {
        // Jika tidak cocok
        setErrorMsg('Username atau Password salah. Silakan coba lagi.');
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* SISI KIRI */}
      <div className="login-left">
        <img src={loginImg.src} alt="Background Kampus" />
        <div className="login-left-overlay"></div>
        <div className="login-left-content">
          <h1>Halo!</h1>
          <p>Selamat Datang di Portal SEKBER PMVBI (pemuda buddhayana) Provinsi Sumatera Utara</p>
          <div className="login-accent-line"></div>
        </div>
      </div>

      {/* SISI KANAN */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img src={logoImg.src} alt="SEKBER PMVBI Logo" />
            </div>
            <h2>Login</h2>
            <p>Silakan masuk ke akun Anda</p>
          </div>

          {/* PESAN ERROR DI ATAS SUDAH DIHAPUS DARI SINI */}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <div className="input-icon"><User size={18} /></div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <div className="input-icon"><Lock size={18} /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} /> Memproses...</>
              ) : ('Masuk')}
            </button>
          </form>

          {/* PESAN ERROR DIPINDAHKAN KE SINI (BAWAH TOMBOL) */}
          {errorMsg && (
            <div className="error-message">
              {errorMsg}
            </div>
          )}

          <div className="login-footer">
            <Link href="/">&larr; Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}