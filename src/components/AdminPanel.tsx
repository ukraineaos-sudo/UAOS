import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Check, X, Shield, Plus, Edit, Trash, ToggleLeft, ToggleRight, RotateCcw, AlertTriangle, FileText, Mail, Eye, Save, Calendar as CalendarIcon } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { AssociationMember, JoinRequest, ContactMessage, DocumentItem, MemberProfileLevel, AssociationEvent } from '../types';
import { getMembers, saveMembers, resetMembers } from '../data/members';
import { getDocuments, saveDocuments } from '../data/documents';
import { getEvents, saveEvents } from '../data/events';
import { isPastEvent } from '../utils/eventDate';
import { getJoinRequests, saveJoinRequests, getContactMessages, saveContactMessages, updateJoinRequestStatus, updateContactMessageStatus, deleteJoinRequest, deleteContactMessage } from '../data/submissions';

interface AdminPanelProps {
  currentLang: 'uk' | 'en';
  onNavigate: (route: string) => void;
  onRefreshData: () => void;
}

export default function AdminPanel({ currentLang, onNavigate, onRefreshData }: AdminPanelProps) {
  const t = TRANSLATIONS[currentLang];

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab States
  const [activeTab, setActiveTab] = useState<'members' | 'applications' | 'messages' | 'documents' | 'events'>('members');

  // Data States
  const [membersList, setMembersList] = useState<AssociationMember[]>([]);
  const [documentsList, setDocumentsList] = useState<DocumentItem[]>([]);
  const [appsList, setAppsList] = useState<JoinRequest[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [eventsList, setEventsList] = useState<AssociationEvent[]>([]);

  // Editing States
  const [editingMember, setEditingMember] = useState<AssociationMember | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<AssociationEvent | null>(null);

  // Load and sync data
  const refreshAllData = () => {
    setMembersList(getMembers().sort((a, b) => a.order - b.order));
    setDocumentsList(getDocuments());
    setAppsList(getJoinRequests());
    setMessagesList(getContactMessages());
    setEventsList(getEvents());
    onRefreshData();
  };

  useEffect(() => {
    // Check if previously authenticated in current session
    const authStatus = sessionStorage.getItem('uaos_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    refreshAllData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('uaos_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError(t.admin_invalid_credentials);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('uaos_admin_auth');
  };

  // MEMBERS CONTROLS
  const handleTogglePublish = (id: string) => {
    const updated = membersList.map(m => m.id === id ? { ...m, published: !m.published } : m);
    setMembersList(updated);
    saveMembers(updated);
    refreshAllData();
  };

  const handleToggleLevel = (id: string) => {
    const updated = membersList.map(m => {
      if (m.id === id) {
        const nextLevel: MemberProfileLevel = m.profileLevel === 'basic' ? 'extended' : 'basic';
        return { ...m, profileLevel: nextLevel };
      }
      return m;
    });
    setMembersList(updated);
    saveMembers(updated);
    refreshAllData();
  };

  const handleOrderChange = (id: string, newOrder: number) => {
    const updated = membersList.map(m => m.id === id ? { ...m, order: Number(newOrder) } : m);
    setMembersList(updated);
    saveMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm(currentLang === 'uk' ? 'Ви впевнені, що хочете видалити цього учасника?' : 'Are you sure you want to delete this member?')) {
      const filtered = membersList.filter(m => m.id !== id);
      setMembersList(filtered);
      saveMembers(filtered);
      refreshAllData();
    }
  };

  const handleResetDefaults = () => {
    if (confirm(currentLang === 'uk' ? 'Скинути всі дані про учасників до початкових?' : 'Reset all members to initial defaults?')) {
      const restored = resetMembers();
      setMembersList(restored.sort((a, b) => a.order - b.order));
      refreshAllData();
    }
  };

  // Add Member
  const handleCreateNewMember = () => {
    const newId = `new-member-${Date.now()}`;
    const newM: AssociationMember = {
      id: newId,
      slug: `new-member-${Date.now()}`,
      order: membersList.length + 1,
      published: false,
      profileLevel: 'basic',
      name: { uk: 'Новий Учасник', en: 'New Member' },
      shortName: 'НОВИЙ',
      category: { uk: 'Охорона праці', en: 'Occupational Safety' },
      shortDescription: { uk: 'Короткий опис діяльності...', en: 'Brief overview of operations...' },
      fullDescription: { uk: 'Повний розширений опис діяльності нашого нового учасника...', en: 'Full extended overview of our new members operations...' },
      logoUrl: 'NEW',
      coverImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
    };
    setEditingMember(newM);
  };

  const handleSaveMemberDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    let updatedList;
    const exists = membersList.some(m => m.id === editingMember.id);
    if (exists) {
      updatedList = membersList.map(m => m.id === editingMember.id ? editingMember : m);
    } else {
      updatedList = [...membersList, editingMember];
    }

    saveMembers(updatedList);
    setEditingMember(null);
    refreshAllData();
  };

  // APPLICATIONS CONTROLS
  const handleAppStatusChange = (id: string, status: JoinRequest['status']) => {
    updateJoinRequestStatus(id, status);
    refreshAllData();
  };

  const handleDeleteApp = (id: string) => {
    if (confirm(currentLang === 'uk' ? 'Видалити цю заявку?' : 'Delete this request?')) {
      deleteJoinRequest(id);
      refreshAllData();
    }
  };

  // FEEDBACK MESSAGES CONTROLS
  const handleMarkMessageRead = (id: string) => {
    updateContactMessageStatus(id, 'read');
    refreshAllData();
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm(currentLang === 'uk' ? 'Видалити це повідомлення?' : 'Delete this message?')) {
      deleteContactMessage(id);
      refreshAllData();
    }
  };

  // DOCUMENTS CONTROLS
  const handleCreateNewDoc = () => {
    const newD: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: { uk: 'Новий Документ', en: 'New Document' },
      description: { uk: 'Опис нового файлу або правила...', en: 'Description of the new file or rule...' },
      type: 'pdf',
      size: '500 KB',
      language: 'UA/EN',
      dateUpdated: new Date().toISOString().split('T')[0],
      fileUrl: '#'
    };
    setEditingDoc(newD);
  };

  const handleSaveDocDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    let updatedDocs;
    const exists = documentsList.some(d => d.id === editingDoc.id);
    if (exists) {
      updatedDocs = documentsList.map(d => d.id === editingDoc.id ? editingDoc : d);
    } else {
      updatedDocs = [...documentsList, editingDoc];
    }

    saveDocuments(updatedDocs);
    setEditingDoc(null);
    refreshAllData();
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm(currentLang === 'uk' ? 'Видалити цей документ?' : 'Delete this document?')) {
      const filtered = documentsList.filter(d => d.id !== id);
      setDocumentsList(filtered);
      saveDocuments(filtered);
      refreshAllData();
    }
  };

  // EVENTS CONTROLS
  const handleCreateNewEvent = () => {
    const newE: AssociationEvent = {
      id: `evt_${Date.now()}`,
      title: { uk: 'Нова Подія', en: 'New Event' },
      shortDescription: { uk: 'Короткий опис...', en: 'Short description...' },
      fullDescription: { uk: 'Опис події...', en: 'Event description...' },
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
      timeZone: 'Europe/Kyiv',
      location: { uk: 'Київ / Онлайн', en: 'Kyiv / Online' },
      type: 'conference',
      format: 'hybrid',
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingEvent(newE);
  };

  const handleSaveEventDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let updatedEvents;
    const exists = eventsList.some(evt => evt.id === editingEvent.id);
    if (exists) {
      updatedEvents = eventsList.map(evt => evt.id === editingEvent.id ? { ...editingEvent, updatedAt: new Date().toISOString() } : evt);
    } else {
      updatedEvents = [...eventsList, editingEvent];
    }

    saveEvents(updatedEvents);
    setEditingEvent(null);
    refreshAllData();
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm(currentLang === 'uk' ? 'Видалити цю подію?' : 'Delete this event?')) {
      const filtered = eventsList.filter(evt => evt.id !== id);
      setEventsList(filtered);
      saveEvents(filtered);
      refreshAllData();
    }
  };

  const handleToggleEventPublish = (id: string) => {
    const updated = eventsList.map(evt => evt.id === id ? { ...evt, published: !evt.published } : evt);
    setEventsList(updated);
    saveEvents(updated);
    refreshAllData();
  };


  // LOGIN PORTAL VIEW
  if (!isAuthenticated) {
    return (
      <section className="pt-28 pb-20 min-h-screen flex items-center justify-center bg-transparent transition-colors duration-300">
        <div className="max-w-md w-full mx-4 rounded-2xl glass-card p-8 shadow-xl text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-blue-50 dark:bg-brand-blue-950 text-brand-blue-500">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-brand-slate-900 dark:text-white">
              {t.admin_login_title}
            </h2>
            <p className="text-xs text-brand-slate-500 font-mono">
              UAOS SECURE CONSOLE
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-brand-slate-500 uppercase">{t.admin_username}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-brand-slate-500 uppercase">{t.admin_password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none focus:bg-white"
              />
            </div>

            {authError && <p className="text-[11px] text-red-500 text-center font-semibold">{authError}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 active:bg-brand-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {t.admin_btn_login}
            </button>
          </form>

          {/* Quick Creds Info for sandbox */}
          <div className="p-3 bg-brand-blue-50 dark:bg-brand-blue-950/20 rounded-xl text-[10px] font-mono text-brand-slate-600 dark:text-brand-slate-400 text-center leading-relaxed">
            PROTOTYPE CREDENTIALS:<br />
            <strong>Login:</strong> admin | <strong>Password:</strong> admin123
          </div>
        </div>
      </section>
    );
  }

  // LOGGED-IN PANEL VIEW
  return (
    <section className="pt-24 pb-20 min-h-screen bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Admin line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-slate-200 dark:border-brand-slate-800 pb-6 mb-8 text-left gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-brand-blue-500" />
              <h1 className="text-2xl font-display font-bold text-brand-slate-900 dark:text-white">
                {t.admin_title}
              </h1>
            </div>
            <p className="text-xs text-brand-slate-500 font-mono">
              {currentLang === 'uk' ? 'Режим редагування контенту та заявок' : 'Content Management & Onboarding Applications Console'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-white dark:bg-brand-slate-900 hover:border-brand-yellow-500 text-xs font-bold text-brand-slate-600 dark:text-brand-slate-300 flex items-center space-x-1 cursor-pointer"
              title={t.admin_btn_reset_all}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentLang === 'uk' ? 'Скинути БД' : 'Reset DB'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{currentLang === 'uk' ? 'Вихід' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Console tabs switcher */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-slate-200 dark:border-brand-slate-800 pb-2">
          {[
            { id: 'members', label: t.admin_tab_members, count: membersList.length },
            { id: 'events', label: t.admin_tab_events, count: eventsList.filter(e => e.published && !isPastEvent(e)).length },
            { id: 'applications', label: t.admin_tab_applications, count: appsList.length, highlight: appsList.some(a => a.status === 'pending') },
            { id: 'messages', label: t.admin_tab_messages, count: messagesList.length, highlight: messagesList.some(m => m.status === 'new') },
            { id: 'documents', label: t.admin_tab_documents, count: documentsList.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingMember(null); setEditingDoc(null); setEditingEvent(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-brand-blue-500 text-white shadow-md'
                  : 'bg-white dark:bg-brand-slate-900 text-brand-slate-600 dark:text-brand-slate-400 hover:bg-brand-slate-100/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === tab.id
                  ? 'bg-brand-blue-600 text-white'
                  : 'bg-brand-slate-100 dark:bg-brand-slate-800 text-brand-slate-500'
              }`}>
                {tab.count}
              </span>
              {tab.highlight && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </button>
          ))}
        </div>

        {/* DETAIL EDIT MODE OVERLAYS / EDIT CARDS */}
        {editingEvent ? (
          <div className="glass-card rounded-2xl p-8 text-left space-y-6">
            <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">
              {currentLang === 'uk' ? 'Редагування події' : 'Edit Event'}
            </h2>
            <form onSubmit={handleSaveEventDetails} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Назва (UA) *</label>
                  <input
                    type="text"
                    value={editingEvent.title.uk}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: { ...editingEvent.title, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Title (EN) *</label>
                  <input
                    type="text"
                    value={editingEvent.title.en}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: { ...editingEvent.title, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Короткий опис (UA) *</label>
                  <textarea
                    rows={2}
                    value={editingEvent.shortDescription.uk}
                    onChange={(e) => setEditingEvent({ ...editingEvent, shortDescription: { ...editingEvent.shortDescription, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Short Description (EN) *</label>
                  <textarea
                    rows={2}
                    value={editingEvent.shortDescription.en}
                    onChange={(e) => setEditingEvent({ ...editingEvent, shortDescription: { ...editingEvent.shortDescription, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Повний опис (UA)</label>
                  <textarea
                    rows={3}
                    value={editingEvent.fullDescription.uk}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fullDescription: { ...editingEvent.fullDescription, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Full Description (EN)</label>
                  <textarea
                    rows={3}
                    value={editingEvent.fullDescription.en}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fullDescription: { ...editingEvent.fullDescription, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Початок (UTC) *</label>
                  <input
                    type="text"
                    value={editingEvent.startAt}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startAt: e.target.value })}
                    placeholder="2026-10-15T10:00:00Z"
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs font-mono dark:text-white outline-none"
                    required
                  />
                  <p className="text-[10px] text-brand-slate-400">Ex: 2026-10-15T10:00:00Z</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Завершення (UTC) *</label>
                  <input
                    type="text"
                    value={editingEvent.endAt}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endAt: e.target.value })}
                    placeholder="2026-10-15T12:00:00Z"
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs font-mono dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Тип</label>
                  <select
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  >
                    <option value="conference">Conference</option>
                    <option value="seminar">Seminar</option>
                    <option value="webinar">Webinar</option>
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Формат</label>
                  <select
                    value={editingEvent.format}
                    onChange={(e) => setEditingEvent({ ...editingEvent, format: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Локація (UA) *</label>
                  <input
                    type="text"
                    value={editingEvent.location.uk}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: { ...editingEvent.location, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Location (EN) *</label>
                  <input
                    type="text"
                    value={editingEvent.location.en}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: { ...editingEvent.location, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-brand-slate-500">Реєстраційне посилання (URL)</label>
                <input
                  type="text"
                  value={editingEvent.registrationUrl || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registrationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.admin_save}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl border border-brand-slate-200 dark:border-brand-slate-800 bg-white dark:bg-brand-slate-900 text-brand-slate-700 dark:text-brand-slate-300 text-xs font-bold cursor-pointer"
                >
                  {t.admin_cancel}
                </button>
              </div>

            </form>
          </div>
        ) : editingMember ? (
          <div className="glass-card rounded-2xl p-8 text-left space-y-6">
            <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">
              {currentLang === 'uk' ? 'Редагування профілю учасника' : 'Edit Participant Profile'}
            </h2>
            <form onSubmit={handleSaveMemberDetails} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Назва (UA) *</label>
                  <input
                    type="text"
                    value={editingMember.name.uk}
                    onChange={(e) => setEditingMember({ ...editingMember, name: { ...editingMember.name, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Name (EN) *</label>
                  <input
                    type="text"
                    value={editingMember.name.en}
                    onChange={(e) => setEditingMember({ ...editingMember, name: { ...editingMember.name, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Аббревіатура лого *</label>
                  <input
                    type="text"
                    value={editingMember.shortName}
                    onChange={(e) => setEditingMember({ ...editingMember, shortName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Категорія (UA) *</label>
                  <input
                    type="text"
                    value={editingMember.category.uk}
                    onChange={(e) => setEditingMember({ ...editingMember, category: { ...editingMember.category, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Category (EN) *</label>
                  <input
                    type="text"
                    value={editingMember.category.en}
                    onChange={(e) => setEditingMember({ ...editingMember, category: { ...editingMember.category, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-brand-slate-500">Короткий опис діяльності (UA) *</label>
                <input
                  type="text"
                  value={editingMember.shortDescription.uk}
                  onChange={(e) => setEditingMember({ ...editingMember, shortDescription: { ...editingMember.shortDescription, uk: e.target.value } })}
                  className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-brand-slate-500">Короткий опис діяльності (EN) *</label>
                <input
                  type="text"
                  value={editingMember.shortDescription.en}
                  onChange={(e) => setEditingMember({ ...editingMember, shortDescription: { ...editingMember.shortDescription, en: e.target.value } })}
                  className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-brand-slate-500">Повний опис компанії (UA) *</label>
                <textarea
                  rows={4}
                  value={editingMember.fullDescription.uk}
                  onChange={(e) => setEditingMember({ ...editingMember, fullDescription: { ...editingMember.fullDescription, uk: e.target.value } })}
                  className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-brand-slate-500">Повний опис компанії (EN) *</label>
                <textarea
                  rows={4}
                  value={editingMember.fullDescription.en}
                  onChange={(e) => setEditingMember({ ...editingMember, fullDescription: { ...editingMember.fullDescription, en: e.target.value } })}
                  className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Сайт компанії (Website)</label>
                  <input
                    type="text"
                    value={editingMember.websiteUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, websiteUrl: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">{t.admin_form_cover_url}</label>
                  <input
                    type="text"
                    value={editingMember.coverImageUrl}
                    onChange={(e) => setEditingMember({ ...editingMember, coverImageUrl: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Email для публікації</label>
                  <input
                    type="email"
                    value={editingMember.publicEmail || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, publicEmail: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Телефон для публікації</label>
                  <input
                    type="text"
                    value={editingMember.publicPhone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, publicPhone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Службові нотатки (Internal notes)</label>
                  <input
                    type="text"
                    value={editingMember.internalNotes || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, internalNotes: e.target.value })}
                    placeholder={t.admin_form_internal_notes}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.admin_save}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2.5 rounded-xl border border-brand-slate-200 dark:border-brand-slate-800 bg-white dark:bg-brand-slate-900 text-brand-slate-700 dark:text-brand-slate-300 text-xs font-bold cursor-pointer"
                >
                  {t.admin_cancel}
                </button>
              </div>

            </form>
          </div>
        ) : editingDoc ? (
          <div className="glass-card rounded-2xl p-8 text-left space-y-6">
            <h2 className="text-lg font-display font-bold text-brand-slate-900 dark:text-white">
              {currentLang === 'uk' ? 'Редагування документа' : 'Edit Document Details'}
            </h2>
            <form onSubmit={handleSaveDocDetails} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Назва документа (UA) *</label>
                  <input
                    type="text"
                    value={editingDoc.title.uk}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: { ...editingDoc.title, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Document Title (EN) *</label>
                  <input
                    type="text"
                    value={editingDoc.title.en}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: { ...editingDoc.title, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Опис документа (UA)</label>
                  <input
                    type="text"
                    value={editingDoc.description.uk}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: { ...editingDoc.description, uk: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Document Description (EN)</label>
                  <input
                    type="text"
                    value={editingDoc.description.en}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: { ...editingDoc.description, en: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Формат (pdf / doc / link)</label>
                  <select
                    value={editingDoc.type}
                    onChange={(e) => setEditingDoc({ ...editingDoc, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  >
                    <option value="pdf">PDF</option>
                    <option value="doc">DOCX</option>
                    <option value="link">LINK</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Розмір файлу (напр. 1.2 MB)</label>
                  <input
                    type="text"
                    value={editingDoc.size || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, size: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-brand-slate-500">Мова (UA / EN / UA/EN)</label>
                  <input
                    type="text"
                    value={editingDoc.language}
                    onChange={(e) => setEditingDoc({ ...editingDoc, language: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950 text-xs dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.admin_save}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-5 py-2.5 rounded-xl border border-brand-slate-200 dark:border-brand-slate-800 bg-white dark:bg-brand-slate-900 text-brand-slate-700 dark:text-brand-slate-300 text-xs font-bold cursor-pointer"
                >
                  {t.admin_cancel}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* STANDARD TAB VIEWS */
          <div className="glass-card rounded-2xl p-6 shadow-md">
            
            {/* EVENTS TAB CONTENT */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-base font-bold text-brand-slate-900 dark:text-white uppercase font-display">
                    {currentLang === 'uk' ? 'Управління подіями' : 'Manage Events'}
                  </h3>
                  <button
                    onClick={handleCreateNewEvent}
                    className="px-4 py-2 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{currentLang === 'uk' ? 'Нова Подія' : 'New Event'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-brand-slate-100 dark:border-brand-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-slate-50 dark:bg-brand-slate-950 text-brand-slate-500 dark:text-brand-slate-400 font-mono font-bold uppercase border-b border-brand-slate-100 dark:border-brand-slate-800">
                        <th className="p-4 w-16 text-center">Status</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Date (UTC)</th>
                        <th className="p-4">Type/Format</th>
                        <th className="p-4 text-center">Publish</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-slate-100 dark:divide-brand-slate-800/60 font-sans text-brand-slate-700 dark:text-brand-slate-300">
                      {eventsList.map((evt) => (
                        <tr key={evt.id} className="hover:bg-brand-slate-50/50 dark:hover:bg-brand-slate-950/30">
                          <td className="p-4 text-center">
                            {isPastEvent(evt) ? (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-slate-400 bg-brand-slate-100 dark:bg-brand-slate-800 px-2 py-0.5 rounded-full">PAST</span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">UPCOMING</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold">{evt.title[currentLang]}</td>
                          <td className="p-4 font-mono text-brand-slate-500">{evt.startAt.split('T')[0]}</td>
                          <td className="p-4 text-brand-slate-500 font-mono text-[10px] uppercase">
                            {evt.type} • {evt.format}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleEventPublish(evt.id)}
                              className="cursor-pointer inline-flex"
                            >
                              {evt.published ? (
                                <ToggleRight className="w-8 h-8 text-brand-blue-500" />
                              ) : (
                                <ToggleLeft className="w-8 h-8 text-brand-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => setEditingEvent(evt)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-brand-blue-50 dark:bg-brand-slate-800 hover:text-brand-blue-500 cursor-pointer"
                                title={t.admin_edit}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-red-50 dark:bg-brand-slate-800 hover:text-red-500 cursor-pointer"
                                title={t.admin_delete}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MEMBERS TAB CONTENT */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-base font-bold text-brand-slate-900 dark:text-white uppercase font-display">
                    {currentLang === 'uk' ? 'Управління учасниками' : 'Manage Participants'}
                  </h3>
                  <button
                    onClick={handleCreateNewMember}
                    className="px-4 py-2 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.admin_btn_add_member}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-brand-slate-100 dark:border-brand-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-slate-50 dark:bg-brand-slate-950 text-brand-slate-500 dark:text-brand-slate-400 font-mono font-bold uppercase border-b border-brand-slate-100 dark:border-brand-slate-800">
                        <th className="p-4 w-16 text-center">Order</th>
                        <th className="p-4">Logo</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Package</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-slate-100 dark:divide-brand-slate-800/60 font-sans text-brand-slate-700 dark:text-brand-slate-300">
                      {membersList.map((m) => (
                        <tr key={m.id} className="hover:bg-brand-slate-50/50 dark:hover:bg-brand-slate-950/30">
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={m.order}
                              onChange={(e) => handleOrderChange(m.id, Number(e.target.value))}
                              className="w-12 text-center p-1 rounded border border-brand-slate-200 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950"
                            />
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold bg-brand-slate-100 dark:bg-brand-slate-800 p-1.5 rounded text-[10px] text-brand-blue-500">
                              {m.shortName}
                            </span>
                          </td>
                          <td className="p-4 font-semibold">{m.name[currentLang]}</td>
                          <td className="p-4 text-brand-slate-500">{m.category[currentLang]}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleLevel(m.id)}
                              className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer ${
                                m.profileLevel === 'extended'
                                  ? 'bg-brand-blue-50 text-brand-blue-600 border border-brand-blue-100 dark:bg-brand-blue-950/30'
                                  : 'bg-brand-slate-100 text-brand-slate-500'
                              }`}
                            >
                              {m.profileLevel}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePublish(m.id)}
                              className="cursor-pointer inline-flex"
                              title={m.published ? t.admin_unpublish : t.admin_publish}
                            >
                              {m.published ? (
                                <ToggleRight className="w-8 h-8 text-brand-blue-500" />
                              ) : (
                                <ToggleLeft className="w-8 h-8 text-brand-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => setEditingMember(m)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-brand-blue-50 dark:bg-brand-slate-800 dark:hover:bg-brand-slate-700 text-brand-slate-600 dark:text-brand-slate-300 hover:text-brand-blue-500 cursor-pointer"
                                title={t.admin_edit}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(m.id)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-red-50 dark:bg-brand-slate-800 dark:hover:bg-brand-slate-700 text-brand-slate-600 dark:text-brand-slate-300 hover:text-red-500 cursor-pointer"
                                title={t.admin_delete}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* APPLICATIONS TAB CONTENT */}
            {activeTab === 'applications' && (
              <div className="space-y-6 text-left">
                <h3 className="text-base font-bold text-brand-slate-900 dark:text-white uppercase font-display border-b border-brand-slate-100 dark:border-brand-slate-800 pb-2">
                  {currentLang === 'uk' ? 'Заявки від кандидатів на вступ' : 'Onboarding Membership Applications'}
                </h3>

                {appsList.length > 0 ? (
                  <div className="space-y-4">
                    {appsList.map((app) => (
                      <div
                        key={app.id}
                        className="p-6 rounded-2xl border border-brand-slate-100 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950/40 space-y-4 relative"
                      >
                        {/* Status Label on right */}
                        <div className="absolute top-6 right-6 flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                            app.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : app.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-brand-slate-200 text-brand-slate-700'
                          }`}>
                            {app.status === 'pending' ? t.admin_app_status_pending : app.status}
                          </span>

                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1 text-brand-slate-400 hover:text-red-500 cursor-pointer"
                            title={t.admin_delete}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>

                        {/* App Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                          <div>
                            <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">Організація</span>
                            <span className="font-bold text-brand-slate-800 dark:text-white">{app.companyName}</span>
                          </div>
                          <div>
                            <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">Activity</span>
                            <span className="font-semibold">{app.activityField}</span>
                          </div>
                          <div>
                            <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">Website</span>
                            {app.website ? (
                              <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue-500 hover:underline font-semibold">
                                {app.website}
                              </a>
                            ) : (
                              <span className="text-brand-slate-400">-</span>
                            )}
                          </div>
                          <div>
                            <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">ЄДРПОУ / Date</span>
                            <span className="font-mono text-brand-slate-600 dark:text-brand-slate-400">
                              {app.edrpou || 'N/A'} • {app.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-brand-slate-200/50">
                          <div>
                            <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">Представник / Контакти</span>
                            <span className="font-bold block text-brand-slate-800 dark:text-white">{app.contactPerson}</span>
                            <span className="text-brand-slate-500 font-mono text-[11px]">{app.phone} • {app.email}</span>
                          </div>
                          {app.message && (
                            <div>
                              <span className="block text-brand-slate-400 text-[9px] font-mono uppercase font-semibold">Супровідний лист</span>
                              <p className="italic text-brand-slate-600 dark:text-brand-slate-300 leading-normal">{app.message}</p>
                            </div>
                          )}
                        </div>

                        {/* Status Change Buttons */}
                        <div className="pt-4 mt-2 border-t border-brand-slate-200/50 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'accepted')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            {currentLang === 'uk' ? 'Прийняти' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            {currentLang === 'uk' ? 'Відхилити' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'reviewed')}
                            className="px-3 py-1.5 rounded-lg bg-brand-slate-600 hover:bg-brand-slate-700 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            {currentLang === 'uk' ? 'Опрацьовано' : 'Mark Reviewed'}
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-brand-slate-200 dark:border-brand-slate-800 rounded-2xl max-w-sm mx-auto">
                    <AlertTriangle className="w-10 h-10 text-brand-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-mono font-bold text-brand-slate-400">
                      {currentLang === 'uk' ? 'ЗАЯВОК ПОКИ НЕМАЄ' : 'NO APPLICATIONS RECEIVED'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES TAB CONTENT */}
            {activeTab === 'messages' && (
              <div className="space-y-6 text-left">
                <h3 className="text-base font-bold text-brand-slate-900 dark:text-white uppercase font-display border-b border-brand-slate-100 dark:border-brand-slate-800 pb-2">
                  {currentLang === 'uk' ? 'Повідомлення зворотного зв’язку' : 'Visitor Feedback Messages'}
                </h3>

                {messagesList.length > 0 ? (
                  <div className="space-y-4">
                    {messagesList.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-2xl border border-brand-slate-100 dark:border-brand-slate-800 bg-brand-slate-50 dark:bg-brand-slate-950/40 relative space-y-3"
                      >
                        <div className="absolute top-5 right-5 flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                            msg.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-brand-slate-200 text-brand-slate-600'
                          }`}>
                            {msg.status}
                          </span>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-brand-slate-400 hover:text-red-500 cursor-pointer"
                            title={t.admin_delete}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs space-y-1">
                          <span className="block text-[10px] font-mono text-brand-slate-400 uppercase">{msg.createdAt}</span>
                          <p className="font-bold text-brand-slate-800 dark:text-white">
                            {msg.name} (<a href={`mailto:${msg.email}`} className="text-brand-blue-500 font-normal hover:underline">{msg.email}</a>)
                          </p>
                          <p className="font-semibold text-brand-blue-600 dark:text-brand-sky-300">
                            Тема: {msg.subject}
                          </p>
                          <p className="text-brand-slate-600 dark:text-brand-slate-300 leading-relaxed font-sans mt-2 italic bg-white dark:bg-brand-slate-900 p-3 rounded-lg border border-brand-slate-200/50">
                            "{msg.message}"
                          </p>
                        </div>

                        {msg.status === 'new' && (
                          <button
                            onClick={() => handleMarkMessageRead(msg.id)}
                            className="px-3 py-1 rounded bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-brand-slate-200 dark:border-brand-slate-800 rounded-2xl max-w-sm mx-auto">
                    <Mail className="w-10 h-10 text-brand-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-mono font-bold text-brand-slate-400">
                      {currentLang === 'uk' ? 'ПОВІДОМЛЕНЬ НЕМАЄ' : 'NO MESSAGES'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENTS TAB CONTENT */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-base font-bold text-brand-slate-900 dark:text-white uppercase font-display">
                    {currentLang === 'uk' ? 'Управління офіційними документами' : 'Manage Legal Documents'}
                  </h3>
                  <button
                    onClick={handleCreateNewDoc}
                    className="px-4 py-2 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.admin_btn_add_doc}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-brand-slate-100 dark:border-brand-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-slate-50 dark:bg-brand-slate-950 text-brand-slate-500 dark:text-brand-slate-400 font-mono font-bold uppercase border-b border-brand-slate-100 dark:border-brand-slate-800">
                        <th className="p-4">Format</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Language</th>
                        <th className="p-4">Updated</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-slate-100 dark:divide-brand-slate-800/60 text-brand-slate-700 dark:text-brand-slate-300">
                      {documentsList.map((doc) => (
                        <tr key={doc.id} className="hover:bg-brand-slate-50/50 dark:hover:bg-brand-slate-950/30">
                          <td className="p-4 uppercase font-mono font-bold text-red-500">{doc.type}</td>
                          <td className="p-4 font-semibold">{doc.title[currentLang]}</td>
                          <td className="p-4 font-mono text-brand-slate-500">{doc.size || 'N/A'}</td>
                          <td className="p-4 font-mono">{doc.language}</td>
                          <td className="p-4 font-mono text-brand-slate-500">{doc.dateUpdated}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => setEditingDoc(doc)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-brand-blue-50 dark:bg-brand-slate-800 text-brand-slate-600 dark:text-brand-slate-300 hover:text-brand-blue-500 cursor-pointer"
                                title={t.admin_edit}
                              >
                                <Edit className="w-4.5 h-4.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="p-1.5 rounded-lg bg-brand-slate-50 hover:bg-red-50 dark:bg-brand-slate-800 text-brand-slate-600 dark:text-brand-slate-300 hover:text-red-500 cursor-pointer"
                                title={t.admin_delete}
                              >
                                <Trash className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
