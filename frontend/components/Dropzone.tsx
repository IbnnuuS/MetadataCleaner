"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UploadCloud, FileImage, ShieldAlert, Sparkles, CheckCircle2, 
  Download, RefreshCcw, Eye, ArrowRightLeft, FileQuestion, AlertTriangle,
  Sliders, Hourglass, UserCheck
} from "lucide-react"
import { CleanResponse } from "@/types"
import { formatBytes } from "@/lib/utils"

export default function Dropzone() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [queueCount, setQueueCount] = useState<number>(0)
  const [quality, setQuality] = useState<number>(95)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CleanResponse | null>(null)
  const [showMetadataList, setShowMetadataList] = useState(false)
  
  // Split Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const isDraggingSlider = useRef<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Polling queue status when loading is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (loading && !result) {
      const fetchQueueStatus = async () => {
        try {
          const res = await fetch("/api/queue-status")
          if (res.ok) {
            const data = await res.json()
            setQueueCount(data.active_jobs)
          }
        } catch (e) {
          // ignore error during polling
        }
      }

      fetchQueueStatus()
      intervalId = setInterval(fetchQueueStatus, 600)
    } else {
      setQueueCount(0)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [loading, result])

  // Handlers for paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            handleFileSelect(blob)
            break
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    setResult(null)
    
    // Check file size (4MB limit for Vercel Serverless)
    if (selectedFile.size > 4 * 1024 * 1024) {
      setError("Ukuran file melebihi batas maksimum 4MB (Batas Serverless Vercel).")
      return
    }

    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
  }

  // Handle Drag Events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const processImage = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/clean?quality=${quality}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || "Terjadi kesalahan saat memproses gambar.")
      }

      const data: CleanResponse = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi server. Pastikan server backend Anda menyala.")
    } finally {
      setLoading(false)
    }
  }

  const downloadCleanImage = () => {
    if (!result) return
    const link = document.createElement("a")
    link.href = `data:${result.mime_type};base64,${result.clean_image_b64}`
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetAll = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    setShowMetadataList(false)
    setSliderPosition(50)
  }

  // Handle Split Slider Dragging
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isDraggingSlider.current) {
      handleSliderMove(e.clientX)
    }
  }

  return (
    <section id="upload" className="py-20 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl bg-white/70">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 mb-2">
            Mulai Bersihkan Gambar Anda
          </h2>
          <p className="text-center text-zinc-500 text-sm md:text-base mb-10 max-w-lg mx-auto">
            Drag & drop, browse, atau paste file gambar langsung dari clipboard Anda.
          </p>

          {!file ? (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed transition-all duration-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer min-h-[300px] ${
                dragActive 
                  ? "border-blue-500 bg-blue-50/60 scale-[1.01] shadow-lg shadow-blue-500/10" 
                  : "border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-400"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                accept="image/*"
              />
              <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center mb-6 transition-colors duration-300 ${
                dragActive 
                  ? "bg-blue-600/10 border-blue-500/30 text-blue-600" 
                  : "bg-blue-600/5 border-blue-500/10 text-blue-600"
              }`}>
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-zinc-900 font-semibold text-lg text-center mb-2">
                {dragActive ? "Lepaskan gambar Anda di sini" : "Seret & lepaskan gambar di sini"}
              </p>
              <p className="text-zinc-500 text-xs text-center max-w-sm mb-4">
                Mendukung PNG, JPG, JPEG, WEBP, TIFF, BMP, HEIC (Maksimal 4MB / Batas Serverless Vercel)
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-600 font-medium">
                <kbd className="font-sans font-bold text-zinc-500">Ctrl</kbd> + <kbd className="font-sans font-bold text-zinc-500">V</kbd> untuk Paste
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* File Selected Status */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                {previewUrl && (
                  <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left min-w-0">
                  <h4 className="text-zinc-900 font-bold truncate text-lg">{file.name}</h4>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs text-zinc-500">
                    <span>Ukuran: <strong className="text-zinc-800">{formatBytes(file.size)}</strong></span>
                    <span>Tipe: <strong className="text-zinc-800">{file.type || "Tidak dikenal"}</strong></span>
                  </div>
                </div>
                {!result && !loading && (
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={resetAll}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-sm font-semibold transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={processImage}
                      className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-sm font-semibold shadow-lg shadow-blue-600/20 transition"
                    >
                      Scan & Hapus Metadata
                    </button>
                  </div>
                )}
              </div>

              {/* Compression Quality Setting Panel (Only before processed) */}
              {!result && !loading && (
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/50 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-800 font-bold text-sm">
                    <Sliders className="h-4 w-4 text-blue-600" />
                    <span>Pengaturan Kompresi Gambar (Kualitas)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-full flex-1">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[11px] text-zinc-500 mt-2 font-medium">
                        <span>1% (Kompresi Tinggi)</span>
                        <span>95% (Saran Terbaik)</span>
                        <span>100% (Tanpa Rugi/Lossless)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center h-10 w-20 rounded-xl bg-white border border-zinc-300 text-zinc-800 text-sm font-bold shadow-sm">
                      {quality}%
                    </div>
                  </div>
                </div>
              )}

              {/* Queue / Loader Processing Area */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  {queueCount > 1 ? (
                    <>
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin" />
                        <Hourglass className="h-5 w-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-900 font-bold">Menunggu Antrean Server...</p>
                        <p className="text-zinc-500 text-xs mt-1">
                          Posisi Anda saat ini: <strong className="text-blue-600">{queueCount - 1} request</strong> di depan Anda.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
                        <Sparkles className="h-5 w-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-900 font-bold">Sedang Memproses...</p>
                        <p className="text-zinc-500 text-xs mt-1">
                          Memindai metadata awal, membuang EXIF/GPS, dan memverifikasi hasil pembersihan di RAM.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-700 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Gagal Memproses</span>
                    <span className="text-sm mt-0.5 block">{error}</span>
                    <button 
                      onClick={processImage}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold underline mt-2 block"
                    >
                      Coba lagi
                    </button>
                  </div>
                </div>
              )}

              {/* Result Area */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Status Banner */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 md:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-zinc-900 font-bold text-base md:text-lg">Pembersihan Selesai</h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          {result.verification.fully_removed 
                            ? "Seluruh metadata yang dapat dihapus berhasil dibersihkan."
                            : result.verification.notes || "Metadata berhasil dibersihkan."}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button
                        onClick={resetAll}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-sm font-bold transition bg-white shadow-sm"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Bersihkan Lagi
                      </button>
                      <button
                        onClick={downloadCleanImage}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-sm font-bold shadow-lg shadow-blue-600/20 transition"
                      >
                        <Download className="h-4 w-4" />
                        Unduh Gambar
                      </button>
                    </div>
                  </div>

                  {/* PREMIUM SPLIT COMPARISON SLIDER */}
                  <div className="space-y-3">
                    <h4 className="text-zinc-800 font-bold text-base flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                      Perbandingan Gambar (Sebelum vs Sesudah)
                    </h4>
                    <div 
                      ref={sliderContainerRef}
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleTouchMove}
                      onMouseDown={() => { isDraggingSlider.current = true }}
                      onMouseUp={() => { isDraggingSlider.current = false }}
                      onMouseLeave={() => { isDraggingSlider.current = false }}
                      className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 cursor-ew-resize select-none"
                    >
                      {/* Before Image (Left Side) */}
                      <div className="absolute inset-0 h-full w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={previewUrl || ""} 
                          alt="Sebelum" 
                          className="h-full w-full object-contain bg-zinc-100"
                          draggable={false}
                        />
                        <div className="absolute top-3 left-3 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-zinc-900/90 text-[10px] md:text-xs font-bold text-white backdrop-blur-md">
                          Sebelum (Ada EXIF)
                        </div>
                      </div>

                      {/* After Image (Right Side - clipped) */}
                      <div 
                        className="absolute inset-0 h-full w-full overflow-hidden"
                        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`data:${result.mime_type};base64,${result.clean_image_b64}`} 
                          alt="Sesudah" 
                          className="h-full w-full object-contain bg-zinc-100"
                          draggable={false}
                        />
                        <div className="absolute top-3 right-3 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-blue-600/90 text-[10px] md:text-xs font-bold text-white backdrop-blur-md">
                          Sesudah (Bersih - {quality}%)
                        </div>
                      </div>

                      {/* Divider Line & Handle */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-xl flex items-center justify-center">
                          <ArrowRightLeft className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-zinc-500 text-xs">
                      Geser slider di tengah gambar untuk membandingkan perbedaan piksel visual.
                    </p>
                  </div>

                  {/* AI Metadata Alert */}
                  {result.before.ai_metadata.found ? (
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4 shadow-sm">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-zinc-900 font-bold text-sm">Terdeteksi Metadata AI</h4>
                        <p className="text-zinc-600 text-xs mt-1.5 leading-relaxed">
                          Gambar ini memiliki signature dari generator AI: <strong className="text-blue-600">{result.before.ai_metadata.generator}</strong> ({result.before.ai_metadata.confidence} confidence).
                          Lokasi: <span className="font-mono text-zinc-700 text-[11px] bg-zinc-100 px-1 py-0.5 rounded">{result.before.ai_metadata.location}</span>.
                        </p>
                        <span className="inline-block mt-3 text-xs text-emerald-600 font-bold">✓ Signature AI berhasil dihapus pada hasil pembersihan.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 flex items-center gap-3 text-xs">
                      <FileQuestion className="h-4 w-4 text-zinc-400" />
                      <span>Tidak ditemukan metadata AI generator (seperti Midjourney, Stable Diffusion, dll).</span>
                    </div>
                  )}

                  {/* Comparative Stats Cards */}
                  <div>
                    <h4 className="text-zinc-800 font-bold text-base mb-4 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-blue-600" />
                      Hasil Komparasi Ukuran & Metadata
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                        <span className="text-xs text-zinc-500 block font-medium">Ukuran File</span>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-zinc-400 line-through">{formatBytes(result.before.file_size)}</span>
                          <span className="text-xl font-extrabold text-zinc-900">{formatBytes(result.after.file_size)}</span>
                        </div>
                        <span className="text-[11px] text-emerald-600 mt-2 block font-bold">
                          Turun {Math.max(0, Math.round((1 - result.after.file_size / result.before.file_size) * 100))}%
                        </span>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                        <span className="text-xs text-zinc-500 block font-medium">Ukuran Metadata</span>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-zinc-400 line-through">{formatBytes(result.before.metadata_size)}</span>
                          <span className="text-xl font-extrabold text-emerald-600">0 Bytes</span>
                        </div>
                        <span className="text-[11px] text-emerald-600 mt-2 block font-bold">
                          Terhapus 100%
                        </span>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/50">
                        <span className="text-xs text-zinc-500 block font-medium">Jumlah Entri Metadata</span>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-zinc-400 line-through">{result.before.metadata_count} entri</span>
                          <span className="text-xl font-extrabold text-zinc-900">{result.after.metadata_count} entri</span>
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-2 block">
                          Format: {result.after.format} | {result.after.dimensions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata List Before (Tabel detail) */}
                  {result.before.metadata.length > 0 && (
                    <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setShowMetadataList(!showMetadataList)}
                        className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          Lihat Detail Metadata Awal ({result.before.metadata.length} Tag Ditemukan)
                        </span>
                        <span className="text-xs text-blue-600 underline">
                          {showMetadataList ? "Sembunyikan" : "Tampilkan"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showMetadataList && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-zinc-200"
                          >
                            <div className="overflow-x-auto max-h-[350px]">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold">
                                    <th className="p-4">Nama Metadata</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Nilai</th>
                                    <th className="p-4 text-right">Ukuran</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200/50 text-zinc-700">
                                  {result.before.metadata.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50/50">
                                      <td className="p-4 font-mono font-medium truncate max-w-[200px]">{item.name}</td>
                                      <td className="p-4">
                                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase">
                                          {item.category}
                                        </span>
                                      </td>
                                      <td className="p-4 truncate max-w-[300px]" title={item.value}>{item.value}</td>
                                      <td className="p-4 text-right font-mono text-zinc-500">{item.size} B</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* C2PA/Invisible Watermark Disclaimer Warning */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-700 flex items-start gap-2.5 leading-relaxed">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>Catatan Batasan Teknis:</strong> Kami membersihkan seluruh metadata struktural (EXIF, GPS, IPTC, XMP, Adobe, dll). Namun, invisible watermark tingkat piksel, steganografi, fingerprint piksel, dan Content Credentials (C2PA) terenkripsi kriptografis yang tertanam di level piksel tidak dapat dihapus tanpa memodifikasi representasi visual gambar.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
