'use client'

export default function FacilitiesPage() {
  const facilities = [
    { id: 1, name: '화장실', type: 'restroom', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '흡연장', type: 'smoking', lat: 37.5666, lng: 126.9781 },
    { id: 3, name: '쓰레기통', type: 'trash', lat: 37.5667, lng: 126.9782 },
  ]

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">시설 안내</h1>

        <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 mb-8">
          <div className="h-[600px] bg-[#2A2930] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-4">지도가 여기에 표시됩니다</p>
              <p className="text-sm text-gray-500">
                Mapbox 또는 Leaflet을 사용하여 지도를 구현할 수 있습니다
              </p>
            </div>
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

