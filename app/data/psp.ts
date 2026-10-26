// app/identifikasi/data.ts

export type MarkKey = "good" | "notGood" | "notExist";
export type Kondisi = [MarkKey, string];

export type Item = {
  no: number;
  komponen: string;
  item: string;
  subItem: string;
  indikator: string;
  kondisi: Kondisi[];
  penjelasan?: string;
};

export const MARK_META: Record<
  MarkKey,
  { label: string; point: number; badgeClass: string; optionClass: string }
> = {
  good: {
    label: "Exist, good",
    point: 2,
    badgeClass: "badgeGood",
    optionClass: "optionGood",
  },
  notGood: {
    label: "Exist, not good",
    point: 1,
    badgeClass: "badgeNotGood",
    optionClass: "optionNotGood",
  },
  notExist: {
    label: "Not exist",
    point: 0,
    badgeClass: "badgeNotExist",
    optionClass: "optionNotExist",
  },
};

export const STORAGE_KEY = "pmvc-identifikasi-v1";

export const ITEMS: Item[] = [
  {
    no: 1,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "Susunan Pengurus",
    indikator:
      "Terdapat minimal susunan pengurus, yang terdiri dari: Ketua, Sekretaris, dan Bendahara",
    kondisi: [
      ["good", "Memiliki minimal susunan pengurus yang terdiri dari Ketua, Sekretaris dan Bendahara"],
      ["notGood", "Tidak memiliki Sekretaris dan/atau Bendahara"],
      ["notExist", "Tidak memiliki kepengurusan"],
    ],
  },
  {
    no: 2,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "Pembina",
    indikator: "Terdapat pembina dalam struktur PMV/C",
    kondisi: [
      ["good", "Memiliki pembina dalam struktur PMV/C"],
      ["notExist", "Tidak memiliki pembina dalam struktur PMV/C"],
    ],
  },
  {
    no: 3,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "SK Pengangkatan Pengurus",
    indikator:
      "Terdapat SK Pengangkatan Pengurus yang diterbitkan oleh Yayasan / PUB / Setprov Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Memiliki SK Pengangkatan Pengurus"],
      ["notExist", "Tidak memiliki SK Pengangkatan Pengurus"],
    ],
    penjelasan:
      "SK Pengangkatan Pengurus diperlukan sebagai legalitas suatu kepengurusan PMV/C yang diterbitkan oleh Yayasan / PUB / Setprov Sekber PMVBI (Pemuda Buddhayana).\n\nIdealnya, dengan adanya SK tersebut, suatu kepengurusan PMV/C telah sah, tanpa peduli apakah pengurus PMV/C tersebut ada dilantik atau tidak.",
  },
  {
    no: 4,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "Masa Bakti Pengurus",
    indikator:
      "Pengurus yang bertugas sekarang sesuai dengan masa bakti / waktu yang telah ditetapkan.",
    kondisi: [
      ["good", "Pergantian pengurus sesuai dengan masa bakti / waktu yang ditetapkan"],
      ["notGood", "Pergantian pengurus melebihi dari masa bakti / waktu yang ditetapkan (>3 bulan)"],
      ["notExist", "Tidak ada Ketua / pengurus baru."],
    ],
    penjelasan: "Tujuan: untuk mengetahui lancar/tidaknya regenerasi dalam suatu PMV/C",
  },
  {
    no: 5,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "Uraian Tugas Pengurus",
    indikator:
      "Adanya uraian tugas (job description) pengurus sesuai dengan struktur organisasi",
    kondisi: [
      ["good", "Memiliki uraian tugas (job description) pengurus"],
      ["notExist", "Tidak memiliki uraian tugas (job description) pengurus"],
    ],
  },
  {
    no: 6,
    komponen: "Organisasi",
    item: "Struktur Organisasi",
    subItem: "Bagan Struktur Organisasi",
    indikator:
      "Terdapat bagan struktur organisasi PMV/C yang dipajang/ditempel di mading / tempat yang tampak oleh umat",
    kondisi: [
      ["good", "Memiliki dan memajang bagan struktur organisasi"],
      ["notExist", "Tidak memiliki dan memajang bagan struktur organisasi"],
    ],
  },
  {
    no: 7,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Pelantikan Pengurus",
    indikator: "Mengadakan pelantikan pengurus",
    kondisi: [
      ["good", "Pelantikan pengurus terlaksana"],
      ["notExist", "Pelantikan pengurus tidak terlaksana"],
    ],
    penjelasan:
      "Pelantikan Pengurus dilakukan oleh Yayasan / PUB / Setprov Sekber PMVBI (Pemuda Buddhayana) sesuai yang telah disepakati",
  },
  {
    no: 8,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Pembekalan Pengurus",
    indikator:
      "Melakukan pembekalan pengurus baru sebelum/sesudah tanggal pengangkatan/pelantikan",
    kondisi: [
      ["good", "Melakukan pembekalan pengurus <1 bulan dari tanggal pengangkatan/pelantikan"],
      ["notGood", "Melakukan pembekalan pengurus >1 bulan dari tanggal pengangkatan/pelantikan"],
      ["notExist", "Tidak ada pembekalan pengurus dari tanggal pengangkatan/pelantikan"],
    ],
  },
  {
    no: 9,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Peraturan Organisasi",
    indikator: "Mempunyai peraturan organisasi dari PMV/C yang bersangkutan",
    kondisi: [
      ["good", "Mempunyai peraturan organisasi, dan sudah terangkum rapi dalam bentuk AD/ART"],
      ["notGood", "Mempunyai peraturan organisasi, namun masih secara lisan atau hanya tertulis dalam lembaran tertentu"],
      ["notExist", "Tidak memiliki peraturan organisasi sama sekali"],
    ],
    penjelasan:
      "Peraturan Organisasi berisi setidaknya:\n- Nama, tanggal pendirian dan tempat Organisasi\n- Visi, Misi dan Tujuan Organisasi\n- Syarat keanggotaan Organisasi\n- Struktur kepengurusan Organisasi\n- Tata cara musyawarah dan pemilihan Ketua Organisasi",
  },
  {
    no: 10,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Arsip AD/ART Sekber PMVBI dan IPGABI",
    indikator:
      "Mempunyai arsip (hardcopy/softcopy) AD/ART Sekber PMVBI (Pemuda Buddhayana) dan IPGABI",
    kondisi: [
      ["good", "Mempunyai arsip AD/ART Sekber PMVBI (Pemuda Buddhayana) dan IPGABI"],
      ["notExist", "Tidak mempunyai arsip AD/ART Sekber PMVBI (Pemuda Buddhayana) dan IPGABI"],
    ],
  },
  {
    no: 11,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Rapat Pengurus",
    indikator: "Adanya rapat pengurus secara berkala",
    kondisi: [
      ["good", "Adanya rapat pengurus yang rutin dan terjadwal dalam 1 periode."],
      ["notGood", "Adanya rapat pengurus, namun tidak rutin dilakukan."],
      ["notExist", "Tidak adanya rapat rutin atau rapat hanya diadakan untuk membahas kegiatan besar di Vihara/Cetiya."],
    ],
    penjelasan:
      "- Idealnya rapat pengurus diadakan setiap 3 - 6 bulan sekali, yang telah dijadwalkan melalui Program Kerja PMV/C.\n- Agenda rapat pengurus minimal: 1) evaluasi program kerja yang telah berjalan dan 2) pembahasan rencana program kerja mendatang.\n- Pastikan setiap rapat didokumentasikan (untuk keperluan LPJ).",
  },
  {
    no: 12,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Rapat Panitia",
    indikator:
      "Adanya rapat panitia dimulai dari awal hingga setelah selesai kegiatan.",
    kondisi: [
      ["good", "Adanya: 1) rapat pembentukan panitia, 2) rapat laporan perkembangan/persiapan panitia (min. 2 kali), 3) rapat evaluasi kegiatan (maks. 1 bulan setelah kegiatan)."],
      ["notExist", "Rapat laporan perkembangan/persiapan panitia hanya dilakukan sesekali dan tidak adanya rapat evaluasi kegiatan."],
    ],
    penjelasan:
      "3 jenis rapat, yang terdiri dari:\n1. rapat pembentukan panitia\n2. rapat laporan perkembangan/persiapan panitia (min. 2 kali)\n3. rapat evaluasi kegiatan (maks. 1 bulan setelah kegiatan)\n\nMerupakan satu kesatuan yang saling melengkapi. Rapat laporan perkembangan/persiapan panitia perlu diadakan dalam jumlah yang cukup (tidak terlalu sedikit ataupun banyak), agar persiapan kegiatan menjadi lebih matang. Rapat evaluasi kegiatan juga penting, karena panitia mempunyai gambaran persiapan apa saja yang masih kurang, sehingga dapat diperbaiki pada kegiatan selanjutnya.",
  },
  {
    no: 13,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Musyawarah Anggota",
    indikator:
      "Adanya Musyawarah Anggota yang dihadiri oleh semua anggota PMV/C",
    kondisi: [
      ["good", "Musyawarah Anggota terlaksana, dengan agenda paling minimal: 1) Pembacaan LPJ Pengurus yang akan demisioner/menyelesaikan masa jabatannya, 2) Pemilihan/Penetapan Ketua PMV/C baru."],
      ["notGood", "Musyawarah Anggota terlaksana, namun agendanya hanya Pemilihan/Penetapan Ketua PMV/C baru"],
      ["notExist", "Musyawarah Anggota tidak terlaksana"],
    ],
    penjelasan:
      'Penamaan kegiatan "Musyawarah Anggota" bisa berbeda-beda sesuai ketetapan masing-masing PMV/C.',
  },
  {
    no: 14,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Pemahaman tentang Sekber PMVBI",
    indikator:
      "Pengurus mempunyai pemahaman tentang Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Semua pengurus mempunyai pemahaman tentang Sekber PMVBI (Pemuda Buddhayana)"],
      ["notGood", "Hanya beberapa pengurus mempunyai pemahaman tentang Sekber PMVBI (Pemuda Buddhayana)"],
      ["notExist", "Tidak adanya pengurus yang mempunyai pemahaman tentang Sekber PMVBI (Pemuda Buddhayana)"],
    ],
  },
  {
    no: 15,
    komponen: "Organisasi",
    item: "Pelaksanaan Organisasi",
    subItem: "Pemahaman tentang Wawasan Buddhayana",
    indikator:
      "Pengurus mempunyai pemahaman tentang pengetahuan umum Wawasan Buddhayana",
    kondisi: [
      ["good", "Semua pengurus mempunyai pemahaman tentang pengetahuan umum Wawasan Buddhayana"],
      ["notGood", "Hanya beberapa pengurus mempunyai pemahaman tentang pengetahuan umum Wawasan Buddhayana"],
      ["notExist", "Tidak adanya pengurus yang mempunyai pemahaman tentang pengetahuan umum Wawasan Buddhayana"],
    ],
  },
  {
    no: 16,
    komponen: "Organisasi",
    item: "Program Kerja",
    subItem: "Program Kerja",
    indikator: "Mempunyai program kerja yang akan dilaksanakan",
    kondisi: [
      ["good", "Mempunyai program kerja tertulis yang telah dirumuskan untuk 1 periode berjalan"],
      ["notExist", "Tidak mempunyai program kerja tertulis untuk 1 periode berjalan"],
    ],
  },
  {
    no: 17,
    komponen: "Organisasi",
    item: "Program Kerja",
    subItem: "Laporan Program Kerja",
    indikator:
      "Mempunyai laporan pertanggungjawaban untuk: 1) semua kegiatan, dan 2) masing-masing kegiatan khusus (acara besar) yang telah dilaksanakan dalam 1 periode",
    kondisi: [
      ["good", "Adanya kedua jenis LPJ tersebut yang telah dilakukan selama 1 periode"],
      ["notGood", "Hanya memiliki salah satu jenis LPJ tersebut"],
      ["notExist", "Tidak memiliki satupun jenis dari LPJ tersebut"],
    ],
  },
  {
    no: 18,
    komponen: "Performa Seksi",
    item: "Sekretaris",
    subItem: "Daftar Ketua PMV/C",
    indikator: "Mempunyai Daftar Ketua PMV/C yang pernah menjabat",
    kondisi: [
      ["good", "Memiliki daftar Ketua PMV/C yang lengkap (100% dari total periode)"],
      ["notGood", "Memiliki daftar Ketua PMV/C, namun tidak lengkap (50-100% dari total periode)"],
      ["notExist", "Tidak memiliki daftar Ketua PMV/C atau hanya <50% dari total periode"],
    ],
  },
  {
    no: 19,
    komponen: "Performa Seksi",
    item: "Sekretaris",
    subItem: "Daftar Inventaris",
    indikator:
      "Melakukan pendataan dan menyimpan inventaris PMV/C dengan baik",
    kondisi: [
      ["good", "Memiliki daftar inventaris serta barang fisik yang lengkap atau jika PMV/C nihil tidak memiliki inventaris"],
      ["notGood", "Memiliki daftar inventaris, namun barang fisik tidak lengkap"],
      ["notExist", "Tidak memiliki daftar inventaris"],
    ],
    penjelasan:
      "- Contoh inventaris PMV/C: Proyektor, kamera, meja, laptop, printer, dll\n- Inventaris yang didata hanya yang benar-benar dimiliki PMV/C",
  },
  {
    no: 20,
    komponen: "Performa Seksi",
    item: "Sekretaris",
    subItem: "Arsip Atribut PMV/C",
    indikator:
      "Mengarsip atribut PMV/C dengan lengkap, yang terdiri dari:\n- Pataka PMV/C\n- Stempel PMV/C\n- Softcopy Logo PMV/C (high quality)\n- Bendera Sekber PMVBI (Pemuda Buddhayana)\n- Rompi Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Mempunyai dan mengarsip semua atribut tersebut dengan lengkap"],
      ["notGood", "Hanya mempunyai / mengarsip sebagian dari atribut tersebut"],
      ["notExist", "Tidak mempunyai / mengarsip semua atribut tersebut"],
    ],
    penjelasan:
      "Jika sudah kehilangan logo PMV/C yang high quality, disarankan agar PMV/C segera me-remake logo tersebut",
  },
  {
    no: 21,
    komponen: "Performa Seksi",
    item: "Sekretaris",
    subItem: "Kegiatan Pencatatan Administrasi",
    indikator:
      "Melakukan kegiatan pencatatan administrasi, yang terdiri dari:\n1. Menyimpan seluruh surat masuk dan surat keluar (min. 5 periode terakhir)\n2. Menyimpan SK dan Berita Acara Pelantikan PMV/C (min. 5 periode terakhir)\n3. Menyimpan Proposal Kegiatan (min. 5 periode terakhir)\n4. Menyimpan LPJ Kegiatan yang sudah terlaksana (min. 5 periode terakhir)\n5. Menyimpan LPJ akhir periode kepengurusan beserta daftar kegiatan (min. 5 periode terakhir)\n6. Menyimpan notulen rapat\n7. Membuat tabel Daftar Surat Masuk, Surat Keluar, SK, Proposal, LPJ Kegiatan, LPJ Kepengurusan dan Notulen Rapat (min. 5 periode terakhir)\n8. Menyimpan dan merapikan folder beserta template (surat keluar, amplop, notulen, proposal, LPJ, dll)\n9. Mencatat tanggal berdiri PMV/C\n10. Menyimpan softcopy lagu/MV Semangat Buddhayana dan Mars Sekber PMVBI\n11. Menyimpan materi sarasehan/workshop narasumber kegiatan Sekber PMVBI\n12. Menyimpan file foto dokumentasi kegiatan PMV/C yang diarsip oleh Seksi Medkom (1 - 3 foto per kegiatan, untuk LPJ)",
    kondisi: [
      ["good", "Melakukan kegiatan pencatatan administrasi di atas sebanyak 9 - 12 item"],
      ["notGood", "Melakukan kegiatan pencatatan administrasi di atas sebanyak 5 - 8 item"],
      ["notExist", "Tidak melakukan kegiatan pencatatan administrasi di atas sama sekali, atau melakukan sebanyak 1 - 4 item"],
    ],
  },
  {
    no: 22,
    komponen: "Performa Seksi",
    item: "Sekretaris",
    subItem: "Transisi Kepengurusan",
    indikator:
      "1. Tepat waktu mengajukan surat permohonan pelantikan pengurus PMV/C yang baru\n2. Membuat Berita Acara Serah Terima Jabatan Sekretaris dan Bendahara",
    kondisi: [
      ["good", "Ada dilakukan"],
      ["notGood", "Ada dilakukan salah satu"],
      ["notExist", "Tidak ada dilakukan"],
    ],
    penjelasan:
      "1. Surat ditujukan kepada Yayasan / PUB / Setprov Sekber PMVBI (Pemuda Buddhayana) sesuai kesepakatan\n2. Kegunaan: untuk mengetahui kejelasan arsip dan dana PMV/C",
  },
  {
    no: 23,
    komponen: "Performa Seksi",
    item: "Bendahara",
    subItem: "Kegiatan Pencatatan Keuangan",
    indikator:
      "Melakukan kegiatan pencatatan keuangan, yang terdiri dari:\n1. Menyimpan Nota dan Bukti Pemasukan kas PMV/C (min. 5 periode terakhir)\n2. Menyimpan Nota atau Bukti Pengeluaran kas PMV/C (min. 5 periode terakhir)\n3. Menyimpan pembukuan PMV/C - arus kas masuk/keluar (min. 5 periode terakhir)",
    kondisi: [
      ["good", "Melakukan kegiatan pencatatan keuangan di atas sebanyak 3 item"],
      ["notGood", "Melakukan kegiatan pencatatan keuangan di atas sebanyak 1 - 2 item"],
      ["notExist", "Tidak ada melakukan kegiatan pencatatan keuangan di atas sama sekali"],
    ],
  },
  {
    no: 24,
    komponen: "Performa Seksi",
    item: "Bendahara",
    subItem: "Laporan Keuangan",
    indikator:
      "Menyusun Laporan Keuangan, yang terdiri dari:\n1. Laporan Keuangan per kuartal / 3 bulanan\n2. Laporan Keuangan akhir periode\n3. Laporan Keuangan kegiatan PMV/C yang sudah dilaksanakan",
    kondisi: [
      ["good", "Menyusun laporan di atas sebanyak 3 item"],
      ["notGood", "Menyusun laporan di atas sebanyak 1 - 2 item"],
      ["notExist", "Tidak menyusun laporan di atas sama sekali"],
    ],
  },
  {
    no: 25,
    komponen: "Performa Seksi",
    item: "Bendahara",
    subItem: "Iuran Anggota Sekber PMVBI",
    indikator:
      "Rutin membayar iuran anggota Sekber PMVBI (Pemuda Buddhayana) (**jika ada)",
    kondisi: [
      ["good", "Membayar iuran anggota minimal 6 bulan terakhir atau jika tidak ada penetapan iuran anggota di Setprov yang bersangkutan"],
      ["notGood", "Membayar iuran anggota minimal 6 bulan - 1 tahun terakhir"],
      ["notExist", "Tidak pernah membayar iuran anggota dalam 1 tahun terakhir"],
    ],
  },
  {
    no: 26,
    komponen: "Performa Seksi",
    item: "Seksi Pelayanan Dharma",
    subItem: "Puja bakti mingguan",
    indikator:
      "1. Selalu mengadakan puja bakti setiap minggu (selama 6 bulan berturut-turut)\n2. Setiap puja bakti berlangsung selama minimal 30 menit.",
    kondisi: [
      ["good", "Puja bakti diadakan setiap minggu secara rutin"],
      ["notGood", "Puja bakti tidak diadakan setiap minggu secara rutin, misalnya hanya 2 minggu sekali"],
      ["notExist", "Tidak pernah mengadakan puja bakti setiap minggu dalam 6 bulan terakhir."],
    ],
  },
  {
    no: 27,
    komponen: "Performa Seksi",
    item: "Seksi Pelayanan Dharma",
    subItem: "Tim pelayanan umat saat puja bakti",
    indikator:
      "Mempunyai pembagian tugas yang jelas kepada pengurus PMV/C saat puja bakti, misalnya siapa sebagai greeter, operator sound system, memberikan stempel kehadiran, dll",
    kondisi: [
      ["good", "Mempunyai pembagian tugas yang jelas"],
      ["notExist", "Tidak mempunyai pembagian tugas yang jelas"],
    ],
  },
  {
    no: 28,
    komponen: "Performa Seksi",
    item: "Seksi Pelayanan Dharma",
    subItem: "Dharmaduta saat puja bakti",
    indikator: "Menghadirkan Dharmaduta saat puja bakti setiap minggu",
    kondisi: [
      ["good", "Menghadirkan Dharmaduta saat puja bakti setiap minggu secara rutin"],
      ["notGood", "Menghadirkan Dharmaduta saat puja bakti 1-3 kali dalam sebulan"],
      ["notExist", "Tidak pernah menghadirkan Dharmaduta saat puja bakti"],
    ],
    penjelasan:
      "Dharmaduta adalah orang yang memberikan Dharmadesana, boleh dari biksu/biksuni Sangha, pandita, guru agama, PC MBI, internal PMV/C sendiri, atau lainnya",
  },
  {
    no: 29,
    komponen: "Performa Seksi",
    item: "Seksi Pelayanan Dharma",
    subItem: "Pembinaan spiritual untuk pengurus PMV/C",
    indikator:
      "Mengadakan/Mengikuti kegiatan pembinaan spiritual kepada pengurus PMV/C minimal 1 kali dalam 1 tahun terakhir",
    kondisi: [
      ["good", "Ada mengadakan/mengikuti 1 kali dalam 1 tahun terakhir"],
      ["notExist", "Tidak ada mengadakan/mengikuti 1 kali dalam 1 tahun terakhir"],
    ],
    penjelasan:
      "Kegiatan yang dimaksud meliputi:\n- Kelas meditasi/nianfo\n- Day of Mindfulness\n- Pelatihan Atthasila\n- Retret hidup berkesadaran\n- Diskusi/Kelas Dharma\n- Bina Widya\n\nKegiatan yang tidak termasuk meliputi:\n- Sesi dharmadesana saat puja bakti\n- Dharma Talk",
  },
  {
    no: 30,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Media Sosial",
    indikator: "Adanya akun media sosial",
    kondisi: [
      ["good", "Punya ≥ 2 akun media sosial lintas platform"],
      ["notGood", "Punya 1 akun media sosial lintas platform"],
      ["notExist", "Tidak punya akun media sosial sama sekali"],
    ],
    penjelasan:
      "Jika akun media sosial PMV/C masih digabung dengan akun vihara/cetiya, dapat dipertimbangkan agar membuat akun mandiri untuk PMV/C, karena kontennya lebih bebas disegmentasikan untuk muda/i.\n\nApabila ada kegiatan vihara/cetiya yang melibatkan PMV/C, setiap konten/postingan nantinya dapat dilakukan collaboration post antara akun vihara/cetiya dengan PMV/C. Tujuannya agar meningkatkan reach dari konten tersebut, karena melibatkan audience dari 2 akun.",
  },
  {
    no: 31,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Keaktifan Media Sosial",
    indikator: "Adanya konten/postingan kegiatan pada media sosial",
    kondisi: [
      ["good", "Ada konten/postingan kegiatan minimal seminggu sekali"],
      ["notGood", "Tidak ada konten/postingan khusus, tapi masih update story"],
      ["notExist", "Tidak ada konten/postingan sama sekali selama 3 bulan terakhir (tidak aktif)"],
    ],
  },
  {
    no: 32,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Username dan Nama Media Sosial",
    indikator:
      "Username dan Nama yang tercantum pada media sosial dapat mengidentifikasi PMV/C dengan jelas",
    kondisi: [
      ["good", "Nama PMV/C jelas ada pada username dan nama lengkap sesuai template"],
      ["notGood", "Nama PMV/C jelas, namun tidak sesuai template"],
      ["notExist", "Username dan nama media sosial tidak ada hubungannya dengan Nama PMV/C atau Vihara/Cetiya"],
    ],
    penjelasan:
      "TEMPLATE USERNAME IG/TikTok:\npm[v/c][singkatan nama vihara/cetiya]_[daerah]\ncontoh: pmvbd_pwk, pvvd_bandung, pmce_tt\n\nTEMPLATE NAMA LENGKAP:\nPM[V/C] [NAMA VIHARA/CETIYA] [DAERAH]\ncontoh: PMV Budi Dharma Purwakarta",
  },
  {
    no: 33,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Bio Media Sosial",
    indikator:
      "Bio pada media sosial dapat dengan jelas mengidentifikasi bahwa PMV/C merupakan bagian dari Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Mencantumkan akun Sekber PMVBI (Provinsi) pada bio"],
      ["notGood", "Mencantumkan akun/nama Sekber PMVBI (Pemuda Buddhayana) yang tidak resmi pada bio seperti: Pemuda Buddhayana Indonesia"],
      ["notExist", "Tidak mencantumkan akun Sekber PMVBI (Provinsi) pada bio"],
    ],
    penjelasan: "Template penulisan:\npart of @sekberpmvbiprovinsi/",
  },
  {
    no: 34,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Profile Picture Media Sosial",
    indikator: "Profile picture menggunakan logo PMV/C",
    kondisi: [
      ["good", "Media sosial PMV/C sudah menggunakan logo PMV/C nya sebagai profile picture"],
      ["notGood", "Media sosial PMV/C menggunakan foto lain sebagai profile picture, dan bukan logo PMV/C"],
      ["notExist", "Media sosial PMV/C tidak menggunakan profile picture sama sekali"],
    ],
  },
  {
    no: 35,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Penggunaan Tagar / Hashtag",
    indikator:
      "Menggunakan tagar/hashtag wajib Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Setiap konten/postingan pada media sosial menggunakan semua tagar/hashtag wajib Sekber PMVBI (Pemuda Buddhayana)"],
      ["notGood", "Setiap konten/postingan pada media sosial hanya menggunakan beberapa tagar/hashtag wajib Sekber PMVBI (Pemuda Buddhayana)"],
      ["notExist", "Konten/Postingan PMV/C tidak menggunakan tagar/hashtag wajib Sekber PMVBI (Pemuda Buddhayana) sama sekali"],
    ],
    penjelasan:
      "TAGAR / HASHTAG WAJIB Sekber PMVBI (Pemuda Buddhayana):\n\n#SekberPMVBI #PemudaBuddhayana #BuddhistYouth #KBI #KeluargaBuddhayanaIndonesia",
  },
  {
    no: 36,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Mengikuti Akun Sekber PMVBI (Pemuda Buddhayana)",
    indikator:
      "Akun PMV/C follow & subscribe seluruh akun Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Akun PMV/C sudah follow & subscribe seluruh akun media sosial Sekber PMVBI (Pemuda Buddhayana)"],
      ["notGood", "Akun PMV/C hanya follow & subscribe akun media sosial Sekber PMVBI (Pemuda Buddhayana) provinsinya"],
      ["notExist", "Akun PMV/C tidak follow & subscribe akun media sosial Sekber PMVBI (Pemuda Buddhayana) dan juga Sekber PMVBI (Pemuda Buddhayana) provinsinya sama sekali"],
    ],
    penjelasan: "@sekberpmvbi\n@sekberpmvbiprovinsi",
  },
  {
    no: 37,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Audience Care",
    indikator:
      "Membalas pesan (DM, WhatsApp), dan komentar di media sosial dengan baik dan tepat waktu",
    kondisi: [
      ["good", "PMV/C membalas pesan (DM, WhatsApp), dan komentar di media sosial dengan bahasa yang baik, dalam waktu kurang dari 1 hari"],
      ["notGood", "PMV/C membalas pesan (DM, WhatsApp), dan komentar di media sosial dengan bahasa yang baik, dalam kurun waktu 1-3 hari"],
      ["notExist", "PMV/C tidak membalas pesan (DM, WhatsApp), dan komentar di media sosial sama sekali"],
    ],
  },
  {
    no: 38,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Arsip Dokumentasi Kegiatan",
    indikator:
      "Mengarsip file dokumentasi kegiatan dalam Cloud/Drive/Hard disk/media penyimpanan lain yang dapat diakses oleh seluruh pengurus PMV/C",
    kondisi: [
      ["good", "PMV/C menyusun file dokumentasi kegiatan dengan rapi sesuai dengan waktu pelaksanaan, dan terus di-update secara berkala"],
      ["notGood", "PMV/C menyusun file dokumentasi kegiatan tersusun rapi sesuai dengan waktu pelaksanaan, namun tidak di-update secara berkala, sehingga ada beberapa dokumentasi yang hilang"],
      ["notExist", "PMV/C tidak menyusun dan menyimpan file dokumentasi kegiatan sama sekali"],
    ],
    penjelasan:
      "FORMAT PENYUSUNAN FILE YANG DISARANKAN\n\nFOLDER UTAMA: Tahun (contoh: 2025)\nSub-Folder: Bulan (contoh: 03 - Maret)\nFolder Inti kegiatan: Tanggal - Nama Kegiatan (contoh: 050325 - Makan Enak)",
  },
  {
    no: 39,
    komponen: "Performa Seksi",
    item: "Seksi Media Komunikasi",
    subItem: "Mading",
    indikator: "Ada mading (majalah dinding) di PMV/C",
    kondisi: [
      ["good", "PMV/C memiliki mading, dan informasi pada mading di-update secara berkala (per 3 bulan sekali)"],
      ["notGood", "PMV/C memiliki mading, namun informasi pada mading hanya di-update setahun sekali"],
      ["notExist", "PMV/C tidak memiliki mading sama sekali"],
    ],
    penjelasan:
      "REFERENSI KONTEN MADING\n\nKONTEN UTAMA: Biografi Vihara/Cetiya, Sejarah Kepengurusan PMV/C\nThematic Content: Hari Raya Agama Buddha",
  },
  {
    no: 40,
    komponen: "Performa Seksi",
    item: "Seksi Kemitraan",
    subItem: "Kegiatan Keakraban",
    indikator: "Mengadakan kegiatan keakraban sesama anggota PMV/C",
    kondisi: [
      ["good", "Kegiatan keakraban diadakan minimal dua bulan sekali"],
      ["notGood", "Kegiatan keakraban hanya dilakukan setahun sekali"],
      ["notExist", "Belum pernah melaksanakan kegiatan keakraban"],
    ],
    penjelasan:
      "Kegiatan keakraban tidak terbatas pada aktivitas di lingkungan Vihara/Cetiya, namun juga dapat dilakukan di luar kota. Beberapa contoh kegiatan keakraban: malam keakraban, olahraga bersama, rekreasi/outing, perayaan ulang tahun bersama, dll",
  },
  {
    no: 41,
    komponen: "Performa Seksi",
    item: "Seksi Kemitraan",
    subItem: "Kegiatan Gathering Pengurus Baru",
    indikator:
      "Mengadakan kegiatan gathering anggota baru PMV/C di awal periode",
    kondisi: [
      ["good", "Ada diadakan"],
      ["notExist", "Tidak ada diadakan"],
    ],
    penjelasan:
      "Kegiatan ini diadakan sebagai sarana untuk mengakrabkan anggota atau pengurus baru",
  },
  {
    no: 42,
    komponen: "Performa Seksi",
    item: "Seksi Kemitraan",
    subItem: "Kegiatan Sosial",
    indikator: "Menyelenggarakan kegiatan bakti sosial atau aksi sosial",
    kondisi: [
      ["good", "Kegiatan bakti sosial atau aksi sosial dilaksanakan lebih dari satu kali dalam setahun"],
      ["notGood", "Kegiatan bakti sosial atau aksi sosial dilaksanakan hanya satu kali dalam setahun"],
      ["notExist", "Tidak melaksanakan kegiatan bakti sosial atau aksi sosial secara rutin setiap tahun."],
    ],
    penjelasan:
      "Bakti Sosial (Baksos) merupakan kegiatan yang berfokus pada pengabdian kepada masyarakat dengan memberikan bantuan langsung. Contohnya: pembagian sembako, donor darah, dan layanan kesehatan gratis.\n\nAksi Sosial (Aksos) merupakan kegiatan sosial dengan cakupan yang lebih luas dan sering kali berupa ajakan atau kampanye kesadaran. Contohnya: gerakan bersih-bersih lingkungan, penggalangan dana untuk korban bencana alam atau kebutuhan pengobatan.",
  },
  {
    no: 43,
    komponen: "Performa Seksi",
    item: "Seksi Kemitraan",
    subItem: "Pendataan Perpindahan Domisili Anggota",
    indikator:
      "Terdapat pendataan perpindahan domisili anggota PMV/C (pindah daerah untuk kuliah/bekerja)",
    kondisi: [
      ["good", "Pendataan dilakukan secara rutin dan diperbarui secara berkala ketika terdapat perpindahan domisili anggota"],
      ["notGood", "Pendataan dilakukan hanya sekali dalam setahun, yaitu pada awal semester ganjil"],
      ["notExist", "Tidak pernah dilakukan pendataan perpindahan domisili anggota"],
    ],
    penjelasan:
      "Kegiatan pendataan perpindahan anggota dilakukan untuk memastikan keberlanjutan keaktifan anggota di tempat yang baru. Pendataan ini juga dapat dilakukan melalui kerja sama dengan Sekretaris.",
  },
  {
    no: 44,
    komponen: "Performa Seksi",
    item: "Seksi Kemitraan",
    subItem: "Pemberdayaan Kesenian",
    indikator: "Adanya pemberdayaan bakat kesenian di PMV/C",
    kondisi: [
      ["good", "Kegiatan pemberdayaan bakat kesenian dilaksanakan secara rutin setiap minggu/bulan"],
      ["notGood", "Kegiatan pemberdayaan bakat kesenian hanya dilakukan saat ada event atau acara tertentu"],
      ["notExist", "Tidak terdapat kegiatan pemberdayaan bakat kesenian."],
    ],
    penjelasan:
      "Kegiatan pemberdayaan bakat dan kesenian mencakup berbagai aktivitas seperti contohnya: tari tradisional, sulap, teater, dan sebagainya. Tujuan utama dari kegiatan ini adalah untuk memberdayakan serta meningkatkan minat dan bakat pemuda/i PMV/C.",
  },
  {
    no: 45,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Daftar Administrasi Adik-adik GABI",
    indikator:
      "1. Tersedia daftar administrasi adik-adik GABI\n2. Daftar tersebut diperbarui secara berkala.",
    kondisi: [
      ["good", "Adanya daftar administrasi yang tercatat dengan baik, serta data selalu diperbarui sesuai perkembangan adik-adik GABI"],
      ["notGood", "Data tidak diperbarui secara rutin atau masih banyak data lama yang belum diperbarui"],
      ["notExist", "Tidak ada daftar administrasi yang tercatat"],
    ],
  },
  {
    no: 46,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Sistem Absensi",
    indikator:
      "1. Melakukan absensi adik-adik GABI secara rutin\n2. Tercatat",
    kondisi: [
      ["good", "Absensi dilakukan setiap minggu/pertemuan dan tercatat dengan baik"],
      ["notGood", "Absensi dilakukan tetapi tidak selalu rutin atau dokumentasi kurang rapi"],
      ["notExist", "Tidak ada pencatatan absensi yang dilakukan"],
    ],
  },
  {
    no: 47,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Sistem Penghargaan",
    indikator: "Adanya sistem penghargaan untuk adik-adik GABI",
    kondisi: [
      ["good", "Penghargaan diberikan secara rutin dengan sistem yang jelas (misalnya, sertifikat, hadiah kecil, atau pengakuan)"],
      ["notGood", "Penghargaan ada tetapi tidak teratur atau kurang jelas mekanismenya"],
      ["notExist", "Tidak ada sistem penghargaan yang diterapkan."],
    ],
  },
  {
    no: 48,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Jadwal Materi Pengajaran",
    indikator:
      "Jadwal materi pengajaran (min. topik/tema) disusun minimal 6 bulan sebelumnya",
    kondisi: [
      ["good", "Jadwal sudah disusun minimal 6 bulan sebelumnya dan berjalan sesuai rencana."],
      ["notGood", "Jadwal ada tetapi sering berubah atau tidak selalu disusun 6 bulan sebelumnya, perlu perbaikan dalam perencanaan jadwal"],
      ["notExist", "Tidak ada jadwal kelas yang terstruktur atau hanya dibuat mendadak"],
    ],
  },
  {
    no: 49,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Jadwal Pembina",
    indikator: "Menyusun jadwal pembina minimal 1 bulan sebelumnya.",
    kondisi: [
      ["good", "Jadwal sudah disusun minimal 1 bulan sebelumnya dan berjalan sesuai rencana."],
      ["notGood", "Jadwal ada, tapi sering berubah atau tidak selalu disusun 1 bulan sebelumnya, perlu perbaikan dalam perencanaan jadwal"],
      ["notExist", "Tidak ada jadwal kelas yang terstruktur atau hanya dibuat mendadak"],
    ],
  },
  {
    no: 50,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Buku Panduan/Referensi",
    indikator:
      "1. Tersedia pustaka buku panduan/referensi dalam pengajaran kelas GABI\n2. Digunakan dalam pengajaran",
    kondisi: [
      ["good", "Buku panduan/referensi tersedia dengan lengkap, serta digunakan secara rutin oleh pembina dalam mengajar"],
      ["notGood", "Buku panduan/referensi ada tetapi kurang lengkap atau jarang digunakan dalam pengajaran"],
      ["notExist", "Tidak ada buku panduan/referensi yang digunakan."],
    ],
    penjelasan:
      "Buku panduan/referensi minimal dapat memakai Materi/Kurikulum SMB GABI yang dibagikan oleh DPP/DPD IPGABI Sekber PMVBI (Pemuda Buddhayana)",
  },
  {
    no: 51,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Briefing Pembina Sebelum Kelas",
    indikator: "Melakukan briefing pembina sebelum kelas dimulai",
    kondisi: [
      ["good", "Briefing dilakukan secara rutin sebelum kelas, ada koordinasi dan persiapan materi"],
      ["notGood", "Briefing ada tetapi tidak teratur atau hanya dilakukan sesekali"],
      ["notExist", "Tidak ada briefing sebelum kelas dimulai"],
    ],
  },
  {
    no: 52,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Evaluasi Setelah Kelas",
    indikator: "Melakukan evaluasi setelah kelas setiap minggu",
    kondisi: [
      ["good", "Evaluasi dilakukan secara rutin setiap minggu, ada pencatatan dan perbaikan untuk kelas berikutnya"],
      ["notGood", "Evaluasi dilakukan tetapi tidak teratur atau hanya sesekali"],
      ["notExist", "Tidak ada evaluasi setelah kelas"],
    ],
  },
  {
    no: 53,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Sesi Diskusi",
    indikator: "Ada sesi diskusi atau tanya jawab dalam kelas",
    kondisi: [
      ["good", "Sesi diskusi atau tanya jawab dilakukan secara rutin, adik-adik aktif berpartisipasi"],
      ["notGood", "Sesi diskusi atau tanya jawab ada tetapi kurang aktif atau hanya sesekali dilakukan"],
      ["notExist", "Tidak ada sesi diskusi atau tanya jawab dalam kelas"],
    ],
  },
  {
    no: 54,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Pendekatan ke Adik-adik",
    indikator:
      "Pembina menjalin hubungan baik dengan adik-adik di luar sesi kelas",
    kondisi: [
      ["good", "Pembina secara rutin berkomunikasi dan berinteraksi dengan adik-adik di luar kelas, baik secara langsung maupun melalui media lain"],
      ["notGood", "Pembina berinteraksi tetapi masih jarang atau tidak konsisten"],
      ["notExist", "Tidak ada interaksi pembina dengan adik-adik di luar kelas"],
    ],
  },
  {
    no: 55,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Pengajaran Materi Dharma",
    indikator: "Pembina memberikan materi Dharma dalam kelas",
    kondisi: [
      ["good", "Pembina secara rutin mengajarkan materi Dharma dalam setiap pertemuan"],
      ["notGood", "Materi Dharma diajarkan tetapi tidak teratur atau kurang mendalam"],
      ["notExist", "Tidak ada pengajaran materi Dharma dalam kelas"],
    ],
  },
  {
    no: 56,
    komponen: "Performa Seksi",
    item: "IPGABI Vihara/Cetiya",
    subItem: "Bimbingan Puja Bakti",
    indikator: "Pembina mendampingi dan membimbing adik-adik saat puja bakti",
    kondisi: [
      ["good", "Pembina secara rutin mendampingi dan membimbing adik-adik saat puja bakti"],
      ["notGood", "Pendampingan dan bimbingan puja bakti dilakukan tetapi masih kurang terstruktur atau tidak rutin"],
      ["notExist", "Tidak ada mendampingi dan membimbing adik-adik saat puja bakti"],
    ],
  },
  {
    no: 57,
    komponen: "Hubungan Eksternal",
    item: "Hubungan ke PMV/C Lain",
    subItem: "Komunikasi dan Kolaborasi antar PMV/C",
    indikator: "Menjalin komunikasi dan kolaborasi yang baik antar PMV/C",
    kondisi: [
      ["good", "Saling mengundang/mengunjungi/kolaborasi dengan PMV/C lain dalam melakukan suatu kegiatan"],
      ["notExist", "Tidak pernah mengundang/mengunjungi/kolaborasi dengan PMV/C lain dalam melakukan suatu kegiatan dalam 1 tahun terakhir"],
    ],
  },
  {
    no: 58,
    komponen: "Hubungan Eksternal",
    item: "Hubungan ke Sekber PMVBI",
    subItem: "Partisipasi kegiatan Sekber PMVBI",
    indikator: "Mengikuti kegiatan Sekber PMVBI (Pemuda Buddhayana)",
    kondisi: [
      ["good", "Selalu rutin mengikuti kegiatan Sekber PMVBI (Pemuda Buddhayana)"],
      ["notGood", "Jarang mengikuti kegiatan Sekber PMVBI (Pemuda Buddhayana), dimana hanya 1-2 kali dalam 1 tahun terakhir"],
      ["notExist", "Tidak pernah mengikuti kegiatan Sekber PMVBI (Pemuda Buddhayana) dalam 1 tahun terakhir"],
    ],
  },
  {
    no: 59,
    komponen: "Hubungan Eksternal",
    item: "Hubungan ke Organisasi KBI Lainnya",
    subItem: "Komunikasi dan Kolaborasi dengan Organisasi KBI Lainnya",
    indikator:
      "Menjalin komunikasi dan kolaborasi yang baik dengan organisasi KBI lainnya",
    kondisi: [
      ["good", "Berkolaborasi dengan organisasi KBI lainnya dalam melakukan kegiatan dalam 1 tahun terakhir"],
      ["notExist", "Tidak berkolaborasi dengan organisasi KBI lainnya dalam melakukan kegiatan dalam 1 tahun terakhir"],
    ],
  },
];

export type Group = {
  key: string;
  komponen: string;
  item: string;
  items: Item[];
};

export const GROUPS: Group[] = ITEMS.reduce<Group[]>((acc, it) => {
  const key = `${it.komponen}__${it.item}`;
  const last = acc[acc.length - 1];
  if (last && last.key === key) last.items.push(it);
  else acc.push({ key, komponen: it.komponen, item: it.item, items: [it] });
  return acc;
}, []);