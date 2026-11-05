import { REFERENCES } from '../content.js'

export default function Problem() {
  return (
    <>
      <section className="section" id="problem">
        <h2 className="h1">The problem</h2>
        <div className="problem__body">
          <p className="body-l">
            Chemistry is a structural science taught on flat pages. Students meet mirror planes, rotation axes, inversion
            centers, and protein folds through 2D drawings, and many never form a working 3D understanding of them.
            Teachers feel this most: showing a symmetry element on a whiteboard is slow, and the model kits most schools
            own are built for bonding, not for symmetry or other difficult topics. This makes learning unnecessarily
            hard.
          </p>
          <ul className="problem__refs">
            {REFERENCES.map(([text, href]) => (
              <li key={href}>
                <a href={href}>{text}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Lines break only between sentences. */}
      <p className="tagline h3">
        Pick&nbsp;a&nbsp;molecule. Print&nbsp;the&nbsp;pieces. Build&nbsp;it&nbsp;in&nbsp;class.
      </p>
    </>
  )
}
