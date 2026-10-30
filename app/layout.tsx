import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Angoepo Rewards — Assista, participe, partilhe e ganhe recompensas em Kwanza',
  description:
    'Plataforma profissional de recompensas digitais em Kwanza (AOA) para Angola. Ganhe Kz assistindo a vídeos, ouvindo músicas licenciadas, partilhando conteúdos e levantando via Multicaixa Express.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Angoepo Rewards — Ganhe recompensas em Kwanza',
    description:
      'Assista a vídeos, ouça músicas angolanas, complete tarefas diárias e solicite levantamentos rápidos via Multicaixa Express.',
    type: 'website',
    locale: 'pt_AO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Angoepo Rewards — Ganhe recompensas em Kwanza',
    description:
      'Plataforma oficial de recompensas digitais em Angola com levantamentos Multicaixa Express.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1329',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
