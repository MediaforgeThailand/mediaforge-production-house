import { useState } from 'react'

const tabs = [
  {
    id: 'films',
    label: 'Films',
    body: `From short documentaries to feature-length narratives, our film team
partners with directors, brands, and broadcasters to bring stories to the screen
— with end-to-end production from script to delivery.`,
  },
  {
    id: 'commercials',
    label: 'Commercials',
    body: `Crafted commercial work for global and regional brands — concept,
board, shoot, post. Our directors come from documentary and narrative
backgrounds, so the work never looks like a spot for the sake of being one.`,
  },
  {
    id: 'branded',
    label: 'Branded Content',
    body: `Long-form branded storytelling that lives where audiences already
are. Episode-driven series, YouTube documentary, and platform-native content,
built to keep watching past the first ten seconds.`,
  },
]

export default function Tabbed() {
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find(t => t.id === active)

  return (
    <section className="tabbed" id="films">
      <h2 className="tabbed__heading">What We Make</h2>
      <ul className="tabbed__tabs">
        {tabs.map(t => (
          <li key={t.id}>
            <button
              className={`tab${t.id === active ? ' is-active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tabbed__panel">
        <h3>{current.label}</h3>
        <p>{current.body}</p>
        <a href="#" className="cta cta--dark">
          <span className="cta__label">Learn More</span>
          <span className="cta__icon">→</span>
        </a>
      </div>
    </section>
  )
}
