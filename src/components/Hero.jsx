import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/ESO6PnMadasO0hU3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Glass overlay content */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 md:p-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow">
            Picture Memory
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 md:text-lg">
            Flip cards, find pairs, and chase your best time.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Interactive</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Modern</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">Vibrant</span>
          </div>
        </div>
      </div>

      {/* Gradient tint overlay - ensure interaction remains */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
    </section>
  )
}
