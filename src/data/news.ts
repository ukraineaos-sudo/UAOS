import {LocalizedText} from '../types'
import {getSanityClient, mapLocale, sanityConfigured, urlForImage} from '../lib/sanity'

export interface NewsItem {
  id: string
  slug: string
  published: boolean
  publishedAt: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  coverImageUrl?: string
}

const NEWS_QUERY = `*[_type == "news" && published == true] | order(publishedAt desc)[0...6] {
  _id,
  "slug": slug.current,
  published,
  publishedAt,
  title,
  excerpt,
  body,
  coverImage
}`

function mapNews(doc: any): NewsItem {
  return {
    id: doc._id,
    slug: doc.slug || doc._id,
    published: Boolean(doc.published),
    publishedAt: doc.publishedAt || new Date().toISOString(),
    title: mapLocale(doc.title),
    excerpt: mapLocale(doc.excerpt),
    body: mapLocale(doc.body),
    coverImageUrl: urlForImage(doc.coverImage) || undefined,
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const client = getSanityClient()
  if (!client || !sanityConfigured) {
    return []
  }
  try {
    const docs = await client.fetch(NEWS_QUERY)
    if (!Array.isArray(docs)) return []
    return docs.map(mapNews)
  } catch (err) {
    console.error('Sanity fetchNews failed:', err)
    return []
  }
}
