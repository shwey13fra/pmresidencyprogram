import Link from 'next/link'

export default function ConfirmationScreen() {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="font-display text-3xl text-primary mb-3">
        Application received!
      </h2>
      <p className="text-slate text-base max-w-sm mb-8 leading-relaxed">
        We review every application personally. You&apos;ll hear from us within
        48 hours via email.
      </p>

      <div className="bg-card border border-gray-100 rounded-xl p-6 text-left w-full max-w-sm mb-8">
        <p className="text-sm text-slate mb-2">In case you miss our email:</p>
        <Link
          href="/status"
          className="text-accent font-medium text-sm hover:underline"
        >
          Check your application status anytime →
        </Link>
      </div>

      <Link href="/" className="text-sm text-slate hover:text-primary transition-colors">
        ← Back to home
      </Link>
    </div>
  )
}
