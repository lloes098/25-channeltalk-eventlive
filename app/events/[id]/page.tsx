'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import KakaoMap from '@/components/KakaoMap'
import { getEventById } from '@/utils/events'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = getEventById(eventId)

  if (!event) {
    return (
      <main className="min-h-screen bg-[#17161C] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">행사를 찾을 수 없습니다</h1>
            <Link
              href="/"
              className="text-[#C2FE0F] hover:text-[#B0E80D] transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const currentDate = {
    month: event.time.split(' ')[0].replace('월', '').toUpperCase(),
    date: event.time.split(' ')[1].replace('일', ''),
  }

  return (
    <main className="min-h-screen bg-[#17161C]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 왼쪽: 포스터 이미지 */}
          <div className="order-2 lg:order-1">
            <div
              className="w-full aspect-[3/4] bg-[#2A2930] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${event.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>

          {/* 오른쪽: 이벤트 정보 카드 */}
          <div className="order-1 lg:order-2">
            <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 lg:p-8">
              {/* Featured 배너 */}
              <div className="mb-6">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Featured Event
                </span>
              </div>

              {/* 이벤트 제목 */}
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                {event.name}
              </h1>

              {/* 날짜 및 시간 정보 */}
              <div className="space-y-4 mb-6 pb-6 border-b border-[#2A2930]">
                {/* 날짜 */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#2A2930] border border-[#2A2930] rounded-md flex flex-col items-center justify-center flex-shrink-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                      {currentDate.month}
                    </div>
                    <div className="text-2xl font-bold text-white">{currentDate.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{event.time}</div>
                  </div>
                </div>

                {/* 장소 */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#2A2930] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-white font-semibold">{event.location}</div>
                    </div>
                    <div className="text-gray-400 mt-1">{event.locationDetail}</div>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>

              {/* 참가자 수 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <div className="text-sm text-gray-400 mb-3">
                  {event.going} GOING
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#C2FE0F] border-2 border-[#1F1E24] flex items-center justify-center text-[#17161C] text-xs font-semibold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-2">
                    and {event.going - 4} others
                  </span>
                </div>
              </div>

              {/* 호스트 정보 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <div className="text-sm text-gray-400 mb-2">HOSTED BY</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C2FE0F] flex items-center justify-center text-[#17161C] font-bold">
                    {event.host.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{event.host}</div>
                  </div>
                </div>
              </div>

              {/* 태그 */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#2A2930] text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="space-y-3">
                <Link
                  href={`/register/complete?event=${event.id}`}
                  className="block w-full px-6 py-3 bg-white text-[#17161C] font-semibold rounded-md hover:bg-gray-100 transition-colors text-center"
                >
                  참가 신청하기
                </Link>
                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.ChannelIO) {
                        window.ChannelIO('showMessenger')
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    호스트에게 문의
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    공유하기
                  </button>
                </div>
              </div>
            </div>

            {/* 지도 섹션 */}
            <div className="mt-6 bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-3">LOCATION</div>
              <div className="text-white font-semibold mb-2">{event.location}</div>
              <div className="text-sm text-gray-400 mb-4">{event.locationDetail}</div>
              <div className="w-full h-64 bg-[#2A2930] rounded-lg overflow-hidden">
                <KakaoMap
                  lat={event.lat}
                  lng={event.lng}
                  height="256px"
                  level={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

