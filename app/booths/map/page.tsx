'use client'

import Link from 'next/link'

export default function BoothsMapPage() {
  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">부스 위치 지도</h1>
          <Link
            href="/booths"
            className="text-[#C2FE0F] hover:text-[#B0E80D] transition-colors"
          >
            목록으로 ←
          </Link>
        </div>

        <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
          <div className="h-[600px] bg-[#2A2930] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-4">지도가 여기에 표시됩니다</p>
              <p className="text-sm text-gray-500">
                Mapbox 또는 Leaflet을 사용하여 지도를 구현할 수 있습니다
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 1, name: '맛있는 푸드트럭', lat: 37.5665, lng: 126.9780 },
              { id: 2, name: '체험 부스', lat: 37.5666, lng: 126.9781 },
              { id: 3, name: '홍보 부스', lat: 37.5667, lng: 126.9782 },
            ].map((booth) => (
              <Link
                key={booth.id}
                href={`/booths/${booth.id}`}
                className="p-4 bg-[#17161C] border border-[#2A2930] rounded-lg hover:border-[#C2FE0F] transition-colors"
              >
                <h3 className="text-white font-semibold mb-1">{booth.name}</h3>
                <p className="text-sm text-gray-400">
                  위치: {booth.lat}, {booth.lng}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

