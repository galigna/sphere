import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ballStick } from '../src/mol/ballstick.js'
import { formula } from '../src/mol/formula.js'
import { mirrorPlane } from '../src/mol/mirror.js'
import { LookupError, MESSAGES, loadMolecule } from '../src/mol/pubchem.js'
import { parseSdf } from '../src/mol/sdf.js'

const fixture = (name) => readFileSync(new URL(`fixtures/${name}.sdf`, import.meta.url), 'utf8')
const dist = (p, q) => Math.hypot(...p.map((v, i) => v - q[i]))

describe('parseSdf', () => {
  it('reads methane: 5 atoms, 4 single bonds, tetrahedral', () => {
    const { atoms, bonds } = parseSdf(fixture('methane'))
    expect(atoms.map((a) => a.el)).toEqual(['C', 'H', 'H', 'H', 'H'])
    expect(bonds.every((b) => b.a === 0 && b.order === 1)).toBe(true)
    const [c, h1, h2] = atoms.map((a) => a.pos)
    const v1 = h1.map((v, i) => v - c[i])
    const v2 = h2.map((v, i) => v - c[i])
    const cos = v1.reduce((s, v, i) => s + v * v2[i], 0) / (dist(h1, c) * dist(h2, c))
    expect((Math.acos(cos) * 180) / Math.PI).toBeCloseTo(109.5, 0)
  })

  it('keeps benzene bond orders', () => {
    const orders = parseSdf(fixture('benzene')).bonds.map((b) => b.order)
    expect(orders.filter((o) => o === 2)).toHaveLength(3)
  })

  it('rejects non-molfiles', () => {
    expect(() => parseSdf('nope')).toThrow()
  })
})

describe('mirrorPlane', () => {
  it("finds a methane σd through C and two H's", () => {
    const { atoms } = parseSdf(fixture('methane'))
    const { normal, up } = mirrorPlane(atoms)
    const c = atoms[0].pos
    const offPlane = atoms.map((a) => Math.abs(a.pos.reduce((s, v, i) => s + (v - c[i]) * normal[i], 0)))
    expect(offPlane.filter((d) => d < 0.01)).toHaveLength(3)
    expect(Math.abs(up.reduce((s, v, i) => s + v * normal[i], 0))).toBeLessThan(1e-9)
  })
})

describe('formula', () => {
  it('uses Hill order', () => {
    const atoms = (s) => s.split('').map((el) => ({ el }))
    expect(formula(atoms('OCHHHHOC'))).toBe('C₂H₄O₂')
    expect(formula(atoms('HHO'))).toBe('H₂O')
  })
})

describe('ballStick', () => {
  it('splits every bond at its midpoint, one half per atom', () => {
    const { balls, sticks } = ballStick(parseSdf(fixture('methane')))
    expect(sticks).toHaveLength(8)
    expect(balls[0].center.every((v) => Math.abs(v) < 0.01)).toBe(true)
    const [toH, toC] = sticks
    expect(toH.end).toEqual(toC.end)
    expect(dist(toH.start, toH.end)).toBeCloseTo(dist(toC.start, toC.end), 6)
  })
})

describe('loadMolecule', () => {
  const reply = (status, body) => async () => new Response(body, { status })
  const fails = (name, fetch) => expect(loadMolecule(name, { fetch })).rejects.toThrow(LookupError)

  it('parses a PubChem answer', async () => {
    const mol = await loadMolecule('Methane-ish', { fetch: reply(200, fixture('methane')) })
    expect(mol.atoms).toHaveLength(5)
  })

  it('maps PubChem errors to messages', async () => {
    await fails('x1', reply(404, 'PUGREST.NotFound No CID found'))
    await expect(loadMolecule('x2', { fetch: reply(404, 'No records') })).rejects.toThrow(MESSAGES.no3d)
    await expect(loadMolecule('x3', { fetch: reply(503, '') })).rejects.toThrow(MESSAGES.network)
    await expect(
      loadMolecule('x4', { fetch: async () => { throw new TypeError('offline') } }),
    ).rejects.toThrow(MESSAGES.network)
  })
})
