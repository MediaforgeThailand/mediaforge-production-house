import { useEffect, useState } from 'react'

const links = [
  { href: '#films', label: 'Animated Films ▾' },
  { href: '#liveaction', label: 'Live Action' },
  { href: '#about', label: 'Who We Are' },
  { href: '#contact', label: 'Contact Us' },
]

export default function Header() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 200 && y > lastY)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${hidden ? ' is-hidden' : ''}`}>
      <div className="site-header__inner">
        <a href="#" className="site-logo" aria-label="Home">
          <img
            className="site-logo__image"
            src="/assets/brand/studio-logo.png"
            alt="MediaForge"
          />
        </a>
        <nav className="primary-nav">
          <ul>
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} className="reveal-mask">
                  <span className="reveal-inner">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
