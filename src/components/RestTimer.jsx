import { useState, useEffect, useRef } from 'react'

const REST_SECS = 90
const CIRCUMFERENCE = 2 * Math.PI * 88 // r=88

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function RestTimer({ lastSet, onDone }) {
  const [timeLeft, setTimeLeft] = useState(REST_SECS)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const progress = timeLeft / REST_SECS
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <>
      <div className="header">
        <div className="logo">Iron<span>Log</span></div>
        <div className="date-badge">Rest</div>
      </div>

      <div className="rest-screen">
        <div className="rest-label">
          {timeLeft === 0 ? 'Ready!' : 'Resting'}
        </div>

        {/* Ring timer */}
        <div className="timer-ring">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Track */}
            <circle
              cx="100" cy="100" r="88"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="100" cy="100" r="88"
              fill="none"
              stroke={timeLeft === 0 ? 'var(--green)' : 'var(--blue)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="timer-number">{fmt(timeLeft)}</div>
        </div>

        {/* Last set recap */}
        {lastSet && (
          <div className="last-set-card">
            <span className={`badge badge-${lastSet.workout_type}`}>{lastSet.workout_type}</span>
            <div className="last-set-lift">{lastSet.lift}</div>
            <div className="last-set-detail">{lastSet.weight_lbs} lbs × {lastSet.reps} reps</div>
          </div>
        )}

        <button className="btn btn-success" onClick={onDone}>
          {timeLeft === 0 ? '🏋️ Next set' : 'Done resting — next set'}
        </button>

        <button className="skip-btn" onClick={onDone}>
          Skip timer
        </button>
      </div>
    </>
  )
}
