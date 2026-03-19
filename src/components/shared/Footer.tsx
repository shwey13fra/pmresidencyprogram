'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function ContactPopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:text-primary transition-colors cursor-pointer text-sm text-slate"
      >
        Contact
      </button>

      {open && (
        <div className="absolute bottom-8 right-0 w-64 bg-white border border-gray-100 rounded-xl shadow-lg p-5 z-50">
          <p className="text-xs text-slate uppercase tracking-widest mb-4">Get in touch</p>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate/60 mb-0.5">Phone</p>
              <a
                href="tel:+917829946117"
                className="text-sm text-primary hover:text-accent transition-colors"
              >
                +91 78299 46117
              </a>
            </div>
            <div>
              <p className="text-xs text-slate/60 mb-0.5">Email</p>
              <a
                href="mailto:hello@micropmresidency.in"
                className="text-sm text-primary hover:text-accent transition-colors"
              >
                hello@micropmresidency.in
              </a>
            </div>
            <div>
              <p className="text-xs text-slate/60 mb-0.5">Office</p>
              <p className="text-sm text-primary">
                91 Springboard, Koramangala,<br />Bengaluru, Karnataka 560034
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate text-sm">Built for aspiring PMs in India.</p>
        <div className="flex items-center gap-6 text-sm text-slate">
          <Link href="/apply" className="hover:text-primary transition-colors">
            Apply
          </Link>
          <Link href="/status" className="hover:text-primary transition-colors">
            Check Status
          </Link>
          <ContactPopover />
        </div>
        <p className="text-xs text-slate/60">A Micro-PM Residency initiative</p>
      </div>
    </footer>
  )
}
