import { Resend } from 'resend'

const TO_EMAIL = 'info@mediaforge.co'

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
  const message = clean(body.message, 2400)

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendJson(response, 400, { message: 'Please complete the required fields.' })
  }

  if (!process.env.RESEND_API_KEY) {
    return sendJson(response, 500, { message: 'Email service is not configured.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok'
  })

  const html = `
    <div style="font-family:Arial,sans-serif;color:#161616;line-height:1.5">
      <h1 style="font-size:24px;margin:0 0 16px">New production inquiry</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || '-'}</p>
      <p><strong>Project Type:</strong> ${project || '-'}</p>
      <p><strong>Budget / Timeline:</strong> ${budget || '-'}</p>
      <p><strong>Submitted:</strong> ${submittedAt} Bangkok time</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:20px 0" />
      <p style="white-space:pre-line">${message}</p>
    </div>
  `

  const { data, error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || 'MediaForge Studio <info@mediaforge.co>',
    to: process.env.CONTACT_TO_EMAIL || TO_EMAIL,
    subject: `New production inquiry from ${name}`,
    html
  })

  if (error) {
    return sendJson(response, 502, { message: error.message || 'Email could not be sent.' })
  }

  return sendJson(response, 200, { ok: true, id: data?.id })
}
