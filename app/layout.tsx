import './index.css'; // Pastikan file index.css Anda ada di folder app/

export const metadata = {
  title: 'Daftar ',
  description: 'Seminar',
  icons: {
    icon: '/sekber_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}