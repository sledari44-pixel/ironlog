import { useState, useEffect } from 'react'
import EntryScreen from './components/EntryScreen'
import RestTimer from './components/RestTimer'
import HistoryScreen from './components/HistoryScreen'
import { fetchTodaysSets } from './lib/supabase'

// Screen states: 'entry' | 'rest' | 'history'

export default function App() {
  const [screen, setScreen] = useState('entry')
  const [lastSet, setLastSet] = useState(null)
  const [todaysSets, setTodaysSets] = useState([])
  const [tab, setTab] = useState('entry') // bottom nav tab

  // Form state lives here so it persists through rest timer
  const [workout, setWorkout] = useState('')
  const [lift, setLift] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  // Load today's sets on mount
  useEffect(() => {
    fetchTodaysSets()
      .then(setTodaysSets)
      .catch(console.error)
  }, [])

  const handleSetLogged = (saved) => {
    setLastSet(saved)
    setTodaysSets(prev => [saved, ...prev])
    setScreen('rest')
  }

  const handleRestDone = () => {
    setScreen('entry')
  }

  const handleTabChange = (t) => {
    setTab(t)
    if (t === 'history') setScreen('history')
    else if (t === 'entry') setScreen('entry')
  }

  return (
    <div className="app">
      {/* Main screen content */}
      {screen === 'entry' && (
        <EntryScreen
          onSetLogged={handleSetLogged}
          todaysSets={todaysSets}
          workout={workout} setWorkout={setWorkout}
          lift={lift} setLift={setLift}
          weight={weight} setWeight={setWeight}
          reps={reps} setReps={setReps}
        />
      )}

      {screen === 'rest' && (
        <RestTimer
          lastSet={lastSet}
          onDone={handleRestDone}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen />
      )}

      {/* Bottom nav — hidden during rest timer */}
      {screen !== 'rest' && (
        <nav className="nav">
          <button
            className={`nav-btn${tab === 'entry' ? ' active' : ''}`}
            onClick={() => handleTabChange('entry')}
          >
            <span className="nav-icon">🏋️</span>
            Log
          </button>
          <button
            className={`nav-btn${tab === 'history' ? ' active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            <span className="nav-icon">📋</span>
            History
          </button>
        </nav>
      )}
    </div>
  )
}
