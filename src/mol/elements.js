// Same table as molkit core/elements.py: van der Waals radius (Å, Bondi) and Jmol CPK colour.
const TABLE = {
  H: [1.2, 0xffffff],
  Li: [1.82, 0xcc80ff],
  B: [1.92, 0xffb5b5],
  C: [1.7, 0x909090],
  N: [1.55, 0x3050f8],
  O: [1.52, 0xff0d0d],
  F: [1.47, 0x90e050],
  Na: [2.27, 0xab5cf2],
  Mg: [1.73, 0x8aff00],
  Al: [1.84, 0xbfa6a6],
  Si: [2.1, 0xf0c8a0],
  P: [1.8, 0xff8000],
  S: [1.8, 0xffff30],
  Cl: [1.75, 0x1ff01f],
  K: [2.75, 0x8f40d4],
  Ca: [2.31, 0x3dff00],
  Ni: [1.63, 0x50d050],
  Cu: [1.4, 0xc88033],
  Zn: [1.39, 0x7d80b0],
  Ga: [1.87, 0xc28f8f],
  As: [1.85, 0xbd80e3],
  Se: [1.9, 0xffa100],
  Br: [1.85, 0xa62929],
  Pd: [1.63, 0x006985],
  Ag: [1.72, 0xc0c0c0],
  Cd: [1.58, 0xffd98f],
  Sn: [2.17, 0x668080],
  I: [1.98, 0x940094],
  Pt: [1.72, 0xd0d0e0],
  Au: [1.66, 0xffd123],
  Hg: [1.55, 0xb8b8d0],
  Pb: [2.02, 0x575961],
}

// molkit raises on unknown elements; a web page should still draw something.
const UNKNOWN = [1.8, 0xff1493]

export const element = (symbol) => {
  const [vdw, color] = TABLE[symbol] ?? UNKNOWN
  return { vdw, color }
}
