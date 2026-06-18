import { useMemo, useState } from 'react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

export interface Slot {
  date: string
  time: string
}

interface SchedulerProps {
  confirmLabel: string
  onConfirm: (slot: Slot) => void
}

export default function Scheduler({ confirmLabel, onConfirm }: SchedulerProps) {
  const days = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() + i + 1)
      const weekday = WEEKDAYS[d.getDay()]
      return {
        key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        weekday,
        day: d.getDate(),
        label: `${weekday} ${d.getMonth() + 1}/${d.getDate()}`,
      }
    })
  }, [])

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const ready = Boolean(date && time)

  return (
    <div className="scheduler">
      <div className="calDays" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button
            type="button"
            key={d.key}
            className={date === d.label ? 'calDay active' : 'calDay'}
            aria-pressed={date === d.label}
            aria-label={`${d.weekday} the ${d.day}`}
            onClick={() => setDate(d.label)}
          >
            <span>{d.weekday}</span>
            <strong>{d.day}</strong>
          </button>
        ))}
      </div>
      <div className="slots" role="group" aria-label="Choose a time">
        {TIMES.map((t) => (
          <button
            type="button"
            key={t}
            className={time === t ? 'slot active' : 'slot'}
            aria-pressed={time === t}
            onClick={() => setTime(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="schedulerHint" aria-live="polite">
        {ready ? `Selected ${date} at ${time}` : 'Pick a day and a time to continue.'}
      </p>
      <button
        type="button"
        className="button primary"
        disabled={!ready}
        onClick={() => onConfirm({ date, time })}
      >
        {confirmLabel}
      </button>
    </div>
  )
}
