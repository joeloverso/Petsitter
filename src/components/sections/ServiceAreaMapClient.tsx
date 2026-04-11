'use client'

import dynamic from 'next/dynamic'

const ServiceAreaMap = dynamic(() => import('./ServiceAreaMap'), { ssr: false })
export default ServiceAreaMap
