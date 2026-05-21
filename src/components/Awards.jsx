const awards = [
  { name: 'Cannes Lions', wins: '2 Awards', noms: '9 Shortlists', icon: '★' },
  { name: 'D&AD',         wins: '5 Pencils', noms: '18 Nominations', icon: '▣' },
  { name: 'Clio',         wins: '3 Awards', noms: '11 Nominations', icon: '◈' },
  { name: 'One Show',     wins: '4 Awards', noms: '14 Nominations', icon: '◯' },
]

export default function Awards() {
  return (
    <section className="awards">
      <ul className="awards__list">
        {awards.map(a => (
          <li key={a.name}>
            <h4>{a.name}</h4>
            <p>{a.wins}<br />{a.noms}</p>
            <div className="awards__icon">{a.icon}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
