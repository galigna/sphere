import { useState } from 'react'
import { PROTOTYPES } from '../content.js'

const still = matchMedia('(prefers-reduced-motion: reduce)').matches

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
        {PROTOTYPES.map((p) => (
          <li key={p.src} className="tile">
            {p.video ? (
              <video
                src={p.video}
                poster={p.src}
                aria-label={p.alt}
                width="420"
                height="420"
                muted
                loop
                playsInline
                autoPlay={!still}
                controls={still}
              />
            ) : (
              <img src={p.src} alt={p.alt} width="420" height="420" loading="lazy" />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
