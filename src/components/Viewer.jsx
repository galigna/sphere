import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Icon } from './Icon.jsx'

const MoleculeViewer = lazy(() => import('../viewer/MoleculeViewer.jsx'))

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')

function useReducedMotion() {
  const [reduced, setReduced] = useState(motionQuery.matches)
  useEffect(() => {
    const on = (e) => setReduced(e.matches)
    motionQuery.addEventListener('change', on)
    return () => motionQuery.removeEventListener('change', on)
  }, [])
  return reduced
}

// Three.js loads only once a viewer is about to scroll into view.
function useNear(ref) {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])
  return near
}

class NoWebGL extends Component {
  state = { failed: false }
  static getDerivedStateFromError = () => ({ failed: true })
  render() {
    return this.state.failed ? <p className="viewer__fallback">3D view needs WebGL</p> : this.props.children
  }
}

export default function Viewer({ molecule, pieces, symmetry, label, interactive = true, className = '' }) {
  const ref = useRef()
  const near = useNear(ref)
  const reducedMotion = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)

  return (
    <div
      ref={ref}
      className={`viewer ${interactive ? '' : 'viewer--static'} ${className}`}
      role="img"
      aria-label={label}
      tabIndex={interactive ? 0 : undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      // A drag focuses the viewer too; only keyboard focus should keep it paused.
      onFocus={(e) => setFocus(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocus(false)}
    >
      {near && molecule && (
        <NoWebGL>
          <Suspense fallback={null}>
            <MoleculeViewer
              molecule={molecule}
              pieces={pieces}
              symmetry={symmetry}
              paused={hover || focus}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </NoWebGL>
      )}
      {interactive && (
        <span className="viewer__hint" aria-hidden="true">
          <Icon name="rotate" /> drag to rotate
        </span>
      )}
    </div>
  )
}
