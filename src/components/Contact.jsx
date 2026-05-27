import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  company: '',
  project: '',
  budget: '',
  phone: '',
  message: '',
  website: ''
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [statusText, setStatusText] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setStatusText('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Message could not be sent.')
      }

      setForm(initialForm)
      setStatus('sent')
      setStatusText('Message sent. We will get back to you shortly.')
    } catch (error) {
      setStatus('error')
      setStatusText(error.message || 'Message could not be sent.')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__intro">
        <p className="eyebrow dark">/ CONTACT</p>
        <h2>LET'S BUILD THE NEXT FRAME</h2>
        <p>
          Tell us what you are making. Our production team will review the brief
          and reply from info@mediaforge.co.
        </p>
      </div>

      <form className="contact__form" onSubmit={onSubmit}>
        <input
          className="contact__honeypot"
          type="text"
          name="website"
          value={form.website}
          onChange={updateField}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />
        <label>
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </label>
        <label>
          <span>Company</span>
          <input
            name="company"
            value={form.company}
            onChange={updateField}
            autoComplete="organization"
          />
        </label>
        <label>
          <span>Project Type</span>
          <input
            name="project"
            value={form.project}
            onChange={updateField}
            placeholder="Film, commercial, animation..."
          />
        </label>
        <label>
          <span>Budget / Timeline</span>
          <input
            name="budget"
            value={form.budget}
            onChange={updateField}
            placeholder="Budget range, launch date, or both"
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            placeholder="Phone number or LINE contact"
          />
        </label>
        <label className="contact__message">
          <span>Brief</span>
          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            rows="6"
            required
          />
        </label>
        <div className="contact__actions">
          <button
            type="submit"
            className="cta cta--dark"
            disabled={status === 'sending'}
          >
            <span className="cta__label">
              {status === 'sending' ? 'Sending' : 'Send Brief'}
            </span>
            <span className="cta__icon" aria-hidden="true">→</span>
          </button>
          <p className={`contact__status is-${status}`} aria-live="polite">
            {statusText}
          </p>
        </div>
      </form>
    </section>
  )
}
