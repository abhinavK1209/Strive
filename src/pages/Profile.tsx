import Nav from '../components/Nav'

export default function Profile() {
  return (
    <>
      <Nav cta={{ to: '/coach', label: 'Coach Feed' }} />
      <main>
        <section className="section">
          <p className="eyebrow">Athlete profile page</p>
          <h2>Complete recruit profile</h2>
          <div className="grid profilePage">
            <article className="panel">
              <div className="heroImg"></div>
              <h3>Avery Scott</h3>
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
              <button className="button primary">Contact Athlete</button>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
