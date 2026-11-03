// Mirror planes, after molkit's symmetry finder: a mirror swaps two like atoms, so its normal
// is their difference. Planar molecules' own plane is skipped; the hero only needs methane's σd.
const TOLERANCE = 0.1 // Å

const sub = (p, q) => p.map((v, i) => v - q[i])
const dot = (p, q) => p.reduce((s, v, i) => s + v * q[i], 0)
const unit = (p) => p.map((v) => v / Math.hypot(...p))

// A mirror plane through the centroid as { normal, up }: `up` points at the outermost atom
// lying in the plane, or null if the molecule has none.
export function mirrorPlane(atoms) {
  const c = atoms.reduce((s, a) => s.map((v, i) => v + a.pos[i] / atoms.length), [0, 0, 0])
  const pos = atoms.map((a) => sub(a.pos, c))
  const reflect = (p, n) => p.map((v, i) => v - 2 * dot(p, n) * n[i])
  const isMirror = (n) =>
    pos.every((p, i) => {
      const q = reflect(p, n)
      return pos.some((r, j) => atoms[j].el === atoms[i].el && Math.hypot(...sub(q, r)) < TOLERANCE)
    })

  for (let i = 0; i < pos.length; i++)
    for (let j = i + 1; j < pos.length; j++) {
      if (atoms[i].el !== atoms[j].el) continue
      const normal = unit(sub(pos[i], pos[j]))
      if (!isMirror(normal)) continue
      const inPlane = pos.filter((p) => Math.abs(dot(p, normal)) < TOLERANCE && Math.hypot(...p) > TOLERANCE)
      const far = inPlane.sort((p, q) => Math.hypot(...q) - Math.hypot(...p))[0]
      if (far) return { normal, up: unit(sub(far, normal.map((v) => v * dot(far, normal)))) }
    }
  return null
}
