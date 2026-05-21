import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = e => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className="newsletter" id="contact">
      <h2>STAY IN TOUCH</h2>
      <p>{sent
        ? `Thanks — we'll be in touch.`
        : `Get new work, behind-the-scenes, and studio updates straight to your inbox.`}</p>
      <form className="newsletter__form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="cta cta--primary">
          <span className="cta__label">Subscribe</span>
          <span className="cta__icon">→</span>
        </button>
      </form>
    </section>
  )
}
