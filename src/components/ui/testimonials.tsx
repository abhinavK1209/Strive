import { Fragment, useState } from 'react'

interface Testimonial {
  text: string
  name: string
  role: string
  img?: string
}

const testimonials: Testimonial[] = [
  {
    text: 'I booked a mentor on Strive and had film review by the weekend. Two coaches reached out within a month.',
    name: 'Jordan Reed',
    role: 'WR, Class of 2027',
    img: '/img/avatar-8.jpg',
  },
  {
    text: 'The coach feed is exactly how I want to scout. Vertical highlights, real stats, and I can reach out first.',
    name: 'Coach Daniels',
    role: 'D1 Recruiting Coordinator',
    img: '/img/avatar-2.jpg',
  },
  {
    text: 'Mentoring on Strive pays for my off-season. Setting my own rate and managing sessions is effortless.',
    name: 'Cam Porter',
    role: 'UNC Football, Mentor',
    img: '/img/avatar-3.jpg',
  },
  {
    text: 'The meal and training plans gave my daughter structure she actually follows. Huge difference.',
    name: 'Renee Collins',
    role: 'Parent of a recruit',
    img: '/img/avatar-6.jpg',
  },
  {
    text: 'I found a guard from my own conference through the feed and signed her after one call.',
    name: 'Coach Alvarez',
    role: 'College Basketball',
    img: '/img/avatar-1.jpg',
  },
  {
    text: 'Scheduling used to be a mess of DMs. Now my mentees just pick a slot on my calendar.',
    name: 'Leah Mitchell',
    role: 'Duke Basketball, Mentor',
    img: '/img/avatar-7.jpg',
  },
  {
    text: 'My profile finally shows everything in one place. It is the link I send to every program.',
    name: 'Avery Scott',
    role: 'Forward, Class of 2026',
    img: '/img/avatar-4.jpg',
  },
  {
    text: 'Verified profiles mean I am not chasing dead ends. The talent on here is real.',
    name: 'Coach Whitfield',
    role: 'College Soccer',
    img: '/img/avatar-5.jpg',
  },
  {
    text: 'From highlight upload to first coach view took three days. Strive just works.',
    name: 'Sasha Coleman',
    role: 'PG, Class of 2026',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

function Avatar({ img, name }: { img?: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (!img || failed) {
    return <span className="testiAvatar">{initials(name)}</span>
  }
  return (
    <img
      className="testiAvatar"
      src={img}
      alt={name}
      loading="lazy"
      width={42}
      height={42}
      onError={() => setFailed(true)}
    />
  )
}

function Column({
  items,
  duration = 26,
  className,
}: {
  items: Testimonial[]
  duration?: number
  className?: string
}) {
  return (
    <div className={className ? `testiCol ${className}` : 'testiCol'}>
      <ul className="testiList" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((t, i) => (
              <li className="testiCard" key={`${dup}-${i}`} aria-hidden={dup === 1}>
                <p>{t.text}</p>
                <div className="testiFoot">
                  <Avatar img={t.img} name={t.name} />
                  <div>
                    <div className="testiName">{t.name}</div>
                    <div className="testiRole">{t.role}</div>
                  </div>
                </div>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}

export function TestimonialsSection() {
  const first = testimonials.slice(0, 3)
  const second = testimonials.slice(3, 6)
  const third = testimonials.slice(6, 9)

  return (
    <section className="section soft" id="testimonials">
      <h2>Athletes, mentors, and coaches love Strive.</h2>
      <div className="testiMarquee">
        <Column items={first} duration={26} />
        <Column items={second} duration={32} className="hideMd" />
        <Column items={third} duration={29} className="hideLg" />
      </div>
    </section>
  )
}
