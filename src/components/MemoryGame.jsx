import { useEffect, useMemo, useState } from 'react'

// Simple emoji set to avoid external assets
const EMOJIS = ['🍎','🚀','🎧','🧩','🌊','🔥','🌈','🎯','🛸','🖥️','🎮','🎨']

function shuffle(array) {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function prepareDeck(size) {
  const pairs = size / 2
  const pool = shuffle(EMOJIS).slice(0, pairs)
  const deck = shuffle([...pool, ...pool]).map((value, index) => ({
    id: index,
    value,
    flipped: false,
    matched: false,
  }))
  return deck
}

export default function MemoryGame() {
  const [size, setSize] = useState(12) // 6 pairs default
  const [deck, setDeck] = useState(() => prepareDeck(12))
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [bestTime, setBestTime] = useState(() => {
    const key = `memory-best-${12}`
    const v = localStorage.getItem(key)
    return v ? Number(v) : null
  })

  // Timer
  useEffect(() => {
    let rAF
    if (startTime && deck.some(c => !c.matched)) {
      const tick = () => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
        rAF = requestAnimationFrame(tick)
      }
      rAF = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rAF)
  }, [startTime, deck])

  const pairsLeft = useMemo(() => deck.filter(c => !c.matched).length / 2, [deck])

  function reset(newSize = size) {
    const s = Math.max(4, Math.min(24, newSize - (newSize % 2))) // even 4..24
    setSize(s)
    const newDeck = prepareDeck(s)
    setDeck(newDeck)
    setFirst(null)
    setSecond(null)
    setMoves(0)
    setLocked(false)
    setStartTime(Date.now())
    setElapsed(0)
    const key = `memory-best-${s}`
    const v = localStorage.getItem(key)
    setBestTime(v ? Number(v) : null)
  }

  useEffect(() => {
    // start game on mount
    setStartTime(Date.now())
  }, [])

  function handleFlip(card) {
    if (locked || card.flipped || card.matched) return

    const newDeck = deck.map(c => (c.id === card.id ? { ...c, flipped: true } : c))
    setDeck(newDeck)

    if (!first) {
      setFirst(card)
      return
    }

    if (!second) {
      setSecond(card)
      setLocked(true)
      setMoves(m => m + 1)

      const firstCard = newDeck.find(c => c.id === first.id)
      const secondCard = newDeck.find(c => c.id === card.id)

      if (firstCard.value === secondCard.value) {
        // match
        setTimeout(() => {
          setDeck(d => d.map(c => (c.value === firstCard.value ? { ...c, matched: true } : c)))
          setFirst(null)
          setSecond(null)
          setLocked(false)
        }, 300)
      } else {
        // mismatch
        setTimeout(() => {
          setDeck(d => d.map(c => (c.id === firstCard.id || c.id === secondCard.id ? { ...c, flipped: false } : c)))
          setFirst(null)
          setSecond(null)
          setLocked(false)
        }, 700)
      }
    }
  }

  // Detect win
  useEffect(() => {
    if (deck.length > 0 && deck.every(c => c.matched)) {
      const time = elapsed
      const key = `memory-best-${size}`
      if (!bestTime || time < bestTime) {
        localStorage.setItem(key, String(time))
        setBestTime(time)
      }
    }
  }, [deck, elapsed, size, bestTime])

  return (
    <section className="relative z-10 -mt-12 md:-mt-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-white text-2xl font-bold">Memory Game</h2>
              <p className="text-white/80 text-sm">Flip cards to find pairs. Finish fast to beat your best time.</p>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">
                Moves: <span className="font-semibold">{moves}</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">
                Time: <span className="font-semibold">{elapsed}s</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/20">
                Best: <span className="font-semibold">{bestTime ?? '-'}{bestTime != null ? 's' : ''}</span>
              </div>
              <button onClick={() => reset(size)} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors">Restart</button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4">
            {deck.map(card => (
              <button
                key={card.id}
                onClick={() => handleFlip(card)}
                className={`relative aspect-square rounded-xl select-none focus:outline-none focus:ring-2 focus:ring-blue-400/70 transition-transform ${
                  card.matched ? 'ring-2 ring-green-400/70' : ''
                }`}
                style={{ perspective: '800px' }}
              >
                <div className={`w-full h-full rounded-xl border border-white/20 [transform-style:preserve-3d] transition-transform duration-300 ${
                  card.flipped || card.matched ? '[transform:rotateY(180deg)]' : ''
                }`}>
                  {/* Front */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center [backface-visibility:hidden]">
                    <span className="text-2xl md:text-3xl">❓</span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-fuchsia-500/80 rounded-xl flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-white/20 shadow-inner">
                    <span className="text-2xl md:text-3xl">{card.value}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <label className="opacity-90">Cards:</label>
              <select
                value={size}
                onChange={(e) => reset(Number(e.target.value))}
                className="bg-white/10 border border-white/20 rounded-md px-2 py-1"
              >
                {[12, 16, 20, 24].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button onClick={() => reset(size)} className="text-blue-300 hover:text-white">Shuffle deck</button>
          </div>
        </div>
      </div>
    </section>
  )
}
