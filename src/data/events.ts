import { AssociationEvent } from '../types';

const STORAGE_KEY = 'uaos_events_v2';

const INITIAL_EVENTS: AssociationEvent[] = [
  {
    id: 'evt_demo_1',
    published: true,
    title: {
      uk: 'Тренінг "Основи безпеки на виробництві"',
      en: 'Training "Fundamentals of Industrial Safety"'
    },
    shortDescription: {
      uk: 'Базовий тренінг для нових спеціалістів з охорони праці.',
      en: 'Basic training for new occupational safety specialists.'
    },
    fullDescription: {
      uk: 'Детальний опис тренінгу...',
      en: 'Detailed description of the training...'
    },
    type: 'training',
    format: 'online',
    startAt: '2026-09-24T15:00:00.000Z',
    endAt: '2026-09-24T17:00:00.000Z',
    timeZone: 'Europe/Kyiv',
    onlineUrl: 'https://zoom.us/j/123456789',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'evt_demo_2',
    published: true,
    title: {
      uk: 'Конференція "Майбутнє охорони праці"',
      en: 'Conference "Future of Occupational Safety"'
    },
    shortDescription: {
      uk: 'Щорічна конференція членів асоціації.',
      en: 'Annual conference of association members.'
    },
    fullDescription: {
      uk: 'Детальний опис конференції...',
      en: 'Detailed description of the conference...'
    },
    type: 'conference',
    format: 'hybrid',
    startAt: '2026-10-15T09:00:00.000Z',
    endAt: '2026-10-15T18:00:00.000Z',
    timeZone: 'Europe/Kyiv',
    location: {
      uk: 'Київ, вул. Хрещатик, 1',
      en: 'Kyiv, Khreshchatyk st., 1'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getEvents(): AssociationEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error loading events from localStorage:', err);
  }
  return INITIAL_EVENTS;
}

export function saveEvents(events: AssociationEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving events to localStorage:', err);
  }
}

export function addEvent(event: Omit<AssociationEvent, 'id' | 'createdAt' | 'updatedAt'>): AssociationEvent {
  const events = getEvents();
  const newEvent: AssociationEvent = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function updateEvent(event: AssociationEvent): void {
  const events = getEvents();
  const index = events.findIndex(e => e.id === event.id);
  if (index !== -1) {
    events[index] = { ...event, updatedAt: new Date().toISOString() };
    saveEvents(events);
  }
}

export function deleteEvent(id: string): void {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  saveEvents(filtered);
}

export function toggleEventPublished(id: string): void {
  const events = getEvents();
  const event = events.find(e => e.id === id);
  if (event) {
    event.published = !event.published;
    event.updatedAt = new Date().toISOString();
    saveEvents(events);
  }
}

export function resetEvents(): AssociationEvent[] {
  saveEvents(INITIAL_EVENTS);
  return INITIAL_EVENTS;
}
