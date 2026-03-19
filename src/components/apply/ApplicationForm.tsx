'use client'
import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/shared/Button'
import ConfirmationScreen from './ConfirmationScreen'

const ROLE_OPTIONS = [
  'Student',
  'Software Engineer',
  'Designer',
  'Data Analyst',
  'Marketing / Growth',
  'Operations',
  'Business Analyst',
  'Other',
]

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function wordCountColor(count: number) {
  if (count >= 150 && count <= 250) return 'text-success'
  if (count > 250) return 'text-accent'
  return 'text-slate'
}

interface FormFields {
  name: string
  email: string
  phone: string
  current_role: string
  linkedin_url: string
  why_pm: string
  product_answer: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  current_role?: string
  linkedin_url?: string
  why_pm?: string
  product_answer?: string
  form?: string
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}

  if (!fields.name.trim()) errors.name = 'Full name is required.'
  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^\d{10}$/.test(fields.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number.'
  }
  if (!fields.current_role) errors.current_role = 'Please select your current role.'
  if (fields.linkedin_url.trim()) {
    try {
      new URL(fields.linkedin_url.trim())
    } catch {
      errors.linkedin_url = 'Enter a valid URL (e.g. https://linkedin.com/in/yourname).'
    }
  }
  if (!fields.why_pm.trim()) {
    errors.why_pm = 'This field is required.'
  } else if (fields.why_pm.trim().length < 100) {
    errors.why_pm = `At least 100 characters required (${fields.why_pm.trim().length} so far).`
  }
  if (!fields.product_answer.trim()) {
    errors.product_answer = 'This field is required.'
  } else if (fields.product_answer.trim().length < 150) {
    errors.product_answer = `At least 150 characters required (${fields.product_answer.trim().length} so far).`
  }

  return errors
}

const EMPTY: FormFields = {
  name: '',
  email: '',
  phone: '',
  current_role: '',
  linkedin_url: '',
  why_pm: '',
  product_answer: '',
}

export default function ApplicationForm() {
  const [fields, setFields] = useState<FormFields>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const isRequiredFilled =
    fields.name.trim() &&
    fields.email.trim() &&
    fields.phone.trim() &&
    fields.current_role &&
    fields.why_pm.trim() &&
    fields.product_answer.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'duplicate_email') {
          setErrors({
            form: 'DUPLICATE',
          })
        } else {
          setErrors({ form: data.error ?? 'Something went wrong. Please try again.' })
        }
        return
      }

      setSubmitted(true)
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <ConfirmationScreen />

  const productWordCount = countWords(fields.product_answer)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Form-level error */}
      {errors.form && (
        <div className="bg-error/5 border border-error/20 rounded-lg px-4 py-3 text-sm text-error">
          {errors.form === 'DUPLICATE' ? (
            <>
              You&apos;ve already applied! Check your status{' '}
              <Link href="/status" className="underline font-medium">
                here
              </Link>
              .
            </>
          ) : (
            errors.form
          )}
        </div>
      )}

      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Full name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={fields.name}
          onChange={set('name')}
          placeholder="Priya Sharma"
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
            errors.name ? 'border-error' : 'border-gray-200'
          }`}
        />
        {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Email address <span className="text-error">*</span>
        </label>
        <input
          type="email"
          value={fields.email}
          onChange={set('email')}
          placeholder="priya@example.com"
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
            errors.email ? 'border-error' : 'border-gray-200'
          }`}
        />
        {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Phone number <span className="text-error">*</span>
        </label>
        <div className="flex">
          <span className="flex items-center px-4 py-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-slate text-sm font-mono">
            +91
          </span>
          <input
            type="tel"
            value={fields.phone}
            onChange={set('phone')}
            placeholder="9876543210"
            maxLength={10}
            className={`flex-1 px-4 py-3 rounded-r-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
              errors.phone ? 'border-error' : 'border-gray-200'
            }`}
          />
        </div>
        {errors.phone && <p className="mt-1.5 text-xs text-error">{errors.phone}</p>}
      </div>

      {/* Current role */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Current role <span className="text-error">*</span>
        </label>
        <select
          value={fields.current_role}
          onChange={set('current_role')}
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
            errors.current_role ? 'border-error' : 'border-gray-200'
          } ${!fields.current_role ? 'text-slate/50' : ''}`}
        >
          <option value="" disabled>
            Select your role
          </option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.current_role && (
          <p className="mt-1.5 text-xs text-error">{errors.current_role}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          LinkedIn URL{' '}
          <span className="text-slate font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={fields.linkedin_url}
          onChange={set('linkedin_url')}
          placeholder="https://linkedin.com/in/yourname"
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors ${
            errors.linkedin_url ? 'border-error' : 'border-gray-200'
          }`}
        />
        {errors.linkedin_url && (
          <p className="mt-1.5 text-xs text-error">{errors.linkedin_url}</p>
        )}
      </div>

      {/* Why PM */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Why do you want to transition to product management?{' '}
          <span className="text-error">*</span>
        </label>
        <textarea
          value={fields.why_pm}
          onChange={set('why_pm')}
          rows={5}
          placeholder="Tell us what's driving this interest..."
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors resize-none ${
            errors.why_pm ? 'border-error' : 'border-gray-200'
          }`}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.why_pm ? (
            <p className="text-xs text-error">{errors.why_pm}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-slate ml-auto">
            {fields.why_pm.trim().length} / 100 min chars
          </p>
        </div>
      </div>

      {/* Product answer */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Pick any app you use daily. Identify one problem in its experience
          and describe how you&apos;d approach solving it.{' '}
          <span className="text-error">*</span>
        </label>
        <p className="text-xs text-slate mb-2">
          Target: 200 words. Minimum: 150 characters.
        </p>
        <textarea
          value={fields.product_answer}
          onChange={set('product_answer')}
          rows={8}
          placeholder="I use Swiggy daily and noticed that..."
          className={`w-full px-4 py-3 rounded-lg border bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors resize-none ${
            errors.product_answer ? 'border-error' : 'border-gray-200'
          }`}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.product_answer ? (
            <p className="text-xs text-error">{errors.product_answer}</p>
          ) : (
            <span />
          )}
          <p className={`text-xs ml-auto font-mono ${wordCountColor(productWordCount)}`}>
            {productWordCount} words
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isRequiredFilled || submitting}
        className="w-full py-4 text-base"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit application →'
        )}
      </Button>

      <p className="text-xs text-slate text-center">
        By applying, you agree to be contacted via email about this cohort.
      </p>
    </form>
  )
}
