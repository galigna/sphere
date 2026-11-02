const SUB = '₀₁₂₃₄₅₆₇₈₉'

// Hill order: C, then H, then the rest alphabetically; purely alphabetical without carbon.
export function formula(atoms) {
  const counts = {}
  for (const { el } of atoms) counts[el] = (counts[el] ?? 0) + 1
  const rank = (el) => ('C' in counts ? { C: 0, H: 1 }[el] ?? 2 : 2)
  return Object.keys(counts)
    .sort((x, y) => rank(x) - rank(y) || x.localeCompare(y))
    .map((el) => el + (counts[el] > 1 ? [...String(counts[el])].map((d) => SUB[d]).join('') : ''))
    .join('')
}
