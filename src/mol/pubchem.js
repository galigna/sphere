import { parseSdf } from './sdf.js'

export const PRESETS = ['methane', 'water', 'ammonia', 'benzene', 'caffeine', 'aspirin']

export const MESSAGES = {
  notFound: 'molecule not found',
  no3d: 'no 3D model for this one',
  network: 'PubChem is not answering',
}

const url = (name) =>
  `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/SDF?record_type=3d`

export class LookupError extends Error {}

const cache = new Map()

export async function loadMolecule(rawName, { signal, fetch = globalThis.fetch } = {}) {
  const name = rawName.trim().toLowerCase()
  if (!cache.has(name)) {
    const src = PRESETS.includes(name) ? `${import.meta.env.BASE_URL}molecules/${name}.sdf` : url(name)
    cache.set(name, { name, ...parseSdf(await getText(src, fetch, signal)) })
  }
  return cache.get(name)
}

async function getText(src, fetch, signal) {
  let res
  try {
    res = await fetch(src, { signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)].filter(Boolean)) })
  } catch (e) {
    if (signal?.aborted) throw e
    throw new LookupError(MESSAGES.network)
  }
  if (res.ok) return res.text()
  // PubChem answers 404 both for unknown names and for compounds without a 3D conformer
  // (it only computes those for small, fairly rigid molecules); only the body tells them apart.
  if (res.status === 404) {
    const body = await res.text()
    throw new LookupError(body.includes('No CID found') ? MESSAGES.notFound : MESSAGES.no3d)
  }
  throw new LookupError(MESSAGES.network)
}
