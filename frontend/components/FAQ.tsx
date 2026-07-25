"use client"

import React, { useState } from "react"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function FAQ() {
  const faqs = [
    {
      q: "Apa itu metadata gambar?",
      a: "Metadata gambar adalah informasi tambahan yang tertanam secara tersembunyi di dalam file gambar. Metadata ini dapat berisi koordinat GPS (lokasi foto diambil), jenis kamera, lensa, waktu pemotretan, perangkat lunak yang digunakan, hingga parameter pembuatan gambar jika foto tersebut digenerasi oleh AI."
    },
    {
      q: "Apakah kualitas visual gambar saya akan berkurang?",
      a: "Tidak. Proses pembersihan metadata kami hanya membuang byte informasi non-visual (seperti EXIF, XMP, IPTC) tanpa mengubah resolusi, aspek rasio, transparansi PNG, atau data piksel visual utama gambar. Kualitas visual tetap dipertahankan semaksimal mungkin."
    },
    {
      q: "Apakah gambar yang saya upload disimpan di server?",
      a: "Sama sekali tidak. Aplikasi kami dibangun dengan komitmen privasi penuh. Seluruh data upload diproses secara instan di dalam memori (RAM) server dan langsung dihancurkan setelah respons dikirimkan. Kami tidak menggunakan cloud storage, database, ataupun sistem log file gambar."
    },
    {
      q: "Apakah metadata gambar buatan AI (seperti Midjourney atau Stable Diffusion) bisa dihapus?",
      a: "Ya. AI Metadata Cleaner memindai chunk teks tersembunyi (seperti parameter PNG info, text metadata generator) yang digunakan oleh tools seperti Midjourney, Stable Diffusion, DALL-E, dan lainnya, lalu menghapusnya sepenuhnya."
    },
    {
      q: "Apakah invisible watermark atau steganografi bisa dihapus?",
      a: "Tidak. Watermark yang tertanam di level piksel (steganografi / pixel fingerprint) secara teknis memodifikasi warna piksel itu sendiri untuk menyimpan informasi tersembunyi. Menghapusnya membutuhkan distorsi piksel gambar yang akan merusak kualitas visual asli gambar Anda."
    },
    {
      q: "Apakah Content Credentials (C2PA) bisa dihapus?",
      a: "Metadata C2PA/Content Credentials yang bertindak sebagai tanda tangan kriptografis tersemat dalam metadata file (seperti XMP/JUMBF) dapat dibersihkan dari format file standar. Namun, jika sistem C2PA juga menyematkan pixel fingerprint (watermark visual tak terlihat) ke dalam piksel gambar, penanda level piksel tersebut tidak akan hilang."
    }
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 border-t border-zinc-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center justify-center gap-3">
            <HelpCircle className="h-7 w-7 text-blue-600" />
            Tanya Jawab (FAQ)
          </h2>
          <p className="mt-4 text-zinc-600">
            Temukan jawaban atas pertanyaan umum mengenai cara kerja dan kebijakan privasi sistem kami.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-zinc-800 hover:bg-zinc-50/50 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-600 border-t border-zinc-200/50 pt-4 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
