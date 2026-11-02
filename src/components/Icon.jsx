// 24px stroke icons, matching icon/* in Figma.
const PATHS = {
  rotate: 'M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  code: 'm8 8-4 4 4 4M16 8l4 4-4 4',
  menu: 'M4 7h16M4 12h16M4 17h16',
}

export function Icon({ name, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
