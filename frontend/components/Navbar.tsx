"use client"

import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollTo = (id: string) => {
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
            AI Metadata Cleaner
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <button onClick={() => scrollTo("upload")} className="hover:text-blue-600 transition-colors">
            Upload
          </button>
          <button onClick={() => scrollTo("fitur")} className="hover:text-blue-600 transition-colors">
            Fitur
          </button>
          <button onClick={() => scrollTo("cara-kerja")} className="hover:text-blue-600 transition-colors">
            Cara Kerja
          </button>
          <button onClick={() => scrollTo("faq")} className="hover:text-blue-600 transition-colors">
            FAQ
          </button>
          <button onClick={() => scrollTo("privasi")} className="hover:text-blue-600 transition-colors">
            Privasi
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200 transition"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden border-t border-zinc-200/50 bg-white"
          >
            <div className="flex flex-col gap-4 p-4 text-sm font-medium text-zinc-700">
              <button 
                onClick={() => scrollTo("upload")} 
                className="text-left py-2 border-b border-zinc-100 hover:text-blue-600 transition"
              >
                Upload
              </button>
              <button 
                onClick={() => scrollTo("fitur")} 
                className="text-left py-2 border-b border-zinc-100 hover:text-blue-600 transition"
              >
                Fitur
              </button>
              <button 
                onClick={() => scrollTo("cara-kerja")} 
                className="text-left py-2 border-b border-zinc-100 hover:text-blue-600 transition"
              >
                Cara Kerja
              </button>
              <button 
                onClick={() => scrollTo("faq")} 
                className="text-left py-2 border-b border-zinc-100 hover:text-blue-600 transition"
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollTo("privasi")} 
                className="text-left py-2 hover:text-blue-600 transition"
              >
                Privasi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
