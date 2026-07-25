"use client"

import React from "react"
import { Upload, Eye, ShieldAlert, Download } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-6 w-6 text-blue-600" />,
      title: "1. Unggah Gambar",
      desc: "Drag & drop atau pilih gambar dari perangkat Anda. Mendukung file hingga 15MB."
    },
    {
      icon: <Eye className="h-6 w-6 text-blue-600" />,
      title: "2. Scan Metadata",
      desc: "Sistem mendeteksi semua tag EXIF, koordinat GPS, detail kamera, serta signature AI generator."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-blue-600" />,
      title: "3. Bersihkan & Verifikasi",
      desc: "Metadata dibersihkan dalam RAM server dan segera dipindai ulang untuk menjamin kebersihan 100%."
    },
    {
      icon: <Download className="h-6 w-6 text-blue-600" />,
      title: "4. Unduh Gambar",
      desc: "Unduh file bersih Anda secara instan. Data visual tetap terjaga tanpa kompresi berlebih."
    }
  ]

  return (
    <section id="cara-kerja" className="py-20 bg-white border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="mt-4 text-zinc-600">
            Proses pembersihan metadata dilakukan secara real-time melalui 4 langkah mudah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 border border-zinc-200/60 relative shadow-sm">
              <div className="h-12 w-12 rounded-full bg-zinc-100 border border-zinc-200/50 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-zinc-900 font-bold text-base mb-2">{step.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
