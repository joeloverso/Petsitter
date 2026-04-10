'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageSlot {
  key: 'profile' | 'pet_1' | 'pet_2' | 'family_1' | 'family_2'
  label: string
  description: string
}

const slots: ImageSlot[] = [
  {
    key: 'profile',
    label: 'Profile Photo',
    description: 'Your main photo shown in the hero section.',
  },
  {
    key: 'pet_1',
    label: 'Pet Photo 1',
    description: 'Photo of you with pets, shown in the About section.',
  },
  {
    key: 'pet_2',
    label: 'Pet Photo 2',
    description: 'Second photo of you with pets, shown in the About section.',
  },
  {
    key: 'family_1',
    label: 'Family Photo 1',
    description: 'Family photo, shown in the About section.',
  },
  {
    key: 'family_2',
    label: 'Family Photo 2',
    description: 'Second family photo, shown in the About section (optional).',
  },
]

interface SiteImage {
  key: string
  url: string
}

export default function ImagesEditor({ initialImages }: { initialImages: SiteImage[] }) {
  const [images, setImages] = useState<Record<string, string>>(
    Object.fromEntries(initialImages.map((img) => [img.key, img.url]))
  )
  const [uploading, setUploading] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  async function handleUpload(key: string, file: File) {
    setUploading(key)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', key)

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    })

    const json = await res.json()

    if (!res.ok) {
      setError(`Upload failed: ${json.error ?? 'Unknown error'}`)
      setUploading(null)
      return
    }

    setImages((prev) => ({ ...prev, [key]: json.url }))
    setUploading(null)
  }

  async function handleRemove(key: string) {
    setRemoving(key)
    setError(null)

    const res = await fetch('/api/admin/upload-image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(`Remove failed: ${json.error ?? 'Unknown error'}`)
      setRemoving(null)
      return
    }

    setImages((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setRemoving(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {slots.map((slot) => {
        const currentUrl = images[slot.key]
        const isUploading = uploading === slot.key
        const isRemoving = removing === slot.key

        return (
          <div key={slot.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Preview */}
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                {currentUrl ? (
                  <Image
                    src={currentUrl}
                    alt={slot.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                    🐾
                  </div>
                )}
                {(isUploading || isRemoving) && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-ocean border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Info + upload */}
              <div className="flex-1">
                <h3 className="font-bold text-driftwood text-lg mb-1">{slot.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{slot.description}</p>

                <input
                  ref={(el) => { inputRefs.current[slot.key] = el }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(slot.key, file)
                    e.target.value = ''
                  }}
                />

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => inputRefs.current[slot.key]?.click()}
                    disabled={isUploading || isRemoving}
                    className="px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60"
                  >
                    {isUploading ? 'Uploading...' : currentUrl ? 'Replace Photo' : 'Upload Photo'}
                  </button>

                  {currentUrl && (
                    <button
                      onClick={() => handleRemove(slot.key)}
                      disabled={isUploading || isRemoving}
                      className="px-5 py-2 bg-white text-coral border-2 border-coral rounded-full text-sm font-bold hover:bg-coral hover:text-white transition-colors disabled:opacity-60"
                    >
                      {isRemoving ? 'Removing...' : 'Remove Photo'}
                    </button>
                  )}
                </div>

                {currentUrl && (
                  <p className="text-xs text-gray-400 mt-2 truncate max-w-xs">
                    {currentUrl.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-gray-400">
        Supported formats: JPG, PNG, WebP. Photos update on the website immediately after upload.
      </p>
    </div>
  )
}
