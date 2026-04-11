'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Circle as LeafletCircle } from 'leaflet'

interface Props {
  centerLat: number
  centerLng: number
  radiusMiles: number
}

// Nominatim endpoint for zip code geocoding
const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

function milesToMeters(miles: number) {
  return miles * 1609.344
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function ServiceAreaMap({ centerLat, centerLng, radiusMiles }: Props) {
  const mapRef = useRef<LeafletMap | null>(null)
  const circleRef = useRef<LeafletCircle | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [zip, setZip] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{ inRange: boolean; zip: string; distance: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize map once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icon paths broken by webpack
      const iconDefault = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
      L.Marker.prototype.options.icon = iconDefault

      const map = L.map(containerRef.current!, {
        center: [centerLat, centerLng],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // Service area circle
      const circle = L.circle([centerLat, centerLng], {
        radius: milesToMeters(radiusMiles),
        color: '#76bcb7',
        fillColor: '#76bcb7',
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map)

      // Center marker
      L.circleMarker([centerLat, centerLng], {
        radius: 6,
        color: '#fe8769',
        fillColor: '#fe8769',
        fillOpacity: 1,
        weight: 2,
      })
        .addTo(map)
        .bindPopup('Home base — Wellington, FL')

      mapRef.current = map
      circleRef.current = circle
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCheck() {
    const trimmed = zip.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setError('Please enter a valid 5-digit zip code.')
      return
    }

    setChecking(true)
    setResult(null)
    setError(null)

    try {
      const params = new URLSearchParams({
        postalcode: trimmed,
        countrycodes: 'us',
        format: 'json',
        limit: '1',
      })
      const res = await fetch(`${NOMINATIM}?${params}`, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'trustypawco.com' },
      })
      const data = await res.json()

      if (!data || data.length === 0) {
        setError('Zip code not found. Please double-check and try again.')
        return
      }

      const { lat, lon } = data[0]
      const distance = haversineDistance(centerLat, centerLng, parseFloat(lat), parseFloat(lon))
      const inRange = distance <= radiusMiles

      setResult({ inRange, zip: trimmed, distance: Math.round(distance * 10) / 10 })

      // Drop a marker on the map for the checked zip
      import('leaflet').then((L) => {
        if (!mapRef.current) return
        L.marker([parseFloat(lat), parseFloat(lon)])
          .addTo(mapRef.current)
          .bindPopup(`${trimmed} — ${inRange ? 'In service area' : 'Outside service area'} (${Math.round(distance * 10) / 10} mi)`)
          .openPopup()
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Map */}
      <div
        ref={containerRef}
        className="w-full h-[400px] rounded-3xl overflow-hidden border border-sand/50 shadow-sm z-0"
        style={{ position: 'relative' }}
      />

      {/* Zip checker */}
      <div className="bg-white rounded-3xl border border-sand/50 shadow-sm p-6">
        <p className="font-semibold text-driftwood mb-3">Check if your zip code is covered</p>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 33411"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value)
              setResult(null)
              setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean w-36"
          />
          <button
            onClick={handleCheck}
            disabled={checking}
            className="px-5 py-2.5 bg-ocean text-white rounded-xl text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60"
          >
            {checking ? 'Checking...' : 'Check'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-coral font-medium">{error}</p>
        )}

        {result && (
          <div
            className={`mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 ${
              result.inRange
                ? 'bg-seafoam/20 border border-seafoam/40'
                : 'bg-coral/10 border border-coral/30'
            }`}
          >
            <span className="text-xl leading-none mt-0.5">
              {result.inRange ? '✓' : '✕'}
            </span>
            <div>
              <p className={`font-semibold text-sm ${result.inRange ? 'text-deep-ocean' : 'text-coral'}`}>
                {result.inRange
                  ? `Zip ${result.zip} is in the service area.`
                  : `Zip ${result.zip} is outside the service area.`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {result.distance} miles from Wellington, FL
                {!result.inRange && ' — reach out anyway, I may still be able to help.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
