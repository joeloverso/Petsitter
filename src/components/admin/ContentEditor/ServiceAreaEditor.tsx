'use client'

import { useState } from 'react'
import { type ServiceAreaConfig } from '@/app/admin/content/ContentTabs'
import { saveServiceAreaConfig } from '@/app/admin/content/actions'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ServiceAreaEditor({ initialConfig }: { initialConfig: ServiceAreaConfig }) {
  const [homeZip, setHomeZip] = useState(initialConfig.home_zip)
  const [radius, setRadius] = useState(initialConfig.radius_miles)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSave() {
    if (!/^\d{5}$/.test(homeZip.trim())) {
      setErrorMsg('Please enter a valid 5-digit zip code.')
      return
    }
    setSaveState('saving')
    setErrorMsg(null)
    try {
      await saveServiceAreaConfig(homeZip.trim(), radius)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3000)
    } catch (e) {
      console.error('Service area config save failed:', e)
      setErrorMsg((e as Error).message)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const btnLabel = saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? '✓ Saved' : saveState === 'error' ? '✕ Failed' : 'Save Changes'
  const btnClass =
    saveState === 'saved'
      ? 'px-6 py-2.5 bg-green-500 text-white rounded-full text-sm font-bold'
      : saveState === 'error'
      ? 'px-6 py-2.5 bg-coral text-white rounded-full text-sm font-bold'
      : 'px-6 py-2.5 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <p className="text-sm text-gray-500 mb-6">
        Set your home zip code and how far you&apos;re willing to travel. The map on your
        public site updates automatically.
      </p>

      <div className="space-y-5">
        {/* Home zip */}
        <div>
          <label htmlFor="home-zip" className="block text-sm font-semibold text-driftwood mb-1.5">
            Home zip code
          </label>
          <input
            id="home-zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={homeZip}
            onChange={(e) => setHomeZip(e.target.value)}
            placeholder="e.g. 33414"
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean w-36"
          />
          <p className="text-xs text-gray-400 mt-1">Your base location — the center of the service area circle.</p>
        </div>

        {/* Radius */}
        <div>
          <label htmlFor="service-radius" className="block text-sm font-semibold text-driftwood mb-1.5">
            Radius — <span className="text-ocean">{radius} miles</span>
          </label>
          <input
            id="service-radius"
            type="range"
            min={1}
            max={50}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-ocean"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 mi</span>
            <span>50 mi</span>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-coral bg-coral/10 rounded-xl px-4 py-2">✕ {errorMsg}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saveState === 'saving'}
          className={btnClass}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}
