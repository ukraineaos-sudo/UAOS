/**
 * Vercel Serverless Function: POST /api/join
 * Saves membership application to Sanity (requires SANITY_API_WRITE_TOKEN).
 * Optionally forwards to Formspree if FORMSPREE_JOIN_ENDPOINT is set.
 */
import type {VercelRequest, VercelResponse} from '@vercel/node'
import {createClient} from '@sanity/client'

type RateEntry = {count: number; resetAt: number}
const rateEntries = new Map<string, RateEntry>()
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 минут
const RATE_LIMIT_PER_WINDOW = 5 // best-effort: 5 заявок за окно

function getClientIp(req: VercelRequest): string | null {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    // x-forwarded-for может быть вида: "ip1, ip2"
    return xff.split(',')[0].trim()
  }
  const xri = req.headers['x-real-ip']
  if (typeof xri === 'string' && xri.length > 0) return xri.trim()
  return null
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const existing = rateEntries.get(key)
  if (!existing || now > existing.resetAt) {
    rateEntries.set(key, {count: 1, resetAt: now + RATE_WINDOW_MS})
    return false
  }
  if (existing.count >= RATE_LIMIT_PER_WINDOW) return true
  rateEntries.set(key, {count: existing.count + 1, resetAt: existing.resetAt})
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({error: 'Method not allowed'})
  }

  const contentType = req.headers['content-type']
  if (typeof contentType === 'string' && !contentType.includes('application/json')) {
    return res.status(415).json({error: 'Expected application/json'})
  }

  let body: any = null
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return res.status(400).json({error: 'Invalid JSON'})
  }

  const hp = typeof body?.hp === 'string' ? body.hp.trim() : ''
  if (hp) {
    return res.status(400).json({error: 'Spam detected'})
  }

  const clientIp = getClientIp(req) || 'unknown'
  const rateKey = `ip:${clientIp}`
  if (isRateLimited(rateKey)) {
    return res.status(429).json({error: 'Too many requests'})
  }

  const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : ''
  const websiteRaw = typeof body?.website === 'string' ? body.website.trim() : ''
  const activityField = typeof body?.activityField === 'string' ? body.activityField.trim() : ''
  const edrpouRaw = typeof body?.edrpou === 'string' ? body.edrpou.trim() : ''
  const contactPerson = typeof body?.contactPerson === 'string' ? body.contactPerson.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const consent = body?.privacyConsent === true || body?.consent === true
  const consentTimestamp = new Date().toISOString()

  const normalizeWhitespace = (s: string) => s.replace(/\s+/g, ' ')
  const max = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s)

  const companyNameN = normalizeWhitespace(companyName)
  const contactPersonN = normalizeWhitespace(contactPerson)
  const activityFieldN = normalizeWhitespace(activityField)
  const websiteN = websiteRaw
  const messageN = message
  const edrpouN = edrpouRaw.replace(/\D/g, '').slice(0, 8)
  const phoneN = normalizeWhitespace(phone)

  // Required fields
  if (!companyNameN || !activityFieldN || !contactPersonN || !email || !phoneN) {
    return res.status(400).json({error: 'Missing required fields'})
  }
  if (!consent) {
    return res.status(400).json({error: 'Privacy consent is required'})
  }

  // Length limits (PII/spam control)
  if (companyNameN.length > 120) return res.status(400).json({error: 'Company name is too long'})
  if (contactPersonN.length > 120) return res.status(400).json({error: 'Contact person is too long'})
  if (activityFieldN.length > 200) return res.status(400).json({error: 'Activity field is too long'})
  if (email.length > 254) return res.status(400).json({error: 'Email is too long'})
  if (phoneN.length > 30) return res.status(400).json({error: 'Phone is too long'})
  if (messageN.length > 2000) return res.status(400).json({error: 'Message is too long'})

  // Format checks
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error: 'Invalid email'})
  if (phoneN.replace(/[^\d]/g, '').length < 9) return res.status(400).json({error: 'Invalid phone'})

  let website = ''
  if (websiteN) {
    try {
      const u = new URL(websiteN)
      if (!/^https?:$/i.test(u.protocol)) return res.status(400).json({error: 'Invalid website URL'})
      website = max(u.toString(), 200)
    } catch {
      return res.status(400).json({error: 'Invalid website URL'})
    }
  }

  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN

  let sanitySaved = false

  if (projectId && projectId !== 'yourProjectId' && token) {
    try {
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-01-01',
        token,
        useCdn: false,
      })
        await client.create({
        _type: 'joinRequest',
        status: 'pending',
        companyName: companyNameN,
        website: website || '',
        activityField: activityFieldN,
        edrpou: edrpouN || '',
        contactPerson: contactPersonN,
        email,
        phone: phoneN,
        message: messageN || '',
        privacyConsent: true,
        consentTimestamp,
        consentIp: clientIp === 'unknown' ? '' : clientIp,
        submittedAt: consentTimestamp,
      })
      sanitySaved = true
    } catch (err) {
      console.error('Sanity join create failed:', err)
    }
  }

  const formspree = process.env.FORMSPREE_JOIN_ENDPOINT
  if (formspree) {
    try {
      await fetch(formspree, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          companyName: companyNameN,
          website: website || '',
          activityField: activityFieldN,
          edrpou: edrpouN || '',
          contactPerson: contactPersonN,
          email,
          phone: phoneN,
          message: messageN || '',
          privacyConsent: true,
          consentTimestamp,
        }),
      })
    } catch (err) {
      console.error('Formspree forward failed:', err)
    }
  }

  if (!sanitySaved && !formspree) {
    return res.status(503).json({
      error: 'Join API not configured. Set SANITY_API_WRITE_TOKEN or FORMSPREE_JOIN_ENDPOINT.',
    })
  }

  return res.status(200).json({ok: true, sanitySaved})
}
