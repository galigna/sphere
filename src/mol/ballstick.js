import { element } from './elements.js'

// molkit's FDM preset: ball = 0.25 × vdW radius; 3.5 mm stick at 20 mm/Å.
const BALL_FACTOR = 0.25
const STICK_RADIUS = 0.175

const sub = (p, q) => p.map((v, i) => v - q[i])
const mid = (p, q) => p.map((v, i) => (v + q[i]) / 2)

// Balls and half-sticks in Å, centred on the centroid. Each half-stick runs from its atom
// to the bond midpoint in that atom's colour, like the printed pieces.
export function ballStick({ atoms, bonds }) {
  const c = atoms.reduce((s, a) => s.map((v, i) => v + a.pos[i] / atoms.length), [0, 0, 0])
  const pos = atoms.map((a) => sub(a.pos, c))
  const balls = atoms.map((a, i) => ({
    center: pos[i],
    radius: element(a.el).vdw * BALL_FACTOR,
    color: element(a.el).color,
  }))
  const sticks = bonds.flatMap(({ a, b }) =>
    [a, b].map((i) => ({
      atom: i,
      start: pos[i],
      end: mid(pos[a], pos[b]),
      radius: STICK_RADIUS,
      color: element(atoms[i].el).color,
    })),
  )
  const radius = Math.max(...balls.map((b) => Math.hypot(...b.center) + b.radius))
  return { balls, sticks, radius }
}
