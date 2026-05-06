import type { Metadata } from "next";
import './globals.css';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { TxProvider } from './context/TxContext';
import TxModal from './components/TxModal';
import Toast from './components/Toast';

export const metadata: Metadata = {
  title: "Finances - Dashboard",
  description: "Aplicação de gestão financeira",
};

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        <TxProvider>
          <Sidebar />
          <div className="main">
            <Topbar />
            {children}
          </div>
          <TxModal />
          <Toast />
        </TxProvider>
      </body>
    </html>
  );
}
