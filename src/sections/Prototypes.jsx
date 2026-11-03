import { useState } from 'react'
import { PROTOTYPES } from '../content.js'

export default function Prototypes() {
  const [end, setEnd] = useState(false)
  const onScroll = (e) => {
    const el = e.currentTarget
    setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }
  return (
    <section className="section" id="prototypes">
      <h2 className="h1">Physical prototypes</h2>
      <ul
        className={`carousel${end ? ' carousel--end' : ''}`}
        tabIndex={0}
        aria-label="Prototype photos"
        onScroll={onScroll}
      >
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
