"use client"

import React from "react"
import { ShieldAlert, Zap, Lock, CreditCard, UserMinus, HardDrive, RefreshCw, Layers } from "lucide-react"

export default function Features() {
  const items = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Cepat & Instan",
      desc: "Proses scan dan pembersihan metadata selesai kurang dari satu detik saja."
    },
    {
      icon: <Lock className="h-6 w-6 text-blue-600" />,
      title: "Aman & Privat",
      desc: "Kami menjamin privasi Anda. Gambar Anda tidak akan dikirim ke pihak ketiga."
    },
    {
      icon: <HardDrive className="h-6 w-6 text-blue-600" />,
      title: "Berjalan di Memory",
      desc: "File diproses sepenuhnya secara temporary di RAM dan langsung dihapus setelahnya."
    },
    {
      icon: <UserMinus className="h-6 w-6 text-blue-600" />,
      title: "Tanpa Login",
      desc: "Gunakan seluruh fitur aplikasi secara gratis tanpa perlu registrasi atau berlangganan."
    },
    {
      icon: <Layers className="h-6 w-6 text-blue-600" />,
      title: "Mendukung Banyak Format",
      desc: "Mendukung file PNG, JPG, JPEG, WEBP, TIFF, BMP, dan format modern lainnya."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
      title: "Verifikasi Otomatis",
      desc: "Kami memindai ulang gambar setelah dibersihkan untuk memastikan tidak ada data yang tersisa."
    }
  ]

  return (
    <section id="fitur" className="py-20 border-t border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Privasi Anda Adalah Prioritas Utama Kami
          </h2>
          <p className="mt-4 text-zinc-600 text-lg">
            Teknologi AI Metadata Cleaner didesain untuk membersihkan seluruh jejak digital dari foto Anda dengan performa tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 group transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200/50 group-hover:bg-blue-600/5 group-hover:border-blue-500/20 transition-all">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
