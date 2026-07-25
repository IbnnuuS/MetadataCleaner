"use client"

import React from "react"
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react"

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl md:text-6xl lg:text-7xl">
          Hapus Metadata Gambar <br /> Secara Instan
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 md:text-xl">
          Lindungi privasi Anda dengan menghapus EXIF, GPS, XMP, dan metadata lainnya tanpa mengurangi kualitas gambar. Gratis digunakan tanpa login.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo("upload")}
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            Bersihkan Gambar Sekarang
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => scrollTo("fitur")}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-6 py-3.5 text-sm font-semibold text-zinc-700 backdrop-blur-md transition-all duration-200 w-full sm:w-auto shadow-sm"
          >
            Pelajari Selengkapnya
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-zinc-200 pt-10">
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight">0</div>
            <div className="text-xs font-semibold text-zinc-500">File Disimpan di Server</div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight">&lt; 1s</div>
            <div className="text-xs font-semibold text-zinc-500">Waktu Pembersihan</div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight">100%</div>
            <div className="text-xs font-semibold text-zinc-500">Kualitas Gambar Terjaga</div>
          </div>
        </div>
      </div>
    </section>
  )
}
