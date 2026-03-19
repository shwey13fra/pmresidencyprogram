'use client'
import { useState } from 'react'
import { FAQ_ITEMS } from '@/utils/constants'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-primary mb-12">
          Questions
        </h2>

        <div className="divide-y divide-gray-100">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="py-5">
              <button
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-primary">{item.question}</span>
                <span
                  className={`text-slate text-xl shrink-0 transition-transform duration-200 select-none ${
                    openIndex === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === i ? '200px' : '0px' }}
              >
                <p className="text-slate text-sm leading-relaxed mt-3">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
