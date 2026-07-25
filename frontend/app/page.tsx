import React from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Dropzone from "@/components/Dropzone"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import FAQ from "@/components/FAQ"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-950/20 via-transparent to-transparent pointer-events-none -z-20" />
      
      <div>
        <Navbar />
        <main>
          <Hero />
          <Dropzone />
          <Features />
          <HowItWorks />
          <FAQ />
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
