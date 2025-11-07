'use client'

import { useState } from 'react'
import Link from 'next/link'

// 임시 데이터
const booths = [
  {
    id: 1,
    name: '맛있는 푸드트럭',
    category: '음식',
    type: '푸드트럭',
    image: '/api/placeholder/400/300',
    description: '다양한 음식을 제공하는 푸드트럭입니다.',
    operatingHours: '10:00 - 22:00',
    instagram: 'https://instagram.com/example',
    lat: 37.5665,
    lng: 126.9780,
  },
  {
    id: 2,
    name: '체험 부스',
    category: '체험',
    type: '일반',
    image: '/api/placeholder/400/300',
    description: '재미있는 체험 활동을 즐길 수 있습니다.',
    operatingHours: '11:00 - 20:00',
    instagram: null,
    lat: 37.5666,
    lng: 126.9781,
  },
  {
    id: 3,
    name: '홍보 부스',
    category: '홍보',
    type: '일반',
    image: '/api/placeholder/400/300',
    description: '다양한 정보를 제공하는 홍보 부스입니다.',
    operatingHours: '09:00 - 18:00',
    instagram: null,
    lat: 37.5667,
    lng: 126.9782,
  },
]

const categories = ['전체', '음식', '체험', '홍보']

export default function BoothsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const filteredBooths =
    selectedCategory === '전체'
      ? booths
      : booths.filter((booth) => booth.category === selectedCategory)

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">부스 안내</h1>

        {/* 필터 */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#C2FE0F] text-[#17161C]'
                  : 'bg-[#1F1E24] text-gray-300 border border-[#2A2930] hover:border-[#C2FE0F]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 부스 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBooths.map((booth) => (
            <Link
              key={booth.id}
              href={`/booths/${booth.id}`}
              className="bg-[#1F1E24] border border-[#2A2930] rounded-lg overflow-hidden hover:border-[#C2FE0F] transition-colors"
            >
              <div
                className="w-full h-48 bg-[#2A2930]"
                style={{
                  backgroundImage: `url(${booth.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[#2A2930] text-[#C2FE0F] text-xs rounded">
                    {booth.category}
                  </span>
                  <span className="px-2 py-1 bg-[#2A2930] text-gray-400 text-xs rounded">
                    {booth.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {booth.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {booth.description}
                </p>
                <p className="text-xs text-gray-500">운영시간: {booth.operatingHours}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 지도 보기 버튼 */}
        <div className="text-center">
          <Link
            href="/booths/map"
            className="inline-block px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
          >
            전체 부스 위치 지도 보기
          </Link>
        </div>
      </div>
    </main>
  )
}

