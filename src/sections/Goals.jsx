import { GOALS } from '../content.js'

export default function Goals() {
  return (
    <section className="section" id="goals">
      <h2 className="h1">Our goals</h2>
      <ol className="roadmap">
        {GOALS.map((g) => (
          <li key={g.title} className="step" data-active={g.active || undefined}>
            <span className="step__dot" aria-hidden="true" />
            <div className="step__body">
              <p className="overline">{g.when}</p>
              <h3 className="h3">{g.title}</h3>
              <p className="body-m">{g.text}</p>
              <span className="status">{g.status}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
