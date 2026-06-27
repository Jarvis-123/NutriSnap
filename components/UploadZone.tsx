'use client'

import { useRef, useState, useCallback } from 'react'

interface Props {
  file: File | null
  onFileSelect: (file: File) => void
}

export default function UploadZone({ file, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(f: File) {
    onFileSelect(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function handleRemove() {
    setPreview(null)
    onFileSelect(null as unknown as File)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (preview && file) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={preview}
          alt="Food preview"
          className="w-full object-cover max-h-64"
        />
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
          aria-label="Remove photo"
        >
          ✕
        </button>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {file.name}
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleChange}
        capture="environment"
      />
      <div className="text-5xl mb-3">📸</div>
      <p className="font-semibold text-gray-700 text-base">Drop a food photo here</p>
      <p className="text-gray-400 text-sm mt-1">or tap to browse / take photo</p>
      <p className="text-gray-300 text-xs mt-3">JPG · PNG · WEBP · HEIC</p>
    </div>
  )
}
