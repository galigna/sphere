import { useRef, useState } from 'react'
import { PROTOTYPES } from '../content.js'

const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const GLIDE_MS = 500

export default function Prototypes() {
  const [end, setEnd] = useState(false)
  const [dragging, setDragging] = useState(false)
  const grab = useRef(null)
  const glide = useRef()
  const onScroll = (e) => {
    const el = e.currentTarget
    setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }
  // Touch and touchpads already scroll natively; a mouse wheel can't scroll sideways, so mice drag.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button || e.target.controls) return
    const el = e.currentTarget
    clearTimeout(glide.current)
    grab.current = { x: e.clientX, left: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onPointerMove = (e) => {
    if (grab.current) e.currentTarget.scrollLeft = grab.current.left - (e.clientX - grab.current.x)
  }
  // Glide to the nearest photo first: turning mandatory snap back on mid-way makes it jump.
  const onRelease = (e) => {
    if (!grab.current) return
    grab.current = null
    const el = e.currentTarget
    const [a, b] = el.children
    const step = b.offsetLeft - a.offsetLeft
    const max = el.scrollWidth - el.clientWidth
    const left = Math.min(Math.round(el.scrollLeft / step) * step, max)
    el.scrollTo({ left, behavior: still ? 'auto' : 'smooth' })
    glide.current = setTimeout(() => setDragging(false), still ? 0 : GLIDE_MS)
  }
  return (
    <section className="section" id="prototypes">
      <h2 className="h1">Physical prototypes</h2>
      <ul
        className={`carousel${end ? ' carousel--end' : ''}${dragging ? ' carousel--dragging' : ''}`}
        tabIndex={0}
        aria-label="Prototype photos"
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onLostPointerCapture={onRelease}
        onDragStart={(e) => e.preventDefault()}
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
