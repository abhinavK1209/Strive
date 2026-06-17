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

  return (
    <div className="scheduler">
      <div className="calDays">
        {days.map((d) => (
          <button
            type="button"
            key={d.key}
            className={date === d.label ? 'calDay active' : 'calDay'}
            onClick={() => setDate(d.label)}
          >
            <span>{d.weekday}</span>
            <strong>{d.day}</strong>
          </button>
        ))}
      </div>
      <div className="slots">
        {TIMES.map((t) => (
          <button
            type="button"
            key={t}
            className={time === t ? 'slot active' : 'slot'}
            onClick={() => setTime(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="button primary"
        disabled={!date || !time}
        onClick={() => onConfirm({ date, time })}
      >
        {confirmLabel}
      </button>
    </div>
  )
}
