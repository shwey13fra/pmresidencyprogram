import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/landing/Hero'
import WeekendPreview from '@/components/landing/WeekendPreview'
import WhatYouGet from '@/components/landing/WhatYouGet'
import FAQ from '@/components/landing/FAQ'
import PastResidencies from '@/components/landing/PastResidencies'
import FadeIn from '@/components/shared/FadeIn'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FadeIn>
          <WeekendPreview />
        </FadeIn>
        <FadeIn>
          <WhatYouGet />
        </FadeIn>
        <FadeIn>
          <FAQ />
        </FadeIn>
        <FadeIn>
          <PastResidencies />
        </FadeIn>
      </main>
      <Footer />
    </>
  )
}
