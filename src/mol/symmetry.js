// Symmetry elements, after molkit's symmetry finder. Just what the hero needs: mirror planes and
// the highest-order rotation axes.
const TOLERANCE = 0.1 // Å

const sub = (p, q) => p.map((v, i) => v - q[i])
const dot = (p, q) => p.reduce((s, v, i) => s + v * q[i], 0)
const cross = ([a, b, c], [x, y, z]) => [b * z - c * y, c * x - a * z, a * y - b * x]
const unit = (p) => p.map((v) => v / Math.hypot(...p))

// Atom positions about the centroid, and whether a map of them lands every atom on a like one.
function centred(atoms) {
  const c = atoms.reduce((s, a) => s.map((v, i) => v + a.pos[i] / atoms.length), [0, 0, 0])
  const pos = atoms.map((a) => sub(a.pos, c))
  const keeps = (map) =>
    pos.every((p, i) => {
      const q = map(p)
      return pos.some((r, j) => atoms[j].el === atoms[i].el && Math.hypot(...sub(q, r)) < TOLERANCE)
    })
  return { pos, keeps }
}

// A mirror swaps two like atoms, so its normal is their difference. Planar molecules' own plane
// is skipped; the hero only needs methane's six σd.
// Returns [{ normal, up }]: `up` points at the outermost atom lying in the plane, or is null.
export function mirrorPlanes(atoms) {
  const { pos, keeps } = centred(atoms)
  const planes = []
  for (let i = 0; i < pos.length; i++)
    for (let j = i + 1; j < pos.length; j++) {
      if (atoms[i].el !== atoms[j].el) continue
      const n = unit(sub(pos[i], pos[j]))
      if (planes.some((p) => Math.abs(Math.abs(dot(p.normal, n)) - 1) < 1e-6)) continue
      if (!keeps((p) => p.map((v, k) => v - 2 * dot(p, n) * n[k]))) continue
      const inPlane = pos.filter((p) => Math.abs(dot(p, n)) < TOLERANCE && Math.hypot(...p) > TOLERANCE)
      const far = inPlane.sort((p, q) => Math.hypot(...q) - Math.hypot(...p))[0]
      planes.push({ normal: n, up: far ? unit(sub(far, n.map((v) => v * dot(far, n)))) : null })
    }
  return planes
}

// An axis runs through an atom or the midpoint of two like atoms. Returns the unit directions of
// the highest-order axes (methane: its four C₃, one along each C–H), or [] if there are none.
export function principalAxes(atoms) {
  const { pos, keeps } = centred(atoms)
  const candidates = pos.flatMap((p, i) => [p, ...pos.slice(i + 1).map((q) => p.map((v, k) => (v + q[k]) / 2))])
  const axes = []
  for (const c of candidates) {
    if (Math.hypot(...c) < TOLERANCE) continue
    const k = unit(c)
    if (axes.some((a) => Math.abs(Math.abs(dot(a.k, k)) - 1) < 1e-6)) continue
    const order = [6, 5, 4, 3, 2].find((n) => keeps((p) => rotate(p, k, (2 * Math.PI) / n)))
    if (order) axes.push({ k, order })
  }
  const top = Math.max(...axes.map((a) => a.order))
  return axes.filter((a) => a.order === top).map((a) => a.k)
}

// Rodrigues' rotation of p about unit axis k.
function rotate(p, k, angle) {
  const [cos, sin] = [Math.cos(angle), Math.sin(angle)]
  const kxp = cross(k, p)
  return p.map((v, i) => v * cos + kxp[i] * sin + k[i] * dot(k, p) * (1 - cos))
}
