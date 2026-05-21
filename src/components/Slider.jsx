import { useState } from 'react'

const slides = [
  { c1: '#3b2a4a', c2: '#a064c0', title: 'Northern Light',
    copy: 'A cinematic brand film shot across three countries — featuring real crew, real weather, no shortcuts.' },
  { c1: '#5d7a3a', c2: '#a0c054', title: 'City Pulse',
    copy: 'A 60-second commercial campaign for a global beverage brand — choreographed, single take.' },
  { c1: '#7a4630', c2: '#d4a04a', title: 'Field Notes',
    copy: 'Branded documentary series following farmers across Southeast Asia for the harvest season.' },
  { c1: '#2a3a5d', c2: '#5d7ac0', title: 'Glass House',
    copy: 'Music video — single take, no cuts, all practical lighting on a rotating set.' },
  { c1: '#7a3a5d', c2: '#c064a0', title: 'Quiet Hour',
    copy: 'Short film selected for three regional festivals. 14 minutes, 4 locations, 1 crew.' },
  { c1: '#3a5d7a', c2: '#64a0c0', title: 'Long Drive',
    copy: 'Travel campaign — six countries in twenty-three days, captured on Super 16 and digital.' },
]

export default function Slider() {
  const [active, setActive] = useState(0)
  const slide = slides[active]
  const next = () => setActive((active + 1) % slides.length)
  const prev = () => setActive((active - 1 + slides.length) % slides.length)
  const pad = n => String(n + 1).padStart(2, '0')

  return (
    <section className="slider light" id="work">
      <div className="slider__stage">
        <article className="slide is-active" key={active}>
          <div className="slide__bg" style={{ '--c1': slide.c1, '--c2': slide.c2 }} />
          <div className="slide__content">
            <p className="eyebrow dark">/ SELECTED WORK</p>
            <h2 className="slide__title">{slide.title}</h2>
            <p className="slide__copy">{slide.copy}</p>
            <a href="#" className="cta cta--primary">
              <span className="cta__label">Case Study</span>
              <span className="cta__icon">→</span>
            </a>
          </div>
        </article>
      </div>

      <div className="slider__controls">
        <ul className="slider__thumbs" role="tablist">
          {slides.map((s, i) => (
            <li key={i}>
              <button
                className={`thumb${i === active ? ' is-active' : ''}`}
                style={{ '--c': s.c1 }}
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}: ${s.title}`}
              />
            </li>
          ))}
        </ul>
        <div className="slider__count">{pad(active)} / {pad(slides.length - 1)}</div>
        <div className="slider__arrows">
          <button className="arrow" aria-label="Previous" onClick={prev}>&lt;</button>
          <button className="arrow" aria-label="Next" onClick={next}>&gt;</button>
        </div>
      </div>
    </section>
  )
}
