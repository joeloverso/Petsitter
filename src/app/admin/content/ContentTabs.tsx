'use client'

import { useState } from 'react'
import ServicesEditor from '@/components/admin/ContentEditor/ServicesEditor'
import ServiceAreaEditor from '@/components/admin/ContentEditor/ServiceAreaEditor'
import FAQEditor from '@/components/admin/ContentEditor/FAQEditor'
import ImagesEditor from '@/components/admin/ContentEditor/ImagesEditor'

const tabs = ['Services', 'Service Area', 'FAQs', 'Photos'] as const
type Tab = typeof tabs[number]

export interface Service {
  id: string
  name: string
  description: string
  base_price_low: number
  base_price_high: number
  pricing_notes: string
  active: boolean
  sort_order: number
}

export interface ServiceAreaConfig {
  id: string
  home_zip: string
  home_lat: number
  home_lng: number
  radius_miles: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  active: boolean
}

export interface SiteImage {
  key: string
  url: string
}

const DEFAULT_SERVICE_AREA_CONFIG: ServiceAreaConfig = {
  id: '',
  home_zip: '33414',
  home_lat: 26.6599,
  home_lng: -80.2423,
  radius_miles: 20,
}

interface Props {
  initialServices: Service[]
  initialServiceAreaConfig: ServiceAreaConfig | null
  initialFaqs: FAQ[]
  initialImages: SiteImage[]
}

export default function ContentTabs({
  initialServices,
  initialServiceAreaConfig,
  initialFaqs,
  initialImages,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Services')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-driftwood shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={activeTab === 'Services' ? '' : 'hidden'}><ServicesEditor initialServices={initialServices} /></div>
      <div className={activeTab === 'Service Area' ? '' : 'hidden'}><ServiceAreaEditor initialConfig={initialServiceAreaConfig ?? DEFAULT_SERVICE_AREA_CONFIG} /></div>
      <div className={activeTab === 'FAQs' ? '' : 'hidden'}><FAQEditor initialFaqs={initialFaqs} /></div>
      <div className={activeTab === 'Photos' ? '' : 'hidden'}><ImagesEditor initialImages={initialImages} /></div>
    </div>
  )
}
