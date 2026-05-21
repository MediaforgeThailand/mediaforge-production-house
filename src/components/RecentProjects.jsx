const projects = [
  { color: '#c85a4a', tag: 'Film',         title: 'Northern Light' },
  { color: '#3b2a4a', tag: 'Commercial',   title: 'City Pulse' },
  { color: '#d4a04a', tag: 'Branded',      title: 'Field Notes' },
  { color: '#4a6a3a', tag: 'Music Video',  title: 'Glass House' },
]

export default function RecentProjects() {
  return (
    <section className="shop" id="news">
      <div className="shop__intro">
        <h2>Recent Projects</h2>
        <p>A selection of films, commercials, and collaborations from the past season.</p>
        <a href="#" className="cta cta--dark">
          <span className="cta__label">View All Work</span>
          <span className="cta__icon">↗</span>
        </a>
      </div>

      <div className="shop__rail">
        {projects.map(p => (
          <article className="card" key={p.title}>
            <div className="card__media" style={{ '--c': p.color }} />
            <span className="card__tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <a href="#" className="card__link">View Project →</a>
          </article>
        ))}
      </div>
    </section>
  )
}
