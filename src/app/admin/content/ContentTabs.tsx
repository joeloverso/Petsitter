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

export interface ServiceArea {
  id: string
  city: string
  zip_codes: string[]
  sort_order: number
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

interface Props {
  initialServices: Service[]
  initialServiceArea: ServiceArea[]
  initialFaqs: FAQ[]
  initialImages: SiteImage[]
}

export default function ContentTabs({
  initialServices,
  initialServiceArea,
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

      {activeTab === 'Services' && <ServicesEditor initialServices={initialServices} />}
      {activeTab === 'Service Area' && <ServiceAreaEditor initialServiceArea={initialServiceArea} />}
      {activeTab === 'FAQs' && <FAQEditor initialFaqs={initialFaqs} />}
      {activeTab === 'Photos' && <ImagesEditor initialImages={initialImages} />}
    </div>
  )
}
