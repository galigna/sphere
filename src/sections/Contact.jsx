import { Icon } from '../components/Icon.jsx'
import { CONTACTS } from '../content.js'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <h2 className="h1">Contact</h2>
      <ul className="contacts">
        {CONTACTS.map((c) => (
          <li key={c.href}>
            <a className="contact-card" href={c.href}>
              <span className="contact-card__icon"><Icon name={c.icon} size={20} /></span>
              <span className="contact-card__text">
                <span className="caption">{c.label}</span>
                {/* Let a long email break after the @ on narrow phones. */}
                <span className="body-m">{c.value.replace('@', '@​')}</span>
              </span>
              <Icon name="arrowUpRight" size={20} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
