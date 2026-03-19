import Button from '@/components/shared/Button'
import CountdownTimer from './CountdownTimer'
import SpotsRemaining from './SpotsRemaining'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary leading-tight mb-6">
            Real product experience.{' '}
            <span className="text-accent">One weekend.</span>
          </h1>

          <p className="text-slate text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Work on a real startup&apos;s product problem. Lead a team. Present
            to their PM. Walk away with proof you can do this.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-card border border-gray-100 rounded-xl w-fit">
            <CountdownTimer />
            <div className="hidden sm:block w-px bg-gray-100" />
            <SpotsRemaining />
          </div>

          <Button href="/apply" className="text-base px-8 py-4">
            Apply for the next cohort →
          </Button>

          <p className="mt-4 text-sm text-slate">
            April 11–13, 2026 · Online · Free for the first cohort
          </p>
        </div>
      </div>
    </section>
  )
}
