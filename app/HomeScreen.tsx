'use client'

import { useState, useEffect } from 'react'
import './HomeScreen.css'
import Link from 'next/link'
import logoImg from './assets/sekber_logo.png'
import mascotImg from './assets/mascoot.png' 

const APP_VERSION = 'v1.0.2'
const APP_CREDIT = '© 2026 Frederick Liko. All rights reserved.'

// Pastikan Anda sudah meng-import gambar Anda di sini
import bg1 from './assets/carousel1.png';
import bg2 from './assets/carousel2.png';
import bg3 from './assets/carousel3.png';

const heroSlides = [
  {
    image: bg1.src, 
    title: 'Bersatu dalam',
    highlight: 'Dharma & Karya',
    subtitle: 'Membangun pemuda Buddhayana Sumatra Utara yang berkarakter, solid, dan berkontribusi nyata bagi masyarakat.'
  },
  {
    image: bg2.src, 
    title: 'Tumbuh dalam',
    highlight: 'Kebersamaan',
    subtitle: 'Menjadi wadah kreativitas dan inovasi pemuda untuk kemajuan bersama.'
  },
  {
    image: bg3.src,
    title: 'Berkarya untuk',
    highlight: 'Nusa & Bangsa',
    subtitle: 'Membentuk generasi yang saling mendukung dan memiliki integritas tinggi.'
  }
]

