import { useState } from 'react'
import Nav from '../components/Nav'
import { useModal } from '../components/Modal'
import { money } from '../data'

export default function MentorDashboard() {
  const { showModal } = useModal()
  const [price, setPrice] = useState(80)
  const fee = price * 0.15

  const manageAvailability = () =>
    showModal('Manage Availability', (
      <p>This prototype simulates the workflow visually for investor and user demos.</p>
    ))

  return (
    <>
      <Nav cta={{ to: '/athlete', label: 'Athlete View' }} />
      <main>
        <section className="section soft">
          <div className="header">
            <div>
              <p className="eyebrow">College athlete mentor dashboard</p>
              <h2>Mentorship business center</h2>
            </div>
            <button className="button dark" onClick={manageAvailability}>
              Manage Availability
            </button>
          </div>
          <div className="grid dash">
            <article className="panel profile">
              <div className="profileRow">
                <span className="avatar">CP</span>
                <div>
                  <h3>Cam Porter</h3>
                  <p>UNC Football | Defensive Back</p>
                  <small>ACC starter, team captain, 4.0 mentor rating</small>
                </div>
              </div>
            </article>
            <article className="panel">
              <h3>Pricing Setup</h3>
              <label>
                Session price{' '}
                <input
                  id="price"
                  type="range"
                  min="25"
                  max="150"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </label>
              <div className="earn">
                <span>Gross</span>
                <strong id="gross">{money(price)}</strong>
              </div>
              <div className="earn">
                <span>15% platform fee</span>
                <strong id="fee">{money(fee)}</strong>
              </div>
              <div className="earn net">
                <span>Net payout</span>
                <strong id="net">{money(price - fee)}</strong>
              </div>
            </article>
            <article className="panel wide">
              <h3>Session Types</h3>
              <div className="chips">
                <span>Recruiting Advice</span>
                <span>Film Review</span>
                <span>Training Advice</span>
                <span>Nutrition Advice</span>
                <span>College Life Q&amp;A</span>
              </div>
            </article>
            <article className="panel">
              <h3>Booking Requests</h3>
              <div className="request">
                <strong>Jordan Reed</strong>
                <span>Film review, 45 minutes</span>
                <button className="mini">Accept</button>
              </div>
            </article>
            <article className="panel">
              <h3>Upcoming Sessions</h3>
              <div className="session">
                <strong>Avery Scott</strong>
                <span>Sunday, 3:30 PM</span>
                <small>Nutrition advice for tournament week</small>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
