export interface Member {
  id: string
  name: string
  role: string
  division: string
  nim?: string
  photo?: string // opsional, kalau kosong akan pakai inisial
}

export const DIVISIONS = ['Semua', 'Pengurus Inti', 'Humas', 'Acara', 'Media'] as const

export const MEMBERS: Member[] = [
  { id: '1', name: 'Frederick Liko',   role: 'Ketua Umum',   division: 'Pengurus Inti', nim: '2101001' },
  { id: '2', name: 'Ayu Pratiwi',      role: 'Wakil Ketua',  division: 'Pengurus Inti', nim: '2101002' },
  { id: '3', name: 'Bagas Nugroho',    role: 'Sekretaris',   division: 'Pengurus Inti', nim: '2101003' },
  { id: '4', name: 'Citra Lestari',    role: 'Bendahara',    division: 'Pengurus Inti', nim: '2101004' },
  { id: '5', name: 'Dimas Saputra',    role: 'Koordinator',  division: 'Humas',         nim: '2101005' },
  { id: '6', name: 'Eka Wulandari',    role: 'Anggota',      division: 'Humas',         nim: '2101006' },
  { id: '7', name: 'Fajar Ramadhan',   role: 'Koordinator',  division: 'Acara',         nim: '2101007' },
  { id: '8', name: 'Gita Maharani',    role: 'Anggota',      division: 'Acara',         nim: '2101008' },
  { id: '9', name: 'Hendra Wijaya',    role: 'Koordinator',  division: 'Media',         nim: '2101009' },
  { id: '10', name: 'Indah Permata',   role: 'Anggota',      division: 'Media',         nim: '2101010' },
]