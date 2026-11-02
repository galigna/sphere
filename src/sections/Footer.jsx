import { PROJECT_LINKS, SECTIONS } from '../content.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <p className="h3">Sphere</p>
          <p className="body-s">3D-printed puzzles of real molecules for chemistry classrooms.</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <div>
            <p className="overline">Sections</p>
            {SECTIONS.map(([id, text]) => <a key={id} href={`#${id}`}>{text}</a>)}
          </div>
          <div>
            <p className="overline">Project</p>
            {PROJECT_LINKS.map(([text, href]) => <a key={text} href={href}>{text}</a>)}
          </div>
        </nav>
      </div>
      <div className="footer__bottom caption">
        <p>© 2026 Sphere · Chicago, IL</p>
        <p>
          Molecule data from <a href="https://pubchem.ncbi.nlm.nih.gov">PubChem</a> · Built with{' '}
          <a href="https://github.com/galigna/rhino-molkit">molkit</a> (open source)
        </p>
      </div>
    </footer>
  )
}
