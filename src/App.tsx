import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MissionBenefitsSection from './components/MissionBenefitsSection';
import DirectionsSection from './components/DirectionsSection';
import FoundersSection from './components/FoundersSection';
import DocumentsSection from './components/DocumentsSection';
import MembersCarousel from './components/MembersCarousel';
import MemberProfile from './components/MemberProfile';
import JoinSection from './components/JoinSection';
import AdminPanel from './components/AdminPanel';
import PrivacyPage from './components/PrivacyPage';
import EventsCalendarModal from './components/events/EventsCalendarModal';

import { getMembers } from './data/members';
import { getDocuments } from './data/documents';
import { getEvents } from './data/events';
import { AssociationMember, DocumentItem, AssociationEvent } from './types';

export default function App() {
  // 1. Language State
  const [currentLang, setCurrentLang] = useState<'uk' | 'en'>(() => {
    const saved = localStorage.getItem('uaos_lang');
    return (saved === 'uk' || saved === 'en') ? saved : 'uk';
  });

  // 2. Theme State
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('uaos_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // 3. Routing States
  // 'home' | 'admin' | 'privacy' | 'member-details'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeMemberSlug, setActiveMemberSlug] = useState<string | null>(null);

  // 3.5 Ref to track if we just came from a member profile page
  const wasOnMemberProfileRef = useRef<boolean>(false);

  useEffect(() => {
    if (currentRoute === 'member-details') {
      wasOnMemberProfileRef.current = true;
    } else if (currentRoute === 'home') {
      if (wasOnMemberProfileRef.current) {
        wasOnMemberProfileRef.current = false;
        // Scroll to members section with a small timeout to ensure the layout has rendered
        setTimeout(() => {
          const el = window.document.getElementById('members');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    } else {
      wasOnMemberProfileRef.current = false;
    }
  }, [currentRoute]);

  // 4. Shared Dynamic Data (Members & Docs loaded from localStorage/defaults)
  const [members, setMembers] = useState<AssociationMember[]>(() => getMembers());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => getDocuments());
  const [events, setEvents] = useState<AssociationEvent[]>(() => getEvents());

  // 5. Events Calendar State
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Sync Language
  useEffect(() => {
    localStorage.setItem('uaos_lang', currentLang);
    window.document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Sync Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('uaos_theme', currentTheme);
  }, [currentTheme]);

  // Load and refresh content database
  const refreshContentData = () => {
    setMembers(getMembers());
    setDocuments(getDocuments());
    setEvents(getEvents());
  };

  const safePushState = (data: any, unused: string, url?: string | null) => {
    try {
      window.history.pushState(data, unused, url);
    } catch (e) {
      console.warn('History pushState is not supported or restricted:', e);
    }
  };

  const openEventsCalendar = (eventId?: string) => {
    setEventsModalOpen(true);
    if (eventId) {
      setSelectedEventId(eventId);
      const url = new URL(window.location.href);
      url.searchParams.set('event', eventId);
      safePushState(null, '', url.toString());
    } else {
      setSelectedEventId(null);
      const url = new URL(window.location.href);
      url.searchParams.set('events', 'open');
      safePushState(null, '', url.toString());
    }
  };

  const closeEventsCalendar = () => {
    setEventsModalOpen(false);
    setSelectedEventId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('event');
    url.searchParams.delete('events');
    safePushState(null, '', url.toString());
  };

  useEffect(() => {
    refreshContentData();
    
    // Check search params on load
    const url = new URL(window.location.href);
    const eventIdParam = url.searchParams.get('event');
    const eventsOpenParam = url.searchParams.get('events');
    if (eventIdParam) {
      setEventsModalOpen(true);
      setSelectedEventId(eventIdParam);
    } else if (eventsOpenParam === 'open') {
      setEventsModalOpen(true);
    }
    
    // Simple path routing listener for direct route handling (e.g. back buttons)
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/members/')) {
        const slug = hash.replace('#/members/', '');
        setActiveMemberSlug(slug);
        setCurrentRoute('member-details');
      } else if (hash === '#/admin') {
        setCurrentRoute('admin');
      } else if (hash === '#/privacy') {
        setCurrentRoute('privacy');
      } else {
        setCurrentRoute('home');
        setActiveMemberSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync window hash for clean url-based navigation
  const handleNavigation = (route: string, options?: { skipScrollToTop?: boolean }) => {
    setCurrentRoute(route);
    if (route === 'home') {
      setActiveMemberSlug(null);
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      safePushState(null, '', url.toString());
      if (!options?.skipScrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'admin') {
      const url = new URL(window.location.href);
      url.hash = '#/admin';
      safePushState(null, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'privacy') {
      const url = new URL(window.location.href);
      url.hash = '#/privacy';
      safePushState(null, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectMember = (slug: string) => {
    setActiveMemberSlug(slug);
    setCurrentRoute('member-details');
    const url = new URL(window.location.href);
    url.hash = `#/members/${slug}`;
    safePushState(null, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active member
  const activeMember = members.find(m => m.slug === activeMemberSlug);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060810] text-brand-slate-900 dark:text-brand-slate-100 transition-colors duration-500 relative">
      
      {/* Dynamic Background Glassmorphic Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-left Blue neon glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] rounded-full bg-brand-blue-500/10 dark:bg-brand-blue-500/12 blur-[80px] sm:blur-[130px] transition-all duration-1000"></div>
        {/* Bottom-right Purple/Indigo neon glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] rounded-full bg-indigo-500/10 dark:bg-purple-600/12 blur-[80px] sm:blur-[130px] transition-all duration-1000"></div>
        {/* Center Accent neon glow */}
        <div className="absolute top-[35%] left-[40%] -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-blue-400/5 dark:bg-blue-600/5 blur-[90px] sm:blur-[120px] pointer-events-none"></div>
      </div>

      {/* Content wrapper with relative position to stack above background gradients */}
      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* 1. Universal Responsive Header */}
        <Header
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          currentRoute={currentRoute}
          onNavigate={handleNavigation}
        />

        {/* 2. Main content router */}
        <main className="flex-grow">
          {currentRoute === 'home' ? (
            <>
              {/* Landing screen */}
              <HeroSection 
                currentLang={currentLang} 
                onNavigate={handleNavigation}
                events={events}
                onOpenEvents={openEventsCalendar} 
              />
              
              {/* Core Mission statement & Practical value combined */}
              <MissionBenefitsSection currentLang={currentLang} />
              
              {/* Interactive horizontal carousel */}
              <MembersCarousel
                currentLang={currentLang}
                members={members}
                onSelectMember={handleSelectMember}
              />
              
              {/* Action goals of public union */}
              <DirectionsSection currentLang={currentLang} />
              
              {/* Founders ESOSH & Journal */}
              <FoundersSection currentLang={currentLang} />
              
              {/* Membership submission onboarding card */}
              <JoinSection currentLang={currentLang} />
            </>
          ) : currentRoute === 'member-details' && activeMember ? (
            /* Profile details deep view */
            <MemberProfile
              currentLang={currentLang}
              member={activeMember}
              onBack={() => handleNavigation('home', { skipScrollToTop: true })}
            />
          ) : currentRoute === 'admin' ? (
            /* Secure Administration console */
            <AdminPanel
              currentLang={currentLang}
              onNavigate={handleNavigation}
              onRefreshData={refreshContentData}
            />
          ) : currentRoute === 'privacy' ? (
            /* Privacy disclosure */
            <PrivacyPage
              currentLang={currentLang}
              onBack={() => handleNavigation('home')}
            />
          ) : (
            /* 404 Fallback */
            <div className="py-32 text-center space-y-4">
              <h2 className="text-2xl font-bold font-display">Page Not Found</h2>
              <button
                onClick={() => handleNavigation('home')}
                className="px-5 py-2 rounded-xl bg-brand-blue-500 text-white font-semibold text-xs"
              >
                Back to Home
              </button>
            </div>
          )}
        </main>

        {/* 3. Global styled Footer */}
        <Footer currentLang={currentLang} onNavigate={handleNavigation} />

        {/* Global Events Modal */}
        <EventsCalendarModal
          open={eventsModalOpen}
          events={events}
          selectedEventId={selectedEventId}
          currentLang={currentLang}
          onSelectEvent={setSelectedEventId}
          onClose={closeEventsCalendar}
        />
      </div>
    </div>
  );
}
