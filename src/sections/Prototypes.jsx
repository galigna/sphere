import { PROTOTYPES } from '../content.js'

export default function Prototypes() {
  return (
    <section className="section" id="prototypes">
      <h2 className="h1">Physical prototypes</h2>
      <ul className="carousel" tabIndex={0} aria-label="Prototype photos">
        {PROTOTYPES.map((p, i) => (
          <li key={i} className="tile">
            {p.src ? (
              <img src={p.src} alt={p.alt} width="420" height="420" loading="lazy" />
            ) : (
              <span className="caption">photo coming soon</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
