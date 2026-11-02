import { Icon } from '../components/Icon.jsx'
import { NAV, SECTIONS } from '../content.js'

const label = Object.fromEntries(SECTIONS)

export default function Header() {
  const close = (e) => e.target.closest('a') && e.currentTarget.removeAttribute('open')
  return (
    <header className="header">
      <a className="header__brand h3" href="#top">Sphere</a>
      <nav className="header__nav" aria-label="Sections">
        {NAV.map((id) => (
          <a key={id} className="btn" href={`#${id}`}>{label[id]}</a>
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
