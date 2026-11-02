// First record of an MDL V2000 molfile. PubChem 3D records carry explicit hydrogens,
// so unlike molkit there is nothing for RDKit to do here.
export function parseSdf(text) {
  const lines = text.split(/\r?\n/)
  const counts = lines[3] ?? ''
  if (!counts.includes('V2000')) throw new Error('not a V2000 molfile')
  const atomCount = +counts.slice(0, 3)
  const bondCount = +counts.slice(3, 6)

  const atoms = lines.slice(4, 4 + atomCount).map((l) => ({
    el: l.slice(31, 34).trim(),
    pos: [+l.slice(0, 10), +l.slice(10, 20), +l.slice(20, 30)],
  }))
  const bonds = lines.slice(4 + atomCount, 4 + atomCount + bondCount).map((l) => ({
    a: +l.slice(0, 3) - 1,
    b: +l.slice(3, 6) - 1,
    order: +l.slice(6, 9),
  }))
  if (atoms.length !== atomCount || bonds.length !== bondCount) throw new Error('truncated molfile')
  return { atoms, bonds }
}
