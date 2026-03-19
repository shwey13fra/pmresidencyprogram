import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import StatusChecker from '@/components/status/StatusChecker'

export const metadata = {
  title: 'Check your status — Micro-PM Residency',
}

export default function StatusPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center mb-10">
          <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">
            Application status
          </p>
          <h1 className="font-display text-4xl text-primary mb-3">
            Check your status
          </h1>
          <p className="text-slate">
            Enter the email address you applied with.
          </p>
        </div>
        <StatusChecker />
      </main>
      <Footer />
    </>
  )
}
