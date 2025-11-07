'use client'

import KakaoMap from '@/components/KakaoMap'
import { facilities } from '@/utils/locations'

export default function FacilitiesPage() {

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">시설 안내</h1>

        <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 mb-8">
          <div className="h-[600px] bg-[#2A2930] rounded-lg overflow-hidden">
            <KakaoMap
              lat={37.5665}
              lng={126.9780}
              height="600px"
              level={2}
              markers={facilities.map((facility) => ({
                lat: facility.lat,
                lng: facility.lng,
                title: facility.name,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6"
            >
              <div className="text-4xl mb-4">
                {facility.type === 'restroom' && '🚻'}
                {facility.type === 'smoking' && '🚬'}
                {facility.type === 'trash' && '🗑️'}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{facility.name}</h3>
              <p className="text-sm text-gray-400">
                위치: {facility.lat}, {facility.lng}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

