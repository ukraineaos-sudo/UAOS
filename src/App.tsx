import React, {useState, useEffect, useRef} from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import MissionBenefitsSection from './components/MissionBenefitsSection'
import DirectionsSection from './components/DirectionsSection'
import FoundersSection from './components/FoundersSection'
import DocumentsSection from './components/DocumentsSection'
import MembersCarousel from './components/MembersCarousel'
import MemberProfile from './components/MemberProfile'
import JoinSection from './components/JoinSection'
import PrivacyPage from './components/PrivacyPage'
import NewsSection from './components/NewsSection'
import EventsCalendarModal from './components/events/EventsCalendarModal'
import CookieBanner from './components/CookieBanner'
import AnalyticsGate from './components/AnalyticsGate'
import {
  getCookieConsent,
  setCookieConsent,
  clearCookieConsent,
  type CookieConsentValue,
} from './lib/cookieConsent'

import {fetchMembers} from './data/members'
import {fetchDocuments} from './data/documents'
import {fetchEvents} from './data/events'
import {fetchNews, type NewsItem} from './data/news'
import {fetchSiteSettings, type SiteSettings, DEFAULT_SITE_SETTINGS} from './data/siteSettings'
import {AssociationMember, DocumentItem, AssociationEvent} from './types'

export default function App() {
  const [currentLang, setCurrentLang] = useState<'uk' | 'en'>(() => {
    const saved = localStorage.getItem('uaos_lang')
    return saved === 'uk' || saved === 'en' ? saved : 'uk'
  })

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('uaos_theme')
    if (saved === 'light' || saved === 'dark') return saved
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return systemPrefersDark ? 'dark' : 'light'
  })

  const [currentRoute, setCurrentRoute] = useState<string>('home')
  const [activeMemberSlug, setActiveMemberSlug] = useState<string | null>(null)
  const wasOnMemberProfileRef = useRef<boolean>(false)

  const [members, setMembers] = useState<AssociationMember[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [events, setEvents] = useState<AssociationEvent[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [contentLoading, setContentLoading] = useState(true)

  const [eventsModalOpen, setEventsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentValue>(() => getCookieConsent())

  const handleCookieAccept = () => {
    setCookieConsent('accepted')
    setCookieConsentState('accepted')
  }

  const handleCookieNecessaryOnly = () => {
    setCookieConsent('necessary')
    setCookieConsentState('necessary')
  }

  const handleResetCookieConsent = () => {
    clearCookieConsent()
    setCookieConsentState(null)
  }

  useEffect(() => {
    if (currentRoute === 'member-details') {
      wasOnMemberProfileRef.current = true
    } else if (currentRoute === 'home') {
      if (wasOnMemberProfileRef.current) {
        wasOnMemberProfileRef.current = false
        setTimeout(() => {
          const el = window.document.getElementById('members')
          if (el) el.scrollIntoView({behavior: 'smooth', block: 'center'})
        }, 150)
      }
    } else {
      wasOnMemberProfileRef.current = false
    }
  }, [currentRoute])

  useEffect(() => {
    localStorage.setItem('uaos_lang', currentLang)
    window.document.documentElement.lang = currentLang
  }, [currentLang])

  useEffect(() => {
    const root = window.document.documentElement
    if (currentTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('uaos_theme', currentTheme)
  }, [currentTheme])

  const refreshContentData = async () => {
    setContentLoading(true)
    try {
      const [m, d, e, n, s] = await Promise.all([
        fetchMembers(),
        fetchDocuments(),
        fetchEvents(),
        fetchNews(),
        fetchSiteSettings(),
      ])
      setMembers(m)
      setDocuments(d)
      setEvents(e)
      setNews(n)
      setSiteSettings(s)
    } finally {
      setContentLoading(false)
    }
  }

  useEffect(() => {
    refreshContentData()

    const url = new URL(window.location.href)
    const eventIdParam = url.searchParams.get('event')
    const eventsOpenParam = url.searchParams.get('events')
    if (eventIdParam) {
      setEventsModalOpen(true)
      setSelectedEventId(eventIdParam)
    } else if (eventsOpenParam === 'open') {
      setEventsModalOpen(true)
    }

    const handlePopState = () => {
      const hash = window.location.hash
      if (hash.startsWith('#/members/')) {
        const slug = hash.replace('#/members/', '')
        setActiveMemberSlug(slug)
        setCurrentRoute('member-details')
      } else if (hash === '#/admin') {
        // Админка временно отключена (редактирование — только через Sanity Studio).
        window.location.hash = ''
        setCurrentRoute('home')
      } else if (hash === '#/privacy') {
        setCurrentRoute('privacy')
      } else {
        setCurrentRoute('home')
        setActiveMemberSlug(null)
      }
    }

    handlePopState()
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [])

  const safePushState = (data: any, unused: string, url?: string | null) => {
    try {
      window.history.pushState(data, unused, url)
    } catch (e) {
      console.warn('History pushState is not supported or restricted:', e)
    }
  }

  const openEventsCalendar = (eventId?: string) => {
    setEventsModalOpen(true)
    if (eventId) {
      setSelectedEventId(eventId)
      const url = new URL(window.location.href)
      url.searchParams.set('event', eventId)
      safePushState(null, '', url.toString())
    } else {
      setSelectedEventId(null)
      const url = new URL(window.location.href)
      url.searchParams.set('events', 'open')
      safePushState(null, '', url.toString())
    }
  }

  const closeEventsCalendar = () => {
    setEventsModalOpen(false)
    setSelectedEventId(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('event')
    url.searchParams.delete('events')
    safePushState(null, '', url.toString())
  }

  const handleNavigation = (route: string, options?: {skipScrollToTop?: boolean}) => {
    setCurrentRoute(route)
    if (route === 'home') {
      setActiveMemberSlug(null)
      const url = new URL(window.location.href)
      url.search = ''
      url.hash = ''
      safePushState(null, '', url.toString())
      if (!options?.skipScrollToTop) {
        window.scrollTo({top: 0, behavior: 'smooth'})
      }
    } else if (route === 'admin') {
      // Админка временно отключена.
      handleNavigation('home', options)
    } else if (route === 'privacy') {
      const url = new URL(window.location.href)
      url.hash = '#/privacy'
      safePushState(null, '', url.toString())
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  const handleSelectMember = (slug: string) => {
    setActiveMemberSlug(slug)
    setCurrentRoute('member-details')
    const url = new URL(window.location.href)
    url.hash = `#/members/${slug}`
    safePushState(null, '', url.toString())
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const activeMember = members.find((m) => m.slug === activeMemberSlug)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060810] text-brand-slate-900 dark:text-brand-slate-100 transition-colors duration-500 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] rounded-full bg-brand-blue-500/10 dark:bg-brand-blue-500/12 blur-[80px] sm:blur-[130px] transition-all duration-1000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] sm:w-[650px] sm:h-[650px] rounded-full bg-indigo-500/10 dark:bg-purple-600/12 blur-[80px] sm:blur-[130px] transition-all duration-1000" />
        <div className="absolute top-[35%] left-[40%] -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-blue-400/5 dark:bg-blue-600/5 blur-[90px] sm:blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Header
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          currentRoute={currentRoute}
          onNavigate={handleNavigation}
        />

        <main className="flex-grow">
          {contentLoading && currentRoute === 'home' && (
            <div className="pt-28 pb-4 text-center">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-brand-slate-500">
                <span className="h-3 w-3 rounded-full border-2 border-brand-blue-500/30 border-t-brand-blue-500 animate-spin" />
                Loading content…
              </span>
            </div>
          )}

          {currentRoute === 'home' ? (
            <>
              <HeroSection
                currentLang={currentLang}
                onNavigate={handleNavigation}
                events={events}
                onOpenEvents={openEventsCalendar}
              />
              <MissionBenefitsSection currentLang={currentLang} />
              <MembersCarousel
                currentLang={currentLang}
                members={members}
                onSelectMember={handleSelectMember}
              />
              <NewsSection currentLang={currentLang} news={news} />
              <DirectionsSection currentLang={currentLang} />
              <FoundersSection currentLang={currentLang} />
              <DocumentsSection currentLang={currentLang} documents={documents} />
              <JoinSection currentLang={currentLang} />
            </>
          ) : currentRoute === 'member-details' && activeMember ? (
            <MemberProfile
              currentLang={currentLang}
              member={activeMember}
              onBack={() => handleNavigation('home', {skipScrollToTop: true})}
            />
          ) : currentRoute === 'privacy' ? (
            <PrivacyPage currentLang={currentLang} onBack={() => handleNavigation('home')} />
          ) : (
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

        <Footer
          currentLang={currentLang}
          onNavigate={handleNavigation}
          siteSettings={siteSettings}
          onResetCookieConsent={handleResetCookieConsent}
        />

        <EventsCalendarModal
          open={eventsModalOpen}
          events={events}
          selectedEventId={selectedEventId}
          currentLang={currentLang}
          onSelectEvent={setSelectedEventId}
          onClose={closeEventsCalendar}
        />

        {cookieConsent === null && (
          <CookieBanner
            currentLang={currentLang}
            onAccept={handleCookieAccept}
            onNecessaryOnly={handleCookieNecessaryOnly}
            onOpenPrivacy={() => handleNavigation('privacy')}
          />
        )}

        <AnalyticsGate consent={cookieConsent} />
      </div>
    </div>
  )
}
