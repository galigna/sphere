import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Matrix4, Quaternion, Vector3 } from 'three'
import { ballStick } from '../mol/ballstick.js'

const UP = new Vector3(0, 1, 0)
export const EXPLODE = 0.6 // Å each piece travels outward

const m = new Matrix4()
const q = new Quaternion()
const v = new Vector3()
const w = new Vector3()
const s = new Vector3()

export default function BallStick({ molecule, pieces, instant }) {
  const spec = useMemo(() => ballStick(molecule), [molecule])
  const balls = useRef()
  const sticks = useRef()
  const t = useRef(pieces ? 1 : 0)

  useLayoutEffect(() => {
    spec.balls.forEach((b, i) => balls.current.setColorAt(i, new Color(b.color)))
    spec.sticks.forEach((st, i) => sticks.current.setColorAt(i, new Color(st.color)))
    balls.current.instanceColor.needsUpdate = sticks.current.instanceColor.needsUpdate = true
    place(spec, balls.current, sticks.current, ease(t.current))
  }, [spec])

  useFrame((_, dt) => {
    const target = pieces ? 1 : 0
    if (t.current === target) return
    const step = instant ? 1 : dt * 2.5
    t.current = target > t.current ? Math.min(target, t.current + step) : Math.max(target, t.current - step)
    place(spec, balls.current, sticks.current, ease(t.current))
  })

  return (
    <group>
      <instancedMesh key={`b${spec.balls.length}`} ref={balls} args={[null, null, spec.balls.length]}>
        <sphereGeometry args={[1, 48, 32]} />
        <Material />
      </instancedMesh>
      <instancedMesh key={`s${spec.sticks.length}`} ref={sticks} args={[null, null, spec.sticks.length]}>
        <cylinderGeometry args={[1, 1, 1, 24, 1, true]} />
        <Material />
      </instancedMesh>
    </group>
  )
}

const Material = () => <meshPhysicalMaterial roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />

const ease = (x) => x * x * (3 - 2 * x)

// Every piece (a ball and its half-sticks) moves out along its own atom's direction from the centre.
function place({ balls, sticks }, ballMesh, stickMesh, t) {
  const shift = (center) => w.fromArray(center).normalize().multiplyScalar(EXPLODE * t)
  balls.forEach((b, i) => {
    v.fromArray(b.center).add(shift(b.center))
    ballMesh.setMatrixAt(i, m.compose(v, q.identity(), s.setScalar(b.radius)))
  })
  sticks.forEach((st, i) => {
    const off = shift(balls[st.atom].center).clone()
    const a = new Vector3().fromArray(st.start).add(off)
    const dir = new Vector3().fromArray(st.end).add(off).sub(a)
    q.setFromUnitVectors(UP, dir.clone().normalize())
    v.copy(a).addScaledVector(dir, 0.5)
    stickMesh.setMatrixAt(i, m.compose(v, q, s.set(st.radius, dir.length(), st.radius)))
  })
  ballMesh.instanceMatrix.needsUpdate = true
  stickMesh.instanceMatrix.needsUpdate = true
}
