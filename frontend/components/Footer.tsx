"use client"

import React from "react"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-zinc-200">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-zinc-900 tracking-tight">AI Metadata Cleaner</span>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed max-w-sm">
              Alat privasi gambar modern untuk membersihkan jejak lokasi GPS, jenis kamera, metadata AI generator, dan info personal lainnya secara instan di memory RAM.
            </p>
          </div>

          {/* Supported Formats */}
          <div id="supported-formats">
            <h4 className="text-zinc-800 font-bold text-xs uppercase tracking-wider mb-4">Format Didukung</h4>
            <div className="flex flex-wrap gap-2">
              {["PNG", "JPG", "JPEG", "WEBP", "TIFF", "BMP", "HEIC", "HEIF"].map((format) => (
                <span key={format} className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-bold text-zinc-600">
                  {format}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer & Privacy Policy Summary */}
          <div id="privasi">
            <h4 className="text-zinc-800 font-bold text-xs uppercase tracking-wider mb-4">Komitmen Privasi & Disclaimer</h4>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Kami berkomitmen penuh untuk melindungi privasi Anda. Gambar dan metadata Anda diproses sementara di RAM dan <strong>tidak pernah disimpan</strong>. Kami tidak menjamin penghapusan watermark level piksel, steganografi, atau fingerprint visual.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} <a href="https://github.com/IbnnuuS/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-semibold transition">AI Metadata Cleaner</a>. Hak Cipta Dilindungi.
          </div>
          <div className="flex gap-4">
            <a href="#fitur" className="hover:text-blue-600 transition">Fitur</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
            <a href="#privasi" className="hover:text-blue-600 transition">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
