const ITEMS = [
  {
    title: "A portfolio-ready recommendation deck",
    desc: "Your team's deck, built on a real startup's problem with real user insights. Not a case study — real work.",
    icon: "◈",
  },
  {
    title: "Written feedback from a practising PM",
    desc: "The startup's PM writes a specific feedback summary for your team. What you got right, what you missed, how a PM would think about it differently.",
    icon: "◎",
  },
  {
    title: "A residency summary for your resume",
    desc: "A one-page document stating the startup you worked with, the problem you tackled, and what you recommended. Link it on LinkedIn.",
    icon: "◉",
  },
]

export default function WhatYouGet() {
  return (
    <section className="py-20 px-6 bg-primary">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
          What you walk away with
        </h2>
        <p className="text-white/60 mb-12 text-lg">
          Proof you can do this. Not a certificate.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {ITEMS.map((item) => (
            <div key={item.title} className="border-t border-white/20 pt-8">
              <span className="text-accent text-2xl">{item.icon}</span>
              <h3 className="text-white font-semibold text-lg mt-4 mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