export default function HomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // STATE UNTUK MOBILE MENU
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fungsi untuk pindah ke slide berikutnya
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  // Timer Auto-slide
  useEffect(() => {
    // Jalankan timer setiap 5 detik
    const timer = setInterval(goToNextSlide, 5000)

    // Bersihkan timer setiap kali currentSlide berubah
    // Ini memastikan saat user klik manual, hitungan 5 detik di-reset dari awal
    return () => clearInterval(timer)
  }, [currentSlide])

  // Fungsi handle klik manual pada dot
  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <a href="#beranda" className="nav-brand">
            <div className="nav-logo-wrap">
              <img src={logoImg.src} alt="SEKBER PMVBI" className="nav-logo" />
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-title">
                SEKBER <span className="brand-accent">PMVBI</span>
              </span>
              <span className="nav-brand-sub">
                Pemuda Buddhayana · Sumut
              </span>
            </div>
          </a>

          <nav className="nav-links">
            <a href="#beranda">Home</a>
            <a href="#program">Program</a>
            <a href="#tentang">About</a>
            <a href="#kontak">Contact</a>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="nav-btn primary">
              Log in
            </Link>
            <a href="#kontak" className="nav-btn secondary">Contact Us</a>
          </div>

          {/* TOMBOL HAMBURGER DENGAN FUNGSI ONCLICK */}
          <button 
            className={`nav-hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span></span><span></span><span></span>
          </button>

          {/* MOBILE MENU DROPDOWN */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <a href="#beranda" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#program" onClick={() => setIsMenuOpen(false)}>Program</a>
              <a href="#tentang" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)}>Contact</a>
              
              <div className="mobile-menu-actions">
                <Link href="/login" className="nav-btn primary" onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Link>
                <a href="#kontak" className="nav-btn secondary" onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                </a>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* HERO CAROUSEL */}
      <section id="beranda" className="hero-section">
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-bg ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-title">
            {heroSlides[currentSlide].title} <br />
            <span className="hero-highlight">{heroSlides[currentSlide].highlight}</span>
          </h1>
          <p className="hero-subtitle">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="hero-cta-group">
            <Link href="/login" className="hero-cta primary">
              Log in
            </Link>
            <a href="#tentang" className="hero-cta secondary">Contact Us</a>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              type="button"
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="values-section">
        <div className="values-grid">
          <div className="value-item">
            <h3 className="value-title">Saddha <span>(Keyakinan)</span></h3>
            <p className="value-desc">Menumbuhkan keyakinan pada Tiratana sebagai landasan hidup.</p>
          </div>
          <div className="value-item">
            <h3 className="value-title">Sila <span>(Karakter)</span></h3>
            <p className="value-desc">Membangun karakter pemuda yang berintegritas dan bermoral.</p>
          </div>
          <div className="value-item">
            <h3 className="value-title">Panna <span>(Kebijaksanaan)</span></h3>
            <p className="value-desc">Mengasah kebijaksanaan melalui pembelajaran dan pengalaman.</p>
          </div>
        </div>
      </section>

      {/* PROGRAM & DIVISI */}
      <section id="program" className="section">
        <div className="section-header">
          <span className="section-label">Kegiatan</span>
          <h2 className="section-title">Program & Divisi</h2>
        </div>

        <div className="program-grid">
          <div className="glass-card program-card">
            <div className="program-icon">🧘</div>
            <h3>Pengembangan Spiritual</h3>
            <p>Kegiatan keagamaan, meditasi, dan pembelajaran Dhamma secara rutin.</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">🤝</div>
            <h3>Sosial & Kemanusiaan</h3>
            <p>Bakti sosial, donor darah, dan aksi tanggap bencana untuk masyarakat.</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">🎭</div>
            <h3>Seni & Budaya</h3>
            <p>Pelestarian budaya Buddhis dan wadah kreativitas seni bagi pemuda.</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">⚽</div>
            <h3>Olahraga & Rekreasi</h3>
            <p>Turnamen olahraga dan kegiatan rekreasi untuk mempererat kebersamaan.</p>
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section id="tentang" className="section">
        <div className="section-header">
          <span className="section-label">Tentang</span>
          <h2 className="section-title">Tentang Kami</h2>
        </div>

        <div className="about-grid">
          <div className="glass-card about-text">
            <p>
              <strong>SEKBER PMVBI</strong> (Pemuda Buddhayana Sumatra Utara)
              adalah organisasi kepemudaan yang berfokus pada pengembangan
              spiritual, sosial, dan budaya bagi generasi muda Buddhis di
              Sumatra Utara. Kami berkomitmen untuk menciptakan pemuda yang
              berkarakter, solid, dan berkontribusi nyata bagi masyarakat.
            </p>
          </div>
          <div className="glass-card about-stats">
            <div className="stat-item">
              <span className="stat-value">20+</span>
              <span className="stat-label">Tahun Berkarya</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Anggota Aktif</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Program / Tahun</span>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="section">
        <div className="section-header">
          <span className="section-label">Hubungi</span>
          <h2 className="section-title">Kontak</h2>
        </div>

        <div className="glass-card contact-card">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <span className="contact-value">sekretariatsekberpmvbisumut@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Instagram</span>
            <span className="contact-value">@sekberpmvbisumut</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Telepon</span>
            <span className="contact-value">+62 821-6576-0993</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Alamat</span>
            <span className="contact-value">Medan, Sumatra Utara</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-col footer-col-brand">
              <div className="footer-brand">
                <img src={logoImg.src} alt="SEKBER PMVBI" className="footer-logo" />
                <div className="footer-brand-text">
                  <span className="footer-brand-title">
                    SEKBER <span className="brand-accent">PMVBI</span>
                  </span>
                  <span className="footer-brand-sub">Pemuda Buddhayana · Sumut</span>
                </div>
              </div>

              <p className="footer-tagline">Bersatu dalam Dharma &amp; Karya</p>
              <p className="footer-desc">
                Membangun pemuda Buddhayana Sumatra Utara yang berkarakter, solid,
                dan berkontribusi nyata bagi masyarakat.
              </p>

              <div className="footer-social">
                <a href="#" aria-label="Instagram" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" aria-label="YouTube" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>
                <a href="#" aria-label="WhatsApp" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Tautan Cepat</h4>
              <ul className="footer-list">
                <li><a href="#beranda">Beranda</a></li>
                <li><a href="#tentang">Tentang Kami</a></li>
                <li><a href="#program">Program</a></li>
                <li><a href="#kontak">Kontak</a></li>
                <li><a href="#">Pendaftaran</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Divisi</h4>
              <ul className="footer-list">
                <li><a href="#">Pengembangan Spiritual</a></li>
                <li><a href="#">Sosial &amp; Kemanusiaan</a></li>
                <li><a href="#">Seni &amp; Budaya</a></li>
                <li><a href="#">Olahraga &amp; Rekreasi</a></li>
                <li><a href="#">Media &amp; Publikasi</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Hubungi Kami</h4>
              <ul className="footer-contact">
                <li>
                  <span className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <span>Jl. Bambu II, Kompleks Graha Niaga Blok A No. 2, Medan, Sumatera Utara, Indonesia 20235</span>
                </li>
                <li>
                  <span className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </span>
                  <span>WA +62 821-6576-0993<br />WA +62 895-6111-79149</span>
                </li>
                <li>
                  <span className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </span>
                  <span>sekretariatsekberpmvbisumut@gmail.com<br />psdmsekberpmvbisumut@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-mascot" aria-hidden="true">
            <img src={mascotImg.src} alt="" className="mascot-img" />
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <span className="home-version">{APP_VERSION}</span>
            <span className="home-credit">{APP_CREDIT}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}