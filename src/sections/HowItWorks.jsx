import MoleculeDemo from '../components/MoleculeDemo.jsx'
import { STEPS } from '../content.js'

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="how__text">
        <h2 className="h1">How it works</h2>
        <div className="how__body">
          <ol className="how__steps body-l">
            {STEPS.map(([lead, text]) => (
              <li key={lead}>
                <strong>{lead}</strong>. {text}
              </li>
            ))}
          </ol>
          <p className="body-l">
            Models are generated ready to print, with no CAD knowledge needed, so a kit on any topic can be generated
            with our library, molkit, and printed on a standard 3D printer. Custom plugins will add elements unique to
            each topic, such as symmetry or proteins.
          </p>
        </div>
      </div>
      <div className="card how__card">
        <MoleculeDemo />
      </div>
    </section>
  )
}
