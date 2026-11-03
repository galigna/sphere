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
            A printed kit needs no power, software or internet in class. Schools can get a ready-made kit or
            ready-to-print files for a standard desktop 3D printer.
          </p>
        </div>
      </div>
      <div className="card how__card">
        <MoleculeDemo />
      </div>
    </section>
  )
}
