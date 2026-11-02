import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BufferGeometry, PMREMGenerator, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ballStick } from '../mol/ballstick.js'
import BallStick, { EXPLODE } from './BallStick.jsx'

const FOV = 30
const KEY_STEP = Math.PI / 16

export default function MoleculeViewer({ molecule, pieces = false, ring = false, paused, reducedMotion }) {
  const box = useRef()
  const [visible, setVisible] = useState(true)
  const { radius } = useMemo(() => ballStick(molecule), [molecule])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // Fit the bounding sphere, with room for the exploded pieces.
  const distance = ((radius + (pieces ? EXPLODE : 0)) * 1.2) / Math.sin(((FOV / 2) * Math.PI) / 180)

  return (
    <div ref={box} className="viewer__canvas">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ fov: FOV, position: [0, 0, distance] }}
        gl={{ alpha: true, antialias: true }}
      >
        <Environment />
        <Camera distance={distance} />
        <BallStick molecule={molecule} pieces={pieces} instant={reducedMotion} />
        {ring && <Ring radius={radius * 1.25} />}
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

// The dashed orbit from the Figma hero.
function Ring({ radius }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2
      return new Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
    })
    return new BufferGeometry().setFromPoints(points)
  }, [radius])
  return (
    <line geometry={geometry} rotation={[0.18, 0, 0.12]} onUpdate={(l) => l.computeLineDistances()}>
      <lineDashedMaterial color="white" transparent opacity={0.35} dashSize={0.12} gapSize={0.1} />
    </line>
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

  useFrame((_, dt) => controls.update(dt))

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
