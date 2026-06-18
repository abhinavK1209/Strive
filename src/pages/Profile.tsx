import Nav from '../components/Nav'
import { Flow, useModal } from '../components/Modal'

function ContactFlow() {
  return (
    <Flow>
      {({ complete }) => (
        <>
          <p>
            As a verified coach you can register interest in Avery Scott. They
            can respond and schedule a call once interest is shown.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={() =>
              complete(
                'Interest sent to Avery Scott. They can now respond and schedule a call.',
              )
            }
          >
            Send Interest
          </button>
        </>
      )}
    </Flow>
  )
}

export default function Profile() {
  const { showModal } = useModal()

  const contactAthlete = () => showModal('Contact Avery Scott', <ContactFlow />)

  return (
    <>
      <Nav cta={{ to: '/coach', label: 'Coach Feed' }} />
      <main>
        <section className="section">
          <div className="header">
            <div>
              <p className="eyebrow">Recruit profile</p>
              <h2>Avery Scott</h2>
            </div>
          </div>
          <div className="grid profilePage">
            <article className="panel">
              <div className="heroImg"></div>
              <h3>Snapshot</h3>
              <p>
                Soccer | Forward | Class of 2026 | Durham Academy | Durham, NC
              </p>
              <div className="stats">
                <span>
                  <strong>22</strong>Goals
                </span>
                <span>
                  <strong>11</strong>Assists
                </span>
                <span>
                  <strong>3.9</strong>GPA
                </span>
                <span>
                  <strong>4.61</strong>40-yard
                </span>
              </div>
              <p>
                Explosive forward with strong first touch, direct attacking
                instincts, and leadership experience as team captain.
              </p>
            </article>
            <article className="panel">
              <h3>Achievements</h3>
              <ul>
                <li>All-state nominee</li>
                <li>Club national showcase finalist</li>
                <li>Academic honor roll</li>
              </ul>
            </article>
            <article className="panel">
              <h3>Coach Interest</h3>
              <p>
                Visible to verified coaches after they save or request contact
                with the athlete.
              </p>
              <button className="button primary" onClick={contactAthlete}>
                Contact Athlete
              </button>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
