import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'
import Goals from './sections/Goals.jsx'
import Header from './sections/Header.jsx'
import Hero from './sections/Hero.jsx'
import HowItWorks from './sections/HowItWorks.jsx'
import Problem from './sections/Problem.jsx'
import Prototypes from './sections/Prototypes.jsx'
import Team from './sections/Team.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#prototypes">Skip to content</a>
      <Header />
      <main className="content">
        <Hero />
        <Prototypes />
        <Problem />
        <HowItWorks />
        <Team />
        <Goals />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
