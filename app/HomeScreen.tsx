'use client'

import { useState, useEffect } from 'react'
import './HomeScreen.css'
import Link from 'next/link'
import logoImg from './assets/sekber_logo.png'
import mascotImg from './assets/mascoot.png' 

const APP_VERSION = 'v1.1.3'
const APP_CREDIT = '© 2026 FLik FLip. All rights reserved.'

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
            <a href="#program">Programme</a>
            <a href="#divisi">Division</a>
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
              <a href="#program" onClick={() => setIsMenuOpen(false)}>Programme</a>
              <a href="#divisi" onClick={() => setIsMenuOpen(false)}>Division</a>
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
            <a href="#kontak" className="hero-cta secondary">Contact Us</a>
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

      {/* VALUES SECTION (3 PILAR) */}
      <section className="values-section">
        <div className="values-grid">
          <div className="value-item">
            <h3 className="value-title">Theravada <span>(Dharmacakra)</span></h3>
            <p className="value-desc">Ajaran dari mazhab Theravada yang menekankan pada dasar moralitas dan kedisiplinan.</p>
          </div>
          <div className="value-item">
            <h3 className="value-title">Mahayana <span>(Swastika)</span></h3>
            <p className="value-desc">Ajaran dari mazhab Mahayana yang menekankan pada welas asih dan cinta kasih universal.</p>
          </div>
          <div className="value-item">
            <h3 className="value-title">Vajrayana <span>(Visvavajra)</span></h3>
            <p className="value-desc">Ajaran dari mazhab Tantrayana/Vajrayana yang menekankan pada transformasi diri dan kebijaksanaan.</p>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="section">
        <div className="section-header">
          <span className="section-label">Kegiatan</span>
          <h2 className="section-title">Program</h2>
        </div>

        <div className="program-grid">
          <div className="glass-card program-card">
            <div className="program-icon">🤝</div>
            <h3>Musyawarah & Temu Karya</h3>
            <p>Wadah pengambilan keputusan dan silaturahmi melalui Musda, Mukerda, dan STKD.</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">📚</div>
            <h3>Kaderisasi & Pelatihan</h3>
            <p>Peningkatan kapasitas pemuda melalui Bina Widya, Pelatda, dan Dhamma Vidya.</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">🧘</div>
            <h3>Spiritual & Karakter</h3>
            <p>Pembinaan karakter, pelatihan pemuda Buddhayana, dan pendampingan SMB GABI (IPGABI).</p>
          </div>
          <div className="glass-card program-card">
            <div className="program-icon">🎉</div>
            <h3>Event & Sosial</h3>
            <p>Mempererat persaudaraan melalui Welcome Kalyanamitta dan Monthly Recharge.</p>
          </div>
        </div>
      </section>

      {/* DIVISI */}
      <section id="divisi" className="section">
        <div className="section-header">
          <span className="section-label">Pengurus</span>
          <h2 className="section-title">Divisi</h2>
        </div>

        <div className="divisi-grid">
          <div className="glass-card divisi-card">
            <div className="divisi-icon">📝</div>
            <h3>Sekretaris Provinsi & Wakil</h3>
            <p>
              Mengelola administrasi organisasi, surat-menyurat, arsip, dan
              koordinasi kesekretariatan tingkat provinsi.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">🗂️</div>
            <h3>Seksi Kesekretariatan</h3>
            <p>
              Mendukung tugas sekretariat dalam pengelolaan dokumen, notulen
              rapat, dan administrasi harian.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">💰</div>
            <h3>Seksi Keuangan</h3>
            <p>
              Mengelola anggaran, pembukuan, laporan keuangan, dan transparansi
              keuangan organisasi.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">📚</div>
            <h3>Seksi Pengembangan SDM</h3>
            <p>
              Peningkatan kapasitas anggota melalui pelatihan, kaderisasi, dan
              pengembangan kompetensi pemuda.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">🧘</div>
            <h3>Seksi Pelayanan Dharma</h3>
            <p>
              Pembinaan spiritual, kegiatan keagamaan, dan pelayanan dharma bagi
              anggota serta masyarakat.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">🤝</div>
            <h3>Seksi Kemitraan</h3>
            <p>
              Menjalin kerja sama dengan lembaga, organisasi, dan mitra strategis
              untuk mendukung program kerja.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">📸</div>
            <h3>Seksi Publikasi & Dokumentasi</h3>
            <p>
              Mengelola media sosial, konten, dan dokumentasi seluruh kegiatan
              organisasi.
            </p>
          </div>

          <div className="glass-card divisi-card">
            <div className="divisi-icon">🏛️</div>
            <h3>DPD IPGABI Sumut</h3>
            <p>
              Dewan Pimpinan Daerah Ikatan Pemuda GABI Sumatera Utara —
              koordinasi dan pembinaan pemuda Buddhayana tingkat daerah.
            </p>
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
            <p style={{ marginBottom: '1.5rem' }}>
              <strong>SEKBER PMVBI</strong> (Sekretariat Bersama Persaudaraan Muda-mudi Vihara-vihara Buddhayana Indonesia) / Perkumpulan Pemuda Buddhayana Indonesia adalah wadah persatuan dan kesatuan yang mengkoordinasi Pemuda-pemudi Buddhis yang tergabung dalam Persaudaraan Muda-Mudi Vihara atau Cetiya Buddhayana di seluruh Indonesia. Mempunyai maksud dan tujuan di bidang sosial keagamaan.
            </p>
            
            <h4 style={{ color: 'var(--accent, #22c55e)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Visi</h4>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Menjadi Persaudaraan Muda-mudi Vihara/Cetiya di Indonesia yang memiliki Semangat Buddhayana dan kepedulian dengan menumbuhkembangkan kapasitas muda-mudi yang kompeten dan memadai melalui sistem pendidikan dan pelatihan yang terstruktur dan terpadu dengan memanfaatkan kemajuan teknologi informasi.
            </p>

            <h4 style={{ color: 'var(--accent, #22c55e)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Misi</h4>
            <p style={{ fontSize: '0.95rem' }}>
              Mengamalkan dan berbagi tentang esensi Ajaran Buddha secara kontekstual melalui transformasi diri dan transformasi sosial dengan berpegang teguh pada nilai-nilai Non-sektarian, Inklusivisme, Pluralisme, dan Universalisme serta berkeyakinan kepada Dharmakaya (Sanghyang Adi Buddha).
            </p>
          </div>
          <div className="glass-card about-stats">
            <div className="stat-item">
              <span className="stat-value">45+</span>
              <span className="stat-label">Tahun Berkarya</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">40+</span>
              <span className="stat-label">PMV/C/B Anggota</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Program </span>
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
            <span className="contact-value">psdmsekberpmvbisumut@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Instagram</span>
            <span className="contact-value">@sekberpmvbisumut</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Telepon</span>
            <span className="contact-value">(061) 4555586</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">Alamat</span>
            <span className="contact-value">Buddhayana Center, Jl. Bambu II Kompleks Graha Niaga Blok A2, Medan 20235</span>
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
                <a
                  href="https://www.instagram.com/sekberpmvbisumut"
                  aria-label="Instagram"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/sekberpmvbisumut"
                  aria-label="Facebook"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                <a
                  href="https://www.youtube.com/channel/UClnpRgLS7lT1vua1GvIEVWA"
                  aria-label="YouTube"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@sekberpmvbisumut?is_from_webapp=1&sender_device=pc"
                  aria-label="TikTok"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Tautan Cepat</h4>
              <ul className="footer-list">
                <li><a href="#beranda">Beranda</a></li>
                <li><a href="#program">Program</a></li>
                <li><a href="#divisi">Divisi</a></li>
                <li><a href="#tentang">Tentang Kami</a></li>
                <li><a href="#kontak">Kontak</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Program</h4>
              <ul className="footer-list">
                <li><a href="#">Sarasehan &amp; Temu Karya Daerah</a></li>
                <li><a href="#">Musyawarah Kerja Daerah &amp; Pelatihan Daerah</a></li>
                <li><a href="#">Musyawarah Daerah</a></li>
                <li><a href="#">Bina Widya</a></li>
                <li><a href="#">Dhamma Vidya</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Hubungi Kami</h4>
              <ul className="footer-contact">
                <li>
                  <span className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <span>Buddhayana Center, Jl. Bambu II Kompleks Graha Niaga Blok A2, Medan 20235</span>
                </li>
                <li>
                  <span className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </span>
                  <span>(061) 4555586</span>
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