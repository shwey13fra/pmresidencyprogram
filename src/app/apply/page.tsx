import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ApplicationForm from '@/components/apply/ApplicationForm'

export const metadata = {
  title: 'Apply — Micro-PM Residency',
}

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-10">
            <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">
              April 11–13, 2026
            </p>
            <h1 className="font-display text-4xl text-primary mb-3">
              Apply for the residency
            </h1>
            <p className="text-slate leading-relaxed">
              Takes 5 minutes. We read every application personally.
            </p>
          </div>

          <ApplicationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
