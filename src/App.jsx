import Hero from './components/Hero'
import MemoryGame from './components/MemoryGame'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <Hero />
      <MemoryGame />
      <footer className="px-6 py-10 text-center text-white/60">
        Built with an interactive 3D cover and a clean, modern memory game. Have fun!
      </footer>
    </div>
  )
}

export default App
