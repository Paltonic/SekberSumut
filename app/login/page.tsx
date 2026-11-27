'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // Sesuaikan path jika perlu
import './LoginPage.css';
import logoImg from '../assets/sekber_logo.png'; 
import loginImg from '../assets/bg_login.png'; 


const validUsers = [
  { username: 'PMVMDA', password: '@User001' },
  { username: 'PMVP', password: '@User002' },
  { username: 'PMVSM', password: '@User003' },
  { username: 'PMPJM', password: '@User004' },
  { username: 'PMVBLM', password: '@User005' },
  { username: 'PMVBN', password: '@User006' },
  { username: 'PMVBR', password: '@User007' },
  { username: 'PMVBA', password: '@User008' },
  { username: 'PMVHTT', password: '@User009' },
  { username: 'PMMITBC', password: '@User010' },
  { username: 'PMVSD', password: '@User011' },
  { username: 'PMCVD', password: '@User012' },
  { username: 'PMVBJ', password: '@User013' },
  { username: 'PMCB', password: '@User014' },
  { username: 'PMVJ', password: '@User015' },
  { username: 'PMMABT', password: '@User016' },
  { username: 'PMVL', password: '@User017' },
  { username: 'PMVSB', password: '@User018' },
  { username: 'PMSBGBC', password: '@User019' },
  { username: 'PMVBP', password: '@User020' },
  { username: 'PMVVD', password: '@User021' },
  { username: 'PMVDCBC', password: '@User022' },
  { username: 'PMBE', password: '@User023' },
  { username: 'PMBV', password: '@User024' },
  { username: 'PMCA', password: '@User025' },
  { username: 'PMVADS', password: '@User026' },
  { username: 'PMVB', password: '@User027' },
  { username: 'PMVDA', password: '@User028' },
  { username: 'PMVDW', password: '@User029' },
  { username: 'PMVLS', password: '@User030' },
  { username: 'PMVMM', password: '@User031' },
  { username: 'PMVM', password: '@User032' },
  { username: 'PMVMJ', password: '@User033' },
  { username: 'PMVMBC', password: '@User034' },
  { username: 'PMVRSA', password: '@User035' },
  { username: 'PMVS', password: '@User036' },
  { username: 'PMVAPS', password: '@User037' },
  { username: 'PMCBB', password: '@User038' },
  { username: 'PMVAS', password: '@User039' },
  { username: 'PMVTR', password: '@User040' },
  { username: 'PMVV', password: '@User041' },
  { username: 'PMCE', password: '@User042' },
  { username: 'PMVATT', password: '@User043' },
  { username: 'PMVMD', password: '@User044' },
  { username: 'PMVVVG', password: '@User045' },
  { username: 'PMVMAS', password: '@User046' },

  // Sekber accounts (unchanged)
  { username: 'Ricky Martin', password: '@Sekber001' },
  { username: 'Felicia Livana', password: '@Sekber004' },
  { username: 'Sher Lie', password: '@Sekber005' },
];

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // LOGIKA ADMIN (FIREBASE AUTH)
    if (username === 'Admin Sekber') {
      try {
        // PENGAMAN: Pastikan auth sudah terinisialisasi
        if (!auth) {
          throw new Error("Konfigurasi Firebase belum siap. Pastikan .env.local sudah diisi dan server di-restart.");
        }

        // Menggunakan email tiruan khusus untuk admin
        const adminEmail = 'adminsekber@gmail.com'; 
        await signInWithEmailAndPassword(auth, adminEmail, password);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        router.push('/dashboard');
      } catch (error: any) {
        setIsLoading(false);
        console.error("Login Error:", error);
        
        // Menampilkan pesan error yang lebih spesifik
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          setErrorMsg('Password Admin salah.');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMsg('Akun Admin belum didaftarkan di Firebase.');
        } else {
          setErrorMsg(error.message || 'Terjadi kesalahan saat login Admin.');
        }
      }
    } 
    // LOGIKA USER BIASA (LOCALSTORAGE)
    else {
      setTimeout(() => {
        setIsLoading(false);
        const isValidUser = validUsers.some(
          (user) => user.username === username && user.password === password
        );

        if (isValidUser) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          router.push('/dashboard');
        } else {
          setErrorMsg('Username atau Password salah. Silakan coba lagi.');
        }
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      {/* SISI KIRI */}
      <div className="login-left">
        <img src={loginImg.src} alt="Background Kampus" />
        <div className="login-left-overlay"></div>
        <div className="login-left-content">
          <h1>Halo!</h1>
          <p>Selamat Datang di Portal Sekber PMVBI (Pemuda Buddhayana) Provinsi Sumatera Utara</p>
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
                  placeholder="Masukkan Username"
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
                  placeholder="Masukkan Password"
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
