import React, { useState } from 'react';
import { Shield, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { AssociationEvent } from '../types';
import UpcomingEventsPanel from './events/UpcomingEventsPanel';

interface HeroSectionProps {
  currentLang: 'uk' | 'en';
  onNavigate: (route: string) => void;
  events: AssociationEvent[];
  onOpenEvents: (eventId?: string) => void;
}

export default function HeroSection({ currentLang, onNavigate, events, onOpenEvents }: HeroSectionProps) {
  const t = TRANSLATIONS[currentLang];
  const [imageError, setImageError] = useState(false);

  const handleCtaClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20 bg-transparent transition-colors duration-300">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
      
      {/* Decorative gradient glowing spheres */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-blue-500/10 dark:bg-brand-blue-500/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-yellow-400/10 dark:bg-brand-yellow-400/5 blur-3xl pointer-events-none"></div>
 
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Animated Overline */}
            <div className="inline-flex items-center space-x-2 bg-brand-blue-50 dark:bg-brand-blue-950/40 border border-brand-blue-100 dark:border-brand-blue-900/40 px-3 py-1.5 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-blue-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-blue-600 dark:text-brand-sky-300">
                {t.brand_overline} • {t.brand_short}
              </span>
            </div>
 
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-brand-slate-900 dark:text-white leading-tight">
              {t.hero_headline}
            </h1>
 
            {/* Description */}
            <p className="text-base sm:text-lg text-brand-slate-600 dark:text-brand-slate-300 max-w-xl leading-relaxed">
              {t.hero_description}
            </p>
 
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleCtaClick('join')}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 active:bg-brand-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg shadow-brand-blue-500/20 transition-all duration-200 cursor-pointer"
              >
                <span>{t.btn_become_member}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => handleCtaClick('members')}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white dark:bg-brand-slate-900 border border-brand-slate-200 dark:border-brand-slate-800 hover:border-brand-blue-500 dark:hover:border-brand-sky-300 text-brand-slate-700 dark:text-brand-slate-200 font-medium text-sm transition-all duration-200 cursor-pointer"
              >
                <span>{t.btn_all_members}</span>
              </button>
            </div>
            
            {/* Upcoming Events Panel */}
            <UpcomingEventsPanel 
              events={events} 
              currentLang={currentLang} 
              onOpenEvents={onOpenEvents} 
            />
 
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-3xl border border-brand-slate-200/50 dark:border-brand-slate-800/30 scale-95 pointer-events-none"></div>

              {/* Graphic container */}
              <div className="relative rounded-2xl glass-card pt-6 pb-6 pl-[19px] pr-[19px] ml-0 mr-[-101px] mb-[60px] w-[589.333px] max-w-full shadow-xl overflow-hidden group">
                <div className="rounded-xl bg-brand-slate-100 dark:bg-brand-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-brand-slate-200/50 dark:border-brand-slate-800/20">
                  
                  {/* Try to load the user's uploaded award photo */}
                  {!imageError ? (
                    <img 
                      src="/leader_award.jpg" 
                      alt="UAOS Association Members"
                      className="w-full h-auto max-h-[480px] pl-0 pt-0 ml-0 pb-0 object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        // If image fails to load, trigger fallback
                        setImageError(true);
                      }}
                    />
                  ) : (
                    /* High-fidelity CSS certificate fallback */
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-brand-slate-900 via-brand-slate-850 to-brand-slate-900 p-6 flex flex-col justify-between text-white select-none">
                      <div className="absolute inset-0 bg-grid-pattern opacity-15"></div>
                      
                      {/* Glowing golden light */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-brand-yellow-400/10 blur-3xl"></div>
                      <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-brand-blue-500/10 blur-3xl"></div>

                      {/* Top Header */}
                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[9px] font-mono text-brand-slate-400 tracking-widest">UAOS LEADERSHIP 2026</span>
                        <Shield className="w-5 h-5 text-brand-yellow-400" />
                      </div>

                      {/* Certificate Body */}
                      <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 relative z-10 text-center my-auto space-y-3 shadow-2xl">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brand-yellow-400 font-bold">ПОЧЕСНА НАГОРОДА</span>
                        
                        <div className="space-y-1">
                          <h3 className="text-xl font-display font-black tracking-tight text-white leading-none">ДИПЛОМ</h3>
                          <p className="text-[10px] text-brand-slate-400 italic">нагороджується</p>
                        </div>

                        <div className="py-2 border-y border-white/10 bg-white/2">
                          <p className="text-xs font-bold text-brand-yellow-300 uppercase tracking-wide">ТОВ «ІНСАЙТ УА»</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-white tracking-wide">ЛІДЕР РОКУ</p>
                          <p className="text-[9px] text-brand-slate-400 leading-normal max-w-[200px] mx-auto">
                            Найкраще підприємство з впровадження системи управління ризиками в умовах воєнного стану
                          </p>
                        </div>
                      </div>

                      {/* Bottom Status */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-brand-slate-400 relative z-10 pt-2 border-t border-white/5">
                        <span>STATUS: CONFIRMED</span>
                        <span>KIEV, UKRAINE</span>
                      </div>
                    </div>
                  )}
                  
                </div>

                {/* Micro info panel overlay */}
                <div className="mt-4 flex items-center justify-between text-xs text-brand-slate-500 dark:text-brand-slate-400 pt-2 border-t border-brand-slate-100 dark:border-brand-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-brand-yellow-400 animate-ping"></span>
                    <span className="font-bold text-[20px] leading-[20px] font-sans not-italic text-brand-slate-700 dark:text-brand-slate-300">
                      {currentLang === 'uk' ? 'Наші учасники' : 'Our members'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px]">
                    UAOS COMMUNITY
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
