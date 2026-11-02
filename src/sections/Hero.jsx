import { useEffect, useState } from 'react'
import Viewer from '../components/Viewer.jsx'
import { loadMolecule } from '../mol/pubchem.js'

export default function Hero() {
  const [methane, setMethane] = useState(null)
  useEffect(() => void loadMolecule('methane').then(setMethane), [])
  return (
    <section className="hero" id="top">
      <Viewer className="hero__viewer" molecule={methane} ring label="3D model of methane, CH₄" />
      <div className="hero__text">
        <h1 className="display">Sphere</h1>
        <p className="body-l">
          3D-printed puzzles of real molecules that help teachers show students the 3D structure and symmetry a flat
          page can't.
        </p>
      </div>
    </section>
  )
}
