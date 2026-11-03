import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BufferGeometry, Matrix4, PMREMGenerator, Quaternion, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ballStick } from '../mol/ballstick.js'
import { mirrorPlanes, principalAxes } from '../mol/symmetry.js'
import BallStick, { EXPLODE } from './BallStick.jsx'

const FOV = 30
const KEY_STEP = Math.PI / 16
const RING = 1.25
const TILT_RETURN = 0.8 // per second
// The camera looks down a little, so the molecule doesn't sit dead-on.
const ELEVATION = 0.18
const REST_POLAR = Math.PI / 2 - ELEVATION

export default function MoleculeViewer({ molecule, pieces = false, symmetry = false, paused, reducedMotion }) {
  const box = useRef()
  const [visible, setVisible] = useState(true)
  const { radius } = useMemo(() => ballStick(molecule), [molecule])
  const orientation = useMemo(() => (symmetry ? onMirror(molecule) : new Quaternion()), [molecule, symmetry])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // Fit the bounding sphere, with room for the exploded pieces and the symmetry elements.
  const extent = Math.max(radius + (pieces ? EXPLODE : 0), symmetry ? radius * RING : 0)
  const distance = (extent * 1.15) / Math.sin(((FOV / 2) * Math.PI) / 180)

  return (
    <div ref={box} className="viewer__canvas">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 2]}
        // The hero canvas is CSS-rotated; measure its layout size, not its rotated bounding box.
        resize={{ offsetSize: true }}
        camera={{ fov: FOV, position: [0, Math.sin(ELEVATION), Math.cos(ELEVATION)] }}
        gl={{ alpha: true, antialias: true }}
      >
        <Environment />
        <Camera distance={distance} />
        <group quaternion={orientation}>
          <BallStick molecule={molecule} pieces={pieces} instant={reducedMotion} />
          {symmetry && <Planes molecule={molecule} radius={radius * RING} />}
          {symmetry && <Axes molecule={molecule} length={radius * RING} />}
        </group>
        <Controls autoRotate={!paused && !reducedMotion} />
      </Canvas>
    </div>
  )
}

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => (env.dispose(), pmrem.dispose())
  }, [gl, scene])
  return <directionalLight position={[3, 4, 5]} intensity={1.2} />
}

function Camera({ distance }) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.setLength(distance)
  }, [camera, distance])
  return null
}

// Turn a mirror plane onto the screen, with its in-plane atom pointing up the spin axis.
function onMirror(molecule) {
  const plane = mirrorPlanes(molecule.atoms).find((p) => p.up)
  if (!plane) return new Quaternion()
  const n = new Vector3(...plane.normal)
  const up = new Vector3(...plane.up)
  const x = new Vector3().crossVectors(up, n)
  return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, up, n).transpose())
}

// Each mirror plane is drawn by its dashed rim, as molkit draws them.
function Planes({ molecule, radius }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2
      return new Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
    })
    return new BufferGeometry().setFromPoints(points)
  }, [radius])
  const turns = useMemo(
    () =>
      mirrorPlanes(molecule.atoms).map(({ normal }) =>
        new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), new Vector3(...normal)),
      ),
    [molecule],
  )
  return turns.map((q, i) => (
    <line key={i} geometry={geometry} quaternion={q} onUpdate={(l) => l.computeLineDistances()}>
      <lineDashedMaterial color="white" transparent opacity={0.35} dashSize={0.12} gapSize={0.1} />
    </line>
  ))
}

// The highest-order rotation axes, as thin lines through the centre that reach the ring.
function Axes({ molecule, length }) {
  const geometry = useMemo(() => {
    const ends = principalAxes(molecule.atoms).flatMap((k) => {
      const v = new Vector3(...k).multiplyScalar(length)
      return [v.clone().negate(), v]
    })
    return new BufferGeometry().setFromPoints(ends)
  }, [molecule, length])
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="white" transparent opacity={0.35} />
    </lineSegments>
  )
}

function Controls({ autoRotate }) {
  const { camera, gl } = useThree()
  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement)
    Object.assign(c, { enablePan: false, enableZoom: false, autoRotateSpeed: 0.8 })
    return c
  }, [camera, gl])
  controls.autoRotate = autoRotate

  useFrame((_, dt) => {
    // Ease the tilt back to the starting view while auto-rotating.
    if (autoRotate) controls.rotateUp((controls.getPolarAngle() - REST_POLAR) * Math.min(1, dt * TILT_RETURN))
    controls.update(dt)  })

  useEffect(() => {
    const el = gl.domElement.closest('.viewer')
    // OrbitControls only binds arrow keys to panning, so rotate by hand.
    const onKey = (e) => {
      const turn = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]
      if (!turn) return
      e.preventDefault()
      controls.rotateLeft(turn[0] * KEY_STEP)
      controls.rotateUp(turn[1] * KEY_STEP)
    }
    el?.addEventListener('keydown', onKey)
    return () => (el?.removeEventListener('keydown', onKey), controls.dispose())
  }, [controls, gl])

  return null
}
