import React, { useEffect, useRef } from 'react'
import { Layout } from 'antd'

import HeaderSection from './components/HeaderSection'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import RolesSection from './components/RolesSection'
import BenefitsSection from './components/BenefitsSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'

import './index.scss'
import './styles/index.scss'

const LandingPage = () => {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => {
      observerRef.current.observe(el)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <Layout className="landing-page">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <HeaderSection />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  )
}

export default LandingPage
