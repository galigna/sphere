import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon.jsx'
import { SECTIONS } from '../content.js'

// Trackpads jitter by a few pixels, which shouldn't flip the direction.
const SCROLL_SLOP = 8
const ALWAYS_SHOWN_ABOVE = 100

export default function Header() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      if (Math.abs(scrollY - last) < SCROLL_SLOP) return
      setHidden(scrollY > last && scrollY > ALWAYS_SHOWN_ABOVE)
      last = scrollY
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const close = (e) => e.target.closest('a') && e.currentTarget.removeAttribute('open')
  return (
    <header className="header" data-hidden={hidden || undefined}>
      <a className="header__brand h3" href="#top">Sphere</a>
      <nav className="header__nav" aria-label="Sections">
        {SECTIONS.map(([id, text]) => (
          <a key={id} className="btn" href={`#${id}`}>{text}</a>
        ))}
      </nav>
      <details className="header__menu" onClick={close}>
        <summary aria-label="Menu"><Icon name="menu" size={20} /></summary>
        <nav aria-label="All sections">
          {SECTIONS.map(([id, text]) => (
            <a key={id} href={`#${id}`}>{text}</a>
          ))}
        </nav>
      </details>
    </header>
  )
}
