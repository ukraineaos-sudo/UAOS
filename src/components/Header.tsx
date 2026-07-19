import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe, Shield } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: 'uk' | 'en';
  setCurrentLang: (lang: 'uk' | 'en') => void;
  currentTheme: 'light' | 'dark';
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export default function Header({
  currentLang,
  setCurrentLang,
  currentTheme,
  setCurrentTheme,
  currentRoute,
  onNavigate
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const logoSrc = '/logos/logo.png';
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(nextTheme);
  };

  const navItems = [
    { id: 'about', label: t.nav_about },
    { id: 'members', label: t.nav_members },
    { id: 'directions', label: t.nav_directions },
    { id: 'founders', label: t.nav_founders },
    { id: 'join', label: t.nav_how_to_join },
    { id: 'contacts', label: t.nav_contacts }
  ];

  const handleNavItemClick = (itemId: string) => {
    setMobileMenuOpen(false);
    if (currentRoute !== 'home') {
      onNavigate('home');
      // Wait for page change then scroll
      setTimeout(() => {
        const el = document.getElementById(itemId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(itemId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-brand-slate-950/85 shadow-lg border-b border-brand-slate-200/50 dark:border-brand-slate-800/30 glass-header'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 min-h-24">
          
          {/* Logo — full wordmark from /logos/logo.png */}
          <button
            onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center group text-left cursor-pointer focus:outline-none shrink-0"
            aria-label="UAOS Home"
          >
            {!useFallbackLogo ? (
              <img
                src={logoSrc}
                alt="UAOS — Ukraine Associated Occupation Safety"
                className="w-[162px] h-[76px] object-contain object-left group-hover:opacity-90 transition-all duration-200 mix-blend-multiply dark:invert dark:mix-blend-screen"
                referrerPolicy="no-referrer"
                onError={() => setUseFallbackLogo(true)}
              />
            ) : (
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-brand-blue-500 dark:bg-brand-blue-600 text-white shadow-md shadow-brand-blue-500/20">
                <Shield className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-yellow-400"></span>
                </span>
              </div>
            )}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-brand-slate-600 dark:text-brand-slate-300 hover:text-brand-blue-500 dark:hover:text-brand-sky-300 hover:bg-brand-slate-100/50 dark:hover:bg-brand-slate-800/40 transition-all duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Admin link */}
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-200 cursor-pointer ${
                currentRoute === 'admin'
                  ? 'border-brand-blue-500 text-brand-blue-500 bg-brand-blue-50/50 dark:bg-brand-blue-950/20'
                  : 'border-brand-slate-200 dark:border-brand-slate-800 text-brand-slate-500 dark:text-brand-slate-400 hover:border-brand-blue-500'
              }`}
            >
              ADMIN
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setCurrentLang(currentLang === 'uk' ? 'en' : 'uk')}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100/50 dark:hover:bg-brand-slate-800/40 transition-all duration-200 cursor-pointer"
              title="Switch language"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4 text-brand-slate-400" />
              <span className="uppercase font-mono text-xs">{currentLang === 'uk' ? 'EN' : 'UA'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100/50 dark:hover:bg-brand-slate-800/40 transition-all duration-200 cursor-pointer"
              title={currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              aria-label="Toggle theme"
            >
              {currentTheme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-brand-yellow-400" />}
            </button>

            {/* Become Member Button */}
            <button
              onClick={() => handleNavItemClick('join')}
              className="ml-2 px-5 py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 active:bg-brand-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg shadow-brand-blue-500/15 hover:shadow-brand-blue-500/25 transition-all duration-250 cursor-pointer"
            >
              {t.btn_become_member}
            </button>
          </div>

          {/* Mobile Menu Action */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Quick Lang Switch */}
            <button
              onClick={() => setCurrentLang(currentLang === 'uk' ? 'en' : 'uk')}
              className="p-2 rounded-lg text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-slate-800"
              aria-label="Switch language"
            >
              <span className="uppercase font-mono text-xs font-semibold">{currentLang === 'uk' ? 'EN' : 'UA'}</span>
            </button>

            {/* Quick Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-slate-800"
              aria-label="Toggle theme"
            >
              {currentTheme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-brand-yellow-400" />}
            </button>

            {/* Burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-slate-800 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-fade-in border-b border-brand-slate-200 dark:border-brand-slate-800 bg-white dark:bg-brand-slate-950 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-brand-slate-700 dark:text-brand-slate-200 hover:bg-brand-slate-100 dark:hover:bg-brand-slate-900 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-brand-slate-100 dark:border-brand-slate-800/80 flex flex-col space-y-3 px-4">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }}
                className="w-full py-2.5 rounded-xl border border-brand-slate-300 dark:border-brand-slate-700 text-center font-mono text-sm text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-50 dark:hover:bg-brand-slate-900"
              >
                {currentLang === 'uk' ? 'ПАНЕЛЬ АДМІНІСТРАТОРА' : 'ADMIN PANEL'}
              </button>
              
              <button
                onClick={() => handleNavItemClick('join')}
                className="w-full py-3 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 active:bg-brand-blue-700 text-white font-medium text-sm text-center shadow-md shadow-brand-blue-500/15"
              >
                {t.btn_become_member}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
