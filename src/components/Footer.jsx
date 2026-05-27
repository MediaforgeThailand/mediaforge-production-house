const socials = ['Instagram', 'Vimeo', 'YouTube', 'LinkedIn']
const legal = ['Privacy', 'Terms', 'Contact']

export default function Footer() {
  return (
    <footer className="site-footer">
      <a className="site-logo" href="#" aria-label="Home">
        <img
          className="site-logo__image"
          src="/assets/brand/studio-logo.png"
          alt="MediaForge"
        />
      </a>
      <ul className="socials">
        {socials.map(s => <li key={s}><a href="#">{s}</a></li>)}
      </ul>
      <ul className="legal">
        {legal.map(l => <li key={l}><a href="#">{l}</a></li>)}
      </ul>
      <p className="copyright">© MEDIAFORGE 2026. All Rights Reserved</p>
    </footer>
  )
}
