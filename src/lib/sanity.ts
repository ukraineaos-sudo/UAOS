import {createClient, type SanityClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production'

export const sanityConfigured = Boolean(
  projectId && projectId !== 'yourProjectId' && projectId.length > 0
)

export const sanityStudioUrl =
  (import.meta.env.VITE_SANITY_STUDIO_URL as string | undefined) || 'http://localhost:3333'

let client: SanityClient | null = null

export function getSanityClient(): SanityClient | null {
  if (!sanityConfigured) return null
  if (!client) {
    client = createClient({
      projectId: projectId!,
      dataset,
      apiVersion: '2025-01-01',
      useCdn: true,
    })
  }
  return client
}

/** Build CDN URL for a Sanity image field (or empty string). */
export function urlForImage(source: unknown): string {
  if (!source || !sanityConfigured) return ''
  const c = getSanityClient()
  if (!c) return ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return imageUrlBuilder(c).image(source as any).width(1200).auto('format').url()
  } catch {
    return ''
  }
}

export type SanityLocale = {uk?: string; en?: string} | null | undefined

export function mapLocale(value: SanityLocale): {uk: string; en: string} {
  return {
    uk: value?.uk?.trim() || '',
    en: value?.en?.trim() || '',
  }
}
