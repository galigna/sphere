import { TEAM } from '../content.js'

const initials = (name) => name.split(' ').map((w) => w[0]).join('')

export default function Team() {
  return (
    <section className="section" id="team">
      <h2 className="h1">Team</h2>
      <ul className="members">
        {TEAM.map((m) => (
          <li key={m.name} className="member">
            <figure className="member__photo">
              {m.photo ? (
                <img className="tile" src={m.photo} alt="" width="240" height="240" loading="lazy" />
              ) : (
                <span className="tile h2" aria-hidden="true">{initials(m.name)}</span>
              )}
              <figcaption className="body-m">{m.name}</figcaption>
            </figure>
            <p className="body-m">
              <strong>{m.role}</strong>
              <br />
              {m.bio}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
