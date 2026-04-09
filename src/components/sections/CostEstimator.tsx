'use client'

import { useState } from 'react'
import WaveDivider from '@/components/layout/WaveDivider'

type ServiceType = 'visit' | 'overnight' | 'walk'

function calculateEstimate({
  serviceType,
  numDogs,
  numCats,
  numDaysOrVisits,
  numPetsOnMeds,
  numHolidayDays,
}: {
  serviceType: ServiceType
  numDogs: number
  numCats: number
  numDaysOrVisits: number
  numPetsOnMeds: number
  numHolidayDays: number
}): number {
  const totalPets = numDogs + numCats
  const mixedDogsAndCats = numDogs > 0 && numCats > 0

  let basePerUnit = 0

  if (serviceType === 'visit') {
    basePerUnit = totalPets <= 2 && !mixedDogsAndCats ? 40 : 45
  } else if (serviceType === 'overnight') {
    if (numDogs <= 2 && numCats === 0) basePerUnit = 110
    else if (numDogs > 2 && numCats === 0) basePerUnit = 130
    else basePerUnit = 135
  } else {
    basePerUnit = 30
  }

  const medsFee = numPetsOnMeds * 15
  const holidayFee = numHolidayDays * 25

  return basePerUnit * numDaysOrVisits + medsFee * numDaysOrVisits + holidayFee
}

export default function CostEstimator() {
  const [serviceType, setServiceType] = useState<ServiceType>('visit')
  const [numDogs, setNumDogs] = useState(1)
  const [numCats, setNumCats] = useState(0)
  const [numDaysOrVisits, setNumDaysOrVisits] = useState(1)
  const [numPetsOnMeds, setNumPetsOnMeds] = useState(0)
  const [numHolidayDays, setNumHolidayDays] = useState(0)

  const estimate = calculateEstimate({
    serviceType,
    numDogs,
    numCats,
    numDaysOrVisits,
    numPetsOnMeds,
    numHolidayDays,
  })

  const unitLabel = serviceType === 'visit' ? 'visits' : serviceType === 'overnight' ? 'nights' : 'walks'

  return (
    <section id="estimate" className="bg-white-sand py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Plan Your Budget
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-3">
            Cost Estimator
          </h2>
          <p className="text-gray-500">
            Get an instant estimate based on your needs. Final pricing confirmed at booking.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-sand/50 p-8 space-y-6">
          {/* Service type */}
          <div>
            <label className="block text-sm font-semibold text-driftwood mb-3">
              Service Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['visit', 'overnight', 'walk'] as ServiceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={`py-3 rounded-2xl text-sm font-semibold border-2 transition-all capitalize ${
                    serviceType === type
                      ? 'bg-ocean text-white border-ocean'
                      : 'bg-white text-driftwood border-sand hover:border-ocean'
                  }`}
                >
                  {type === 'visit' ? '🐾 Visit' : type === 'overnight' ? '🌙 Overnight' : '🦮 Walk'}
                </button>
              ))}
            </div>
          </div>

          {/* Pet counts */}
          <div className="grid grid-cols-2 gap-6">
            <NumberInput label="Number of Dogs" value={numDogs} min={0} max={10} onChange={setNumDogs} />
            <NumberInput label="Number of Cats" value={numCats} min={0} max={10} onChange={setNumCats} />
          </div>

          {/* Days/visits */}
          <NumberInput
            label={`Number of ${unitLabel}`}
            value={numDaysOrVisits}
            min={1}
            max={60}
            onChange={setNumDaysOrVisits}
          />

          {/* Meds */}
          <NumberInput
            label="Pets needing medication (+$15 each)"
            value={numPetsOnMeds}
            min={0}
            max={numDogs + numCats}
            onChange={setNumPetsOnMeds}
          />

          {/* Holiday days */}
          {serviceType !== 'walk' && (
            <NumberInput
              label={`Holiday ${unitLabel} (+$25 each)`}
              value={numHolidayDays}
              min={0}
              max={numDaysOrVisits}
              onChange={setNumHolidayDays}
            />
          )}

          {/* Result */}
          <div className="bg-gradient-to-r from-ocean/10 to-seafoam/20 rounded-2xl p-6 text-center border border-ocean/20">
            <p className="text-sm text-deep-ocean font-semibold mb-1">Estimated Total</p>
            <p className="font-display text-5xl text-driftwood">
              ${estimate.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Estimate only — final pricing confirmed at booking
            </p>
          </div>
        </div>
      </div>

      <WaveDivider fillColor="#ffffff" />
    </section>
  )
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-driftwood mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-sand/50 text-driftwood font-bold hover:bg-sand transition-colors flex items-center justify-center text-lg"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-lg text-driftwood">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-full bg-sand/50 text-driftwood font-bold hover:bg-sand transition-colors flex items-center justify-center text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
