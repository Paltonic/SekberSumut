export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'email' | 'file' | 'select';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  accept?: string; // Untuk file input
  options?: string[]; // Untuk dropdown
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  contactInfo?: string;
}

export const STORAGE_KEY = 'pendataan_pmv_data';

export const SECTIONS: FormSection[] = [
  {
    id: 'data-pmv',
    title: '1. Data PMV/C/B',
    fields: [
      { 
        name: 'namaPmv', 
        label: 'Nama PMV/C', 
        type: 'select', 
        required: true, 
        placeholder: 'Pilih Nama PMV/C',
        options: [
          "Kab. Asahan - PMV Magga Dhamma",
          "Kab. Asahan - PMV Paradipa",
          "Kab. Asahan - PMV Swastimuni",
          "Kab. Deli Serdang - PM Prasada Jinadhammo",
          "Kab. Deli Serdang - PMV Buddha Loka Mangala",
          "Kab. Deli Serdang - PMV Buddha Narada",
          "Kab. Deli Serdang - PMV Buddha Ramsi",
          "Kab. Deli Serdang - PMV Budi Abadi",
          "Kab. Deli Serdang - PMV Hok Tek Tong",
          "Kab. Deli Serdang - PMV Sakyamuni Buddha ITBC",
          "Kab. Deli Serdang - PMV Satya Dharma",
          "Kab. Labuhanbatu - PMC Virya Dharma",
          "Kab. Labuhanbatu - PMV Buddha Jayanti",
          "Kab. Labuhanbatu Utara - PMC Buddhavana",
          "Kab. Labuhanbatu Utara - PMV Jetavana",
          "Kab. Langkat - PMM Asokarama Buddhist Temple",
          "Kab. Serdang Bedagai - PMV Lokesvara",
          "Kab. Serdang Bedagai - PMV Sakyamuni Buddha",
          "Kota Binjai - PM Sakya Buddha Gotama Buddhist Center",
          "Kota Binjai - PMV Buddha Paduma",
          "Kota Gunungsitoli - PMV Vimala Dharma",
          "Kota Medan - PMV Dharma Cakra Buddhist Center",
          "Kota Medan - PMB Ehipassiko",
          "Kota Medan - PMB Viriyadhika",
          "Kota Medan - PMC Aryavamsa",
          "Kota Medan - PMV Adi Dharma Santi",
          "Kota Medan - PMV Borobudur",
          "Kota Medan - PMV Dharma Aura",
          "Kota Medan - PMV Dharma Wijaya",
          "Kota Medan - PMV Loka Santi",
          "Kota Medan - PMV Mendut",
          "Kota Medan - PMV Metta Jaya",
          "Kota Medan - PMV Mitra Buddhist Center",
          "Kota Medan - PMV Ratana Stupa Agung",
          "Kota Medan - PMV Sakyamuni",
          "Kota Medan - PMV Maha Mangala",
          "Kota Padang Sidempuan - PMV Avalokitesvara",
          "Kota Pematangsiantar - PMC Bodhi Buddhavana",
          "Kota Sibolga - PMV Avalokitesvara",
          "Kota Tanjungbalai - PMV Tri Ratna",
          "Kota Tanjungbalai - PMV Vessabhu",
          "Kota Tebing Tinggi - PMC Ekayana",
          "Kota Tebing Tinggi - PMV Avalokitesvara",
          "Kota Tebing Tinggi - PMV Maha Dana",
          "Kota Tebing Tinggi - PMV Vidya Vajra Ganda"
        ]
      },
      { name: 'alamat', label: 'Alamat lengkap PMV/C', type: 'textarea', required: true, placeholder: 'Tuliskan alamat lengkap...' },
      { name: 'kodePos', label: 'Kode Pos', type: 'text', required: true, placeholder: 'Contoh: 12345' },
      { name: 'noTelp', label: 'No. telp PMV/C atau Vihara/Cetya', type: 'text', required: true, placeholder: 'Contoh: (0623) 93124. Jika tidak ada, isi "Tidak ada"', helpText: 'Cantumkan kode area + nomor telepon' },
      { name: 'email', label: 'Email PMV/C', type: 'email', required: true, placeholder: 'email@contoh.com', helpText: 'Mohon isi dengan email resmi PMV/C, BUKAN email pribadi pengurus.' },
      { name: 'instagram', label: 'Username Instagram PMV/C', type: 'text', placeholder: '@username_pmv' },
    ]
  },
  {
    id: 'data-pengurus',
    title: '2. Data Pengurus PMV/C',
    contactInfo: 'Jika terdapat pertanyaan dan membutuhkan informasi lebih lanjut silakan menghubungi Tim Kesekretariatan:\n082275997292 - Reggina Onggatta\n082367319569 - Louise Derizhy',
    fields: [
      { name: 'jumlahPengurus', label: 'Jumlah pengurus PMV/C', type: 'number', required: true, placeholder: 'Contoh: 15', helpText: 'Dari ketua hingga anggota PMV/C' },
      { name: 'fileSuratPemberitahuan', label: 'Surat Pemberitahuan Susunan Kepengurusan', type: 'file', required: true, accept: '.pdf', helpText: 'Download template: https://docs.google.com/document/d/1Z8zGTScEc-RwJTyQ1IGkLqG3J5i7W1Pl/edit\nPastikan file diupload dalam bentuk PDF dengan data yang sudah benar dan lengkap (Max 10MB).' },
      { name: 'fileDetailSusunan', label: 'Detail Susunan Kepengurusan', type: 'file', required: true, accept: '.xlsx, .xls', helpText: 'Download template: https://docs.google.com/spreadsheets/d/1Jad_ByyVEGTHPBcKUNejQK8JrqSiwszY/edit\nPastikan file diupload dalam bentuk Excel dengan data yang sudah benar dan lengkap (Max 10MB).' },
    ]
  },
  {
    id: 'kepengurusan',
    title: '3. Kepengurusan PMV/C',
    fields: [
      { name: 'usiaPmv', label: 'Usia PMV/C (tahun)', type: 'number', required: true, placeholder: 'Contoh: 5', helpText: 'Per bulan saat mengisi formulir ini' },
      { name: 'periode', label: 'Periode berjalan', type: 'text', required: true, placeholder: 'Contoh: ke-21 (XXI)' },
      { name: 'masaBakti', label: 'Lama masa bakti / jabatan dalam 1 periode (tahun)', type: 'number', required: true, placeholder: 'Contoh: 3' },
      { name: 'bulanPergantian', label: 'Pergantian kepengurusan pada bulan ...', type: 'text', required: true, placeholder: 'Contoh: Januari' },
      { name: 'tanggalPelantikan', label: 'Tanggal pelantikan/pengangkatan pengurus', type: 'date', required: true },
      { name: 'fileSK', label: 'Scan SK Pengangkatan/Pelantikan Pengurus', type: 'file', required: true, accept: '.pdf', helpText: 'Pastikan bahwa SK yg di-upload sudah ditandatangani. (Max 10MB).' },
    ]
  }
];