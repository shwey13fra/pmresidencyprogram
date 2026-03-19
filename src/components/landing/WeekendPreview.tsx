'use client'
import { useState } from 'react'
import { WEEKEND_SCHEDULE } from '@/utils/constants'

export default function WeekendPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
          What happens over the weekend
        </h2>
        <p className="text-slate mb-12 text-lg">Three focused sessions. Real work.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {WEEKEND_SCHEDULE.map((item, i) => (
            <div
              key={item.day}
              className="bg-card border border-gray-100 rounded-xl p-6 cursor-pointer hover:border-accent/40 transition-all duration-200"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-accent uppercase tracking-widest">
                    {item.day}
                  </span>
                  <p className="text-sm text-slate mt-1">{item.time}</p>
                </div>
                <span
                  className={`text-slate text-lg transition-transform duration-200 select-none ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </span>
              </div>

              <p className="text-primary font-medium leading-snug">
                {item.summary}
              </p>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === i ? '300px' : '0px' }}
              >
                <p className="text-slate text-sm leading-relaxed mt-4 pt-4 border-t border-gray-100">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
