import { useEffect, useRef, useState } from 'react'
import { formula } from '../mol/formula.js'
import { LookupError, PRESETS, loadMolecule } from '../mol/pubchem.js'
import { Icon } from './Icon.jsx'
import Viewer from './Viewer.jsx'

const HINT = 'methane'

export default function MoleculeDemo() {
  const [molecule, setMolecule] = useState(null)
  const [value, setValue] = useState('')
  const [state, setState] = useState('idle') // idle | loading | error
  const [message, setMessage] = useState('')
  const [hover, setHover] = useState(false)
  const [pieces, setPieces] = useState(false)
  const request = useRef()

  const load = async (name) => {
    if (!name.trim()) return
    request.current?.abort()
    const ctrl = (request.current = new AbortController())
    setState('loading')
    setMessage(`loading ${name}…`)
    try {
      const mol = await loadMolecule(name, { signal: ctrl.signal })
      setMolecule(mol)
      setValue(mol.name)
      setState('idle')
      setMessage(`${mol.name} loaded, ${mol.atoms.length} atoms`)
    } catch (e) {
      if (ctrl.signal.aborted) return
      setState('error')
      setMessage(e instanceof LookupError ? e.message : 'could not read that molecule')
      setValue('')
    }
  }

  useEffect(() => void loadMolecule(HINT).then(setMolecule), [])

  const showHint = hover && !value && state !== 'loading'
  const placeholder = state === 'error' ? message : state === 'loading' ? message : showHint ? HINT : 'type a molecule'

  return (
    <div className="demo">
      <div className="demo__stage">
        <Viewer
          molecule={molecule}
          pieces={pieces}
          label={molecule ? `3D model of ${molecule.name}, ${formula(molecule.atoms)}` : 'loading 3D model'}
        />
        {molecule && (
          <p className="demo__caption">
            <strong>{molecule.name}</strong> · {formula(molecule.atoms)} · prints as{' '}
            <strong>{molecule.atoms.length} pieces</strong>
          </p>
        )}
        <button className="chip demo__pieces" aria-pressed={pieces} onClick={() => setPieces(!pieces)}>
          {pieces ? 'assemble' : 'pieces'}
        </button>
      </div>

      <form
        className="mol-input"
        data-state={state}
        onSubmit={(e) => (e.preventDefault(), load(value))}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <input
          aria-label="Molecule name"
          value={state === 'loading' ? '' : value}
          placeholder={placeholder}
          disabled={state === 'loading'}
          onChange={(e) => (setValue(e.target.value), state === 'error' && setState('idle'))}
          onKeyDown={(e) => {
            if (showHint && (e.key === 'Tab' || e.key === 'ArrowRight')) {
              e.preventDefault()
              setValue(HINT)
            }
          }}
          autoComplete="off"
          spellCheck="false"
        />
        <button aria-label="Load molecule" disabled={state === 'loading'}>
          <Icon name="arrow" size={20} />
        </button>
      </form>

      <ul className="demo__presets" aria-label="Try one">
        {PRESETS.map((name) => (
          <li key={name}>
            <button className="chip" onClick={() => load(name)}>
              {name}
            </button>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  )
}
