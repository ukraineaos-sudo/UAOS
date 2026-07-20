import React, { useState } from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../data/siteSettings';

interface FooterProps {
  currentLang: 'uk' | 'en';
  onNavigate: (route: string) => void;
  siteSettings?: SiteSettings;
}

export default function Footer({ currentLang, onNavigate, siteSettings = DEFAULT_SITE_SETTINGS }: FooterProps) {
  const t = TRANSLATIONS[currentLang];
  const currentYear = new Date().getFullYear();
  const phone = siteSettings.phone || t.contact_phone;
  const email = siteSettings.email;
  const address = siteSettings.address[currentLang] || t.contact_address_val;

  const logoSrc = '/logos/logo.png';
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);

  const handleLinkClick = (id: string) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer id="contacts" className="scroll-mt-24 bg-brand-slate-900 text-brand-slate-300 border-t border-brand-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center text-white">
              {!useFallbackLogo ? (
                <img
                  src={logoSrc}
                  alt="UAOS — Ukraine Associated Occupation Safety"
                  className="h-24 sm:h-28 w-auto max-w-[320px] object-contain transition-all duration-200 invert mix-blend-screen"
                  referrerPolicy="no-referrer"
                  onError={() => setUseFallbackLogo(true)}
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-blue-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-display font-bold leading-tight">UAOS</span>
                    <span className="block text-[8px] font-mono tracking-widest text-brand-slate-400">UKRAINE ASSOCIATED</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-brand-slate-400 leading-relaxed font-sans">
              {currentLang === 'uk' 
                ? 'Громадська спілка «Українська Асоціація Професійної Безпеки» (UAOS). Об’єднуємо кращих постачальників, виробників та експертів для безпеки праці.'
                : 'Public Union "Ukrainian Association of Occupational Safety" (UAOS). Uniting the best suppliers, manufacturers, and experts for safety at work.'}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded font-mono text-[9px] font-bold bg-brand-slate-800 text-brand-blue-500 border border-brand-slate-700">
                {currentLang === 'uk' ? 'ГС «УАПБ» • ОФІЦІЙНИЙ САЙТ' : 'UAOS PU • OFFICIAL SITE'}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              {currentLang === 'uk' ? 'Навігація' : 'Navigation'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-white transition-colors duration-200 text-left">
                  {t.nav_about}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('directions')} className="hover:text-white transition-colors duration-200 text-left">
                  {t.nav_directions}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('founders')} className="hover:text-white transition-colors duration-200 text-left">
                  {t.nav_founders}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('members')} className="hover:text-white transition-colors duration-200 text-left">
                  {t.nav_members}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('documents')} className="hover:text-white transition-colors duration-200 text-left">
                  {t.nav_documents}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              {t.nav_contacts}
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-brand-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-brand-slate-400 text-[10px] uppercase font-mono">{t.contact_phone}</span>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors font-medium">{phone}</a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-brand-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-brand-slate-400 text-[10px] uppercase font-mono">{t.contact_email}</span>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors font-medium">{email}</a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-brand-slate-400 text-[10px] uppercase font-mono">{t.contact_address}</span>
                  <span className="leading-tight block text-brand-slate-300">{address}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Document Fast Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-display">
              {currentLang === 'uk' ? 'Швидкий доступ' : 'Quick Access'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLinkClick('join')} className="hover:text-white text-left text-brand-blue-500 font-semibold hover:underline">
                  {t.btn_become_member} →
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white text-left block">
                  {t.privacy_title}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-slate-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-slate-500">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} {t.brand_short} — {t.brand_logo_text}. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <span className="text-brand-slate-600 font-mono text-[10px]">
              v2.0 Working Prototype
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
