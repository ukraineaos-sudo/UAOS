import {AssociationEvent} from '../types'
import {getSanityClient, mapLocale, sanityConfigured, urlForImage} from '../lib/sanity'

export const INITIAL_EVENTS: AssociationEvent[] = [
  {
    id: 'evt_demo_1',
    published: true,
    title: {
      uk: 'Тренінг "Основи безпеки на виробництві"',
      en: 'Training "Fundamentals of Industrial Safety"',
    },
    shortDescription: {
      uk: 'Базовий тренінг для нових спеціалістів з охорони праці.',
      en: 'Basic training for new occupational safety specialists.',
    },
    fullDescription: {
      uk: 'Детальний опис тренінгу...',
      en: 'Detailed description of the training...',
    },
    type: 'training',
    format: 'online',
    startAt: '2026-09-24T15:00:00.000Z',
    endAt: '2026-09-24T17:00:00.000Z',
    timeZone: 'Europe/Kyiv',
    onlineUrl: 'https://zoom.us/j/123456789',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_demo_2',
    published: true,
    title: {
      uk: 'Конференція "Майбутнє охорони праці"',
      en: 'Conference "Future of Occupational Safety"',
    },
    shortDescription: {
      uk: 'Щорічна конференція членів асоціації.',
      en: 'Annual conference of association members.',
    },
    fullDescription: {
      uk: 'Детальний опис конференції...',
      en: 'Detailed description of the conference...',
    },
    type: 'conference',
    format: 'hybrid',
    startAt: '2026-10-15T09:00:00.000Z',
    endAt: '2026-10-15T18:00:00.000Z',
    timeZone: 'Europe/Kyiv',
    location: {
      uk: 'Київ, вул. Хрещатик, 1',
      en: 'Kyiv, Khreshchatyk st., 1',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const EVENTS_QUERY = `*[_type == "event" && published == true] | order(startAt asc) {
  _id,
  _createdAt,
  _updatedAt,
  published,
  title,
  shortDescription,
  fullDescription,
  type,
  format,
  startAt,
  endAt,
  timeZone,
  location,
  onlineUrl,
  registrationUrl,
  organizer,
  coverImage
}`

function mapEvent(doc: any): AssociationEvent {
  return {
    id: doc._id,
    published: Boolean(doc.published),
    title: mapLocale(doc.title),
    shortDescription: mapLocale(doc.shortDescription),
    fullDescription: mapLocale(doc.fullDescription),
    type: doc.type || 'meeting',
    format: doc.format || 'online',
    startAt: doc.startAt,
    endAt: doc.endAt,
    timeZone: doc.timeZone || 'Europe/Kyiv',
    location: doc.location ? mapLocale(doc.location) : undefined,
    onlineUrl: doc.onlineUrl || undefined,
    registrationUrl: doc.registrationUrl || undefined,
    organizer: doc.organizer ? mapLocale(doc.organizer) : undefined,
    coverImageUrl: urlForImage(doc.coverImage) || undefined,
    createdAt: doc._createdAt || new Date().toISOString(),
    updatedAt: doc._updatedAt || new Date().toISOString(),
  }
}

/** Async loader: Sanity when configured, otherwise seed. */
export async function fetchEvents(): Promise<AssociationEvent[]> {
  const client = getSanityClient()
  if (!client || !sanityConfigured) {
    return INITIAL_EVENTS
  }
  try {
    const docs = await client.fetch(EVENTS_QUERY)
    if (!Array.isArray(docs) || docs.length === 0) {
      return INITIAL_EVENTS
    }
    return docs.map(mapEvent)
  } catch (err) {
    console.error('Sanity fetchEvents failed, using seed:', err)
    return INITIAL_EVENTS
  }
}

/** @deprecated Sync localStorage API — kept for rare callers; prefer fetchEvents */
export function getEvents(): AssociationEvent[] {
  return INITIAL_EVENTS
}
