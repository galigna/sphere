export const SECTIONS = [
  ['prototypes', 'Prototypes'],
  ['problem', 'The problem'],
  ['how', 'How it works'],
  ['team', 'Team'],
  ['goals', 'Our goals'],
  ['contact', 'Contact'],
]

export const REFERENCES = [
  ['Penny et al. J. Chem. Educ. 2017, 94, 1265.', 'https://doi.org/10.1021/acs.jchemed.6b00953'],
  ['Niece. J. Chem. Educ. 2019, 96, 2059.', 'https://doi.org/10.1021/acs.jchemed.9b00053'],
]

export const STEPS = [
  ['Real data in', 'Any molecule from PubChem or a crystal structure file (CIF).'],
  ['Puzzle out', 'One piece per atom, with pegs whose shapes match the bond type plus extra pieces for the topic, such as symmetry axes.'],
  ['Students build it', 'They rebuild the molecule by hand and see patterns themselves.'],
]

const media = (name) => `${import.meta.env.BASE_URL}prototypes/${name}`

// `video` items are silent loops (like GIFs, at a 20th of the size); `src` is their poster.
export const PROTOTYPES = [
  { src: media('mof.jpg'), video: media('mof.mp4'), alt: 'A team member turning a printed metal–organic framework lattice' },
  { src: media('water.jpg'), alt: 'A printed water molecule, red oxygen and blue hydrogens, on a clear symmetry rod' },
  { src: media('water-symmetry.jpg'), video: media('water-symmetry.mp4'), alt: 'Hands taking apart and rejoining the water puzzle pieces' },
  { src: media('printing-loop.jpg'), video: media('printing.mp4'), alt: 'Resin prints curing under blue light' },
  { src: media('printing.jpg'), alt: 'A clear resin print with its supports on the printer platform' },
  { src: media('cif.jpg'), alt: 'A clear resin crystal lattice printed from a CIF file, held in one hand' },
  { src: media('molecule.jpg'), alt: 'A grey printed molecule with rings and methyl groups, held in one hand' },
]

export const TEAM = [
  {
    name: 'Mariia Novikova',
    role: 'Science',
    photo: `${import.meta.env.BASE_URL}team/mariia.jpg`,
    bio: "Studies crystallography at Lake Forest College and takes part in MIT's MICRO program. Leads the science behind the project.",
  },
  {
    name: 'Galina Ignatova',
    role: 'Software and design',
    photo: `${import.meta.env.BASE_URL}team/galina.jpg`,
    bio: 'Designs and tests Sphere’s models and the software that generates them, molkit. Leads the development of the learning platform and AR app.',
  },
]

export const GOALS = [
  {
    when: 'Now',
    title: 'Puzzle kits',
    text: 'Symmetry, protein, MOF and General Chemistry kits. Being tested now; first classroom pilot at Lake Forest College.',
    status: 'in testing',
    active: true,
  },
  { when: 'Next', title: 'Learning platform', text: 'A website with quizzes, tutorials and background for each kit.', status: 'planned' },
  { when: 'Later', title: 'AR app', text: 'Used beside the kit: animate an inversion step and show facts about the molecule.', status: 'future' },
]

const MOLKIT = 'https://github.com/galigna/rhino-molkit'
const EMAIL = 'novikovamst18@lakeforest.edu'

export const CONTACTS = [
  { icon: 'mail', label: 'Email Mariia', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: 'code', label: 'molkit source code (GitHub)', value: 'galigna/rhino-molkit', href: MOLKIT },
]

export const PROJECT_LINKS = [
  ['molkit on GitHub', MOLKIT],
  ['Releases', `${MOLKIT}/releases`],
  ['Email us', `mailto:${EMAIL}`],
]
