'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'

declare global {
  interface Window {
    ChannelIO?: any
  }
}

// 임시 데이터
const booths: Record<number, any> = {
  1: {
    id: 1,
    name: '맛있는 푸드트럭',
    category: '음식',
    type: '푸드트럭',
    image: '/api/placeholder/800/400',
    description:
      '다양한 음식을 제공하는 푸드트럭입니다. 햄버거, 타코, 아이스크림 등 다양한 메뉴를 준비했습니다.',
    operatingHours: '10:00 - 22:00',
    instagram: 'https://instagram.com/example',
    menu: ['햄버거 세트 - 8,000원', '타코 - 5,000원', '아이스크림 - 3,000원'],
    lat: 37.5665,
    lng: 126.9780,
  },
}

export default function BoothDetailPage({ params }: { params: { id: string } }) {
  const booth = booths[parseInt(params.id)]

  if (!booth) {
    notFound()
  }

  const handleInquiry = () => {
    if (typeof window !== 'undefined' && window.ChannelIO) {
      window.ChannelIO('show')
    }
  }

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/booths"
          className="inline-flex items-center gap-2 text-[#C2FE0F] hover:text-[#B0E80D] mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          목록으로
        </Link>

        <article className="bg-[#1F1E24] border border-[#2A2930] rounded-lg overflow-hidden">
          <div
            className="w-full h-64 bg-[#2A2930]"
            style={{
              backgroundImage: `url(${booth.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#2A2930] text-[#C2FE0F] text-sm rounded">
                {booth.category}
              </span>
              <span className="px-3 py-1 bg-[#2A2930] text-gray-400 text-sm rounded">
                {booth.type}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{booth.name}</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{booth.description}</p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-[#C2FE0F] mb-2">
                  운영 시간
                </h3>
                <p className="text-gray-300">{booth.operatingHours}</p>
              </div>

              {booth.menu && (
                <div>
                  <h3 className="text-sm font-semibold text-[#C2FE0F] mb-2">메뉴</h3>
                  <ul className="space-y-1">
                    {booth.menu.map((item: string, index: number) => (
                      <li key={index} className="text-gray-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {booth.instagram && (
                <div>
                  <h3 className="text-sm font-semibold text-[#C2FE0F] mb-2">
                    인스타그램
                  </h3>
                  <a
                    href={booth.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C2FE0F] hover:text-[#B0E80D] transition-colors"
                  >
                    {booth.instagram}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleInquiry}
                className="px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
              >
                ChannelTalk으로 문의하기
              </button>
              <Link
                href="/booths/map"
                className="px-6 py-3 bg-[#2A2930] text-white font-semibold rounded-md hover:bg-[#3A3940] transition-colors"
              >
                지도에서 위치 보기
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

