'use client';

import { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip'; // Import JSZip
import './formpendataan.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SECTIONS, STORAGE_KEY, FormField } from '../../data/pendataan';

export default function PendataanPage() {
  const topRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setFormData(p.formData ?? {});
      }
    } catch {}
    setReady(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData }));
    } catch {}
  }, [formData, ready]);

  const totalSteps = SECTIONS.length;
  const section = SECTIONS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const changePage = (idx: number) => {
    if (idx < 0 || idx >= totalSteps) return;
    
    if (idx > currentStep) {
      const missingFields = section.fields.filter(f => f.required && !formData[f.name] && !files[f.name]);
      if (missingFields.length > 0) {
        alert(`Harap lengkapi field wajib (*) terlebih dahulu.`);
        return;
      }
    }

    setCurrentStep(idx);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [name]: file }));
  };

  const resetAll = () => {
    if (!confirm('Kosongkan seluruh data formulir?')) return;
    setFormData({}); 
    setFiles({});
    setShowResult(false);
  };

  const generateExcelData = () => {
    const data: any[][] = [];
    data.push(["FORMULIR PENDATAAN PMV/C/B"]);
    data.push(["SEKBER PMVBI (PEMUDA BUDDHAYANA)"]);
    data.push([]); 

    SECTIONS.forEach(sec => {
      data.push([sec.title]);
      sec.fields.forEach(f => {
        if (f.type === 'file') {
          // Tulis nama file ke dalam Excel
          data.push([f.label, files[f.name] ? files[f.name]?.name : "Belum diupload"]);
        } else {
          data.push([f.label, formData[f.name] || "-"]);
        }
      });
      data.push([]); 
    });

    return data;
  };

  // FUNGSI DOWNLOAD ZIP (EXCEL + LAMPIRAN)
  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      // 1. Buat file Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(generateExcelData());
      ws['!cols'] = [{ wch: 40 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws, "Data Pendataan");
      
      // Convert Excel ke Binary (Array Buffer)
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // 2. Siapkan ZIP
      const zip = new JSZip();
      
      // Masukkan file Excel ke dalam ZIP
      const safeName = (formData['namaPmv'] || 'PMV').replace(/[^a-z0-9]/gi, '_');
      const excelFileName = `Data_Pendataan_${safeName}.xlsx`;
      zip.file(excelFileName, excelBuffer);

      // 3. Masukkan file PDF/Excel yang di-upload ke dalam folder Lampiran
      const lampiranFolder = zip.folder("Lampiran");
      let hasFiles = false;
      
      for (const key of Object.keys(files)) {
        const file = files[key];
        if (file) {
          hasFiles = true;
          // Baca file sebagai ArrayBuffer
          const fileBuffer = await file.arrayBuffer();
          // Masukkan ke folder ZIP
          lampiranFolder?.file(file.name, fileBuffer);
        }
      }

      // Jika tidak ada file yang diupload, buat text kosong
      if (!hasFiles) {
        lampiranFolder?.file("Tidak_Ada_Lampiran.txt", "User tidak mengupload file apapun.");
      }

      // 4. Generate ZIP dan Download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pendataan_${safeName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Gagal membuat ZIP:", error);
      alert("Terjadi kesalahan saat membuat file ZIP.");
    } finally {
      setIsDownloading(false);
    }
  };

    const renderField = (field: FormField) => {
    const isRequired = field.required;
    const value = formData[field.name] || '';
    const file = files[field.name];

    return (
      <div key={field.name} className="pd-field">
        <label>
          {field.label} {isRequired && <span className="req">*</span>}
        </label>
        
        {field.helpText && (
          <div className="pd-help">
            {field.helpText.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
              part.match(/^https?:\/\//) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>
        )}

        {field.type === 'select' ? (
          <select
            className="pd-select"
            value={value}
            onChange={e => handleInputChange(field.name, e.target.value)}
            required={isRequired}
          >
            <option value="" disabled>{field.placeholder || 'Pilih opsi...'}</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            placeholder={field.placeholder}
            value={value}
            onChange={e => handleInputChange(field.name, e.target.value)}
            required={isRequired}
          />
        ) : field.type === 'file' ? (
          <div className="pd-fileWrapper">
            <input
              type="file"
              accept={field.accept}
              onChange={e => handleFileChange(field.name, e.target.files?.[0] || null)}
              required={isRequired && !file}
            />
            <span className="pd-fileIcon">📄</span>
            <div className="pd-fileText">Klik untuk upload file</div>
            <div className="pd-fileName">
              {file ? `✓ ${file.name}` : 'Belum ada file dipilih'}
            </div>
          </div>
        ) : field.type === 'date' ? (
          /* --- TAMBAHAN UNTUK CUSTOM DATE PICKER --- */
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date: Date | null) => {
              if (date) {
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                handleInputChange(field.name, localDate.toISOString().split('T')[0]);
              } else {
                handleInputChange(field.name, '');
              }
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText={field.placeholder || "Pilih Tanggal"}
            className="pd-custom-datepicker"
            wrapperClassName="pd-datepicker-wrapper"
            showPopperArrow={false}
            popperPlacement="bottom-start"
            required={isRequired}
          />
        ) : (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={e => handleInputChange(field.name, e.target.value)}
            required={isRequired}
          />
        )}
      </div>
    );
  };

  return (
    <div ref={topRef} className="pd-page">
      <div className="pd-pageHeader">
        <p className="pd-kicker">SEKBER PMVBI (Pemuda Buddhayana)</p>
        <h1 className="pd-title">Formulir Pendataan PMV/C/B</h1>
      </div>

      <div className="pd-steps">
        {SECTIONS.map((sec, i) => (
          <button 
            key={sec.id} 
            type="button"
            onClick={() => changePage(i)}
            className={`pd-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
          >
            <span className="pd-stepNo">{i < currentStep ? '✓' : i + 1}</span>
            <span className="pd-stepLabel">{sec.title}</span>
          </button>
        ))}
      </div>

      {section && (
        <section className="pd-group">
          <h2 className="pd-groupTitle">{section.title}</h2>
          
          {section.contactInfo && (
            <div className="pd-contact">{section.contactInfo}</div>
          )}

          <div className="pd-card">
            {section.fields.map(renderField)}
          </div>

          <div className="pd-groupNav">
            <button 
              type="button" 
              className="pd-btn" 
              onClick={() => changePage(currentStep - 1)} 
              disabled={isFirst}
            >
              ‹ Sebelumnya
            </button>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              Halaman {currentStep + 1} dari {totalSteps}
            </span>
            {isLast ? (
              <button 
                type="button" 
                className="pd-btn pd-btnPrimary"
                onClick={() => {
                  const missing = section.fields.filter(f => f.required && !formData[f.name] && !files[f.name]);
                  if (missing.length > 0) {
                    alert('Mohon lengkapi semua field wajib sebelum submit.');
                    return;
                  }
                  setShowResult(true);
                }}
              >
                Review & Download ›
              </button>
            ) : (
              <button 
                type="button" 
                className="pd-btn pd-btnPrimary"
                onClick={() => changePage(currentStep + 1)}
              >
                Selanjutnya ›
              </button>
            )}
          </div>
        </section>
      )}

      {showResult && (
        <div className="pd-modalOverlay" onClick={() => setShowResult(false)}>
          <div className="pd-modal" onClick={e => e.stopPropagation()}>
            <div className="pd-modalHeader">
              <h2 className="pd-modalTitle">Review Data Pendataan</h2>
              <button className="pd-modalClose" onClick={() => setShowResult(false)}>✕</button>
            </div>
            
            <div className="pd-modalBody">
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                Pastikan semua data sudah benar. Saat Anda mengunduh, file Excel dan dokumen PDF/Excel yang dilampirkan akan dijadikan satu dalam bentuk file ZIP.
              </p>
              <div style={{ background: '#090E17', padding: '16px', borderRadius: '8px', border: '1px solid #374151', fontSize: '13px' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>Data PMV:</strong>
                <div>Nama: {formData['namaPmv'] || '-'}</div>
                <div>Alamat: {formData['alamat'] || '-'}</div>
                <div>Email: {formData['email'] || '-'}</div>
                <div style={{ marginTop: '12px' }}>
                  <strong style={{ color: 'var(--primary)' }}>File Terlampir (Akan dimasukkan ke ZIP):</strong>
                  <ul style={{ paddingLeft: '20px', margin: '4px 0' }}>
                    {Object.entries(files).filter(([_, f]) => f).map(([key, f]) => (
                      <li key={key} style={{ wordBreak: 'break-all' }}>{f?.name}</li>
                    ))}
                    {Object.values(files).every(f => !f) && <li>Tidak ada file</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pd-modalFooter">
              <button className="pd-btn" onClick={() => setShowResult(false)}>
                Tutup
              </button>
              <button 
                className="pd-btn pd-btnPrimary" 
                onClick={handleDownloadZip} 
                disabled={isDownloading}
              >
                {isDownloading ? 'Menyiapkan ZIP...' : '⬇ Download ZIP (Excel + Lampiran)'}
              </button>
              <button className="pd-btn" onClick={resetAll} style={{ color: 'var(--notexist)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}