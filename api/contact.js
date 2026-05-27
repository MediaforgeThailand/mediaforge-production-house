const TO_EMAIL = 'info@mediaforge.co'
const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send'
const DEFAULT_CONTACT_RELAY_URL = 'https://fymncypboeubdikpbmqc.supabase.co/functions/v1/production-contact'

function sendJson(response, status, body) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

function clean(value, maxLength = 1200) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { message: 'Method not allowed.' })
  }

  let body = {}
  try {
    body = typeof request.body === 'string'
      ? JSON.parse(request.body || '{}')
      : request.body || {}
  } catch {
    return sendJson(response, 400, { message: 'Invalid request body.' })
  }
  if (clean(body.website)) {
    return sendJson(response, 200, { ok: true })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 180)
  const company = clean(body.company, 180)
  const project = clean(body.project, 180)
  const budget = clean(body.budget, 180)
  const phone = clean(body.phone, 80)
  const message = clean(body.message, 2400)

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendJson(response, 400, { message: 'Please complete the required fields.' })
  }

  const relayUrl = process.env.CONTACT_RELAY_URL || DEFAULT_CONTACT_RELAY_URL
  if (relayUrl) {
    try {
      const relayResponse = await fetch(relayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, project, budget, phone, message })
      })
      const relayBody = await relayResponse.json().catch(() => ({}))

      if (relayResponse.ok) {
        return sendJson(response, 200, relayBody?.ok ? relayBody : { ok: true })
      }

      if (!process.env.SENDGRID_API_KEY) {
        return sendJson(response, relayResponse.status, {
          message: relayBody?.message || 'Email could not be sent.'
        })
      }
    } catch (error) {
      console.error('[contact] Relay failed:', error)
      if (!process.env.SENDGRID_API_KEY) {
        return sendJson(response, 502, { message: 'Email could not be sent.' })
      }
    }
  }

  if (!process.env.SENDGRID_API_KEY) {
    return sendJson(response, 500, { message: 'Email service is not configured.' })
  }

  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok'
  })
  const subject = `New production inquiry from ${name}`
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'noreply@mediaforge.co'
  const fromName = process.env.CONTACT_FROM_NAME || 'MediaForge Studio'

  const html = `
    <div style="font-family:Arial,sans-serif;color:#161616;line-height:1.5">
      <h1 style="font-size:24px;margin:0 0 16px">New production inquiry</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || '-'}</p>
      <p><strong>Project Type:</strong> ${project || '-'}</p>
      <p><strong>Budget / Timeline:</strong> ${budget || '-'}</p>
      <p><strong>Phone:</strong> ${phone || '-'}</p>
      <p><strong>Submitted:</strong> ${submittedAt} Bangkok time</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:20px 0" />
      <p style="white-space:pre-line">${message}</p>
    </div>
  `
  const text = [
    'New production inquiry',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '-'}`,
    `Project Type: ${project || '-'}`,
    `Budget / Timeline: ${budget || '-'}`,
    `Phone: ${phone || '-'}`,
    `Submitted: ${submittedAt} Bangkok time`,
    '',
    message
  ].join('\n')

  const sendGridResponse = await fetch(SENDGRID_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: process.env.CONTACT_TO_EMAIL || TO_EMAIL }],
          subject
        }
      ],
      from: { email: fromEmail, name: fromName },
      reply_to: { email, name },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html }
      ],
      categories: ['production-house-contact']
    })
  })

  if (!sendGridResponse.ok) {
    const detail = await sendGridResponse.text().catch(() => '')
    console.error(`[contact] SendGrid ${sendGridResponse.status}: ${detail.slice(0, 400)}`)
    return sendJson(response, 502, { message: 'Email could not be sent.' })
  }

  return sendJson(response, 200, {
    ok: true,
    id: sendGridResponse.headers.get('x-message-id')
  })
}
