import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Printer, Flower2, Layers } from 'lucide-react';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { title: 'Beranda', path: '/' },
    { title: 'Desain Siap Cetak', path: '/desain-siap-cetak' },
    { title: 'Kalkulasi Grafika', path: '/kalkulasi-grafika' },
    { title: 'Purna Cetak', path: '/purna-cetak' },
    { title: 'Manajemen Produksi', path: '/manajemen-produksi' },
    { title: 'Halaman 6', path: '/halaman-6' },
    { title: 'Halaman 7', path: '/halaman-7' },
    { title: 'Halaman 8', path: '/halaman-8' },
    { title: 'Halaman 9', path: '/halaman-9' },
    { title: 'Halaman 10', path: '/halaman-10' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-200">
                <Printer size={20} className="drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-900 leading-none tracking-tight">Teknik Grafika</h1>
                <p className="text-[10px] uppercase tracking-widest text-brand-600 font-bold mt-1">SMK Negeri 1 Kaligondang</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink 
                to="/"
                className={({ isActive }) => 
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200' 
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`
                }
              >
                Beranda
              </NavLink>
              
              {/* Dropdown for pages */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-50 flex items-center gap-1 transition-colors">
                  Materi Pembelajaran <BookOpen size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right bg-white border border-slate-100 divide-y divide-slate-50 rounded-xl shadow-xl shadow-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {navItems.slice(1).map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            isActive 
                              ? 'bg-brand-50 text-brand-700 font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                          }`
                        }
                      >
                        {item.title}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`lg:hidden fixed inset-x-0 top-[64px] bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          <nav className="p-4 space-y-1 max-h-[calc(100vh-64px)] overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 shadow-sm' 
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[70vh] relative">
           {/* Background Decorations for Container */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500"></div>
           {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                  <Layers size={16} />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Teknik Grafika</span>
                  <span className="text-xs text-slate-500">SMKN 1 Kaligondang</span>
               </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm font-medium text-slate-700">
                Dibuat oleh Risca Damayanti, M.Pd.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-2 mt-2">
                <span className="text-xs text-slate-400">© {new Date().getFullYear()}</span>
                <span className="h-3 w-px bg-slate-300"></span>
                <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">
                  <Flower2 size={10} />
                  <span>Supported by MWS AI Studio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;