import Link from 'next/link'

// 현재 날짜 가져오기
const getCurrentDate = () => {
  const now = new Date()
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ]
  const daysOfWeek = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
    'THURSDAY', 'FRIDAY', 'SATURDAY'
  ]
  
  const month = months[now.getMonth()]
  const date = now.getDate().toString()
  const dayOfWeek = daysOfWeek[now.getDay()]
  const year = now.getFullYear()
  
  return {
    month,
    date,
    dayOfWeek: `${dayOfWeek}, ${month} ${date}`,
    fullDate: `${dayOfWeek}, ${month} ${date}, ${year}`
  }
}

// 임시 데이터
const eventInfo = {
  name: '2025 캠퍼스 페스티벌',
  time: '10:00 AM - 8:00 PM',
  location: '대학 중앙광장 및 잔디밭',
  locationDetail: 'Seoul',
  description: '우리 대학의 가장 큰 축제! 다채로운 공연과 부스, 이벤트로 가득한 3일간의 즐거움',
  poster: '/api/placeholder/800/1200',
  going: 142,
  tags: ['# 축제', '# 공연', '# 부스'],
  host: '대학 축제 준비위원회',
}

export default function Home() {
  const currentDate = getCurrentDate()
  return (
    <main className="min-h-screen bg-[#17161C]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 왼쪽: 포스터 이미지 */}
          <div className="order-2 lg:order-1">
            <div
              className="w-full aspect-[3/4] bg-[#2A2930] rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${eventInfo.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* 포스터 이미지 */}
            </div>
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
                {eventInfo.name}
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
                    <div className="text-white font-semibold">{currentDate.dayOfWeek}</div>
                    <div className="text-white font-semibold mt-1">{eventInfo.time}</div>
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
                      <div className="text-white font-semibold">{eventInfo.location}</div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-400 mt-1">{eventInfo.locationDetail}</div>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <p className="text-gray-300 leading-relaxed">{eventInfo.description}</p>
              </div>

              {/* 참가자 수 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <div className="text-sm text-gray-400 mb-3">
                  {eventInfo.going} GOING
                </div>
                <div className="flex items-center gap-2">
                  {/* 프로필 아바타들 */}
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
                    and {eventInfo.going - 4} others
                  </span>
                </div>
              </div>

              {/* 호스트 정보 */}
              <div className="mb-6 pb-6 border-b border-[#2A2930]">
                <div className="text-sm text-gray-400 mb-2">HOSTED BY</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C2FE0F] flex items-center justify-center text-[#17161C] font-bold">
                    축
                  </div>
                  <div>
                    <div className="text-white font-semibold">{eventInfo.host}</div>
                  </div>
                </div>
              </div>

              {/* 태그 */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {eventInfo.tags.map((tag, index) => (
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
                <button className="w-full px-6 py-3 bg-white text-[#17161C] font-semibold rounded-md hover:bg-gray-100 transition-colors">
                  참가 신청하기
                </button>
                <div className="flex gap-4 text-sm">
                  <button className="text-gray-400 hover:text-white transition-colors">
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
              <div className="text-white font-semibold mb-2">{eventInfo.location}</div>
              <div className="text-sm text-gray-400 mb-4">{eventInfo.locationDetail}</div>
              <div className="w-full h-64 bg-[#2A2930] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">지도가 여기에 표시됩니다</p>
                  <p className="text-xs text-gray-500">
                    Google Maps 또는 다른 지도 서비스를 연동할 수 있습니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 메뉴 섹션 */}
        <section className="mt-12 lg:mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">빠른 메뉴</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/notices"
              className="group bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 hover:border-[#C2FE0F]/50 transition-all hover:bg-[#2A2930]"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">공지사항</h3>
              <p className="text-sm text-gray-400">최신 행사 소식</p>
            </Link>

            <Link
              href="/booths"
              className="group bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 hover:border-[#C2FE0F]/50 transition-all hover:bg-[#2A2930]"
            >
              <div className="w-12 h-12 rounded-lg bg-[#C2FE0F]/20 flex items-center justify-center mb-4 group-hover:bg-[#C2FE0F]/30 transition-colors">
                <svg
                  className="w-6 h-6 text-[#C2FE0F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">부스 안내</h3>
              <p className="text-sm text-gray-400">음식·체험·홍보</p>
            </Link>

            <Link
              href="/performances"
              className="group bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 hover:border-[#C2FE0F]/50 transition-all hover:bg-[#2A2930]"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">공연 일정</h3>
              <p className="text-sm text-gray-400">타임테이블 확인</p>
            </Link>

            <Link
              href="/facilities"
              className="group bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 hover:border-[#C2FE0F]/50 transition-all hover:bg-[#2A2930]"
            >
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <svg
                  className="w-6 h-6 text-orange-400"
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
              <h3 className="text-lg font-semibold text-white mb-1">시설 위치</h3>
              <p className="text-sm text-gray-400">화장실·흡연장 등</p>
            </Link>
          </div>
        </section>

        {/* 주요 시설 안내 섹션 */}
        <section className="mt-12 lg:mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">주요 시설 안내</h2>
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-8 lg:p-12">
            <div className="relative w-full max-w-2xl mx-auto aspect-square">
              {/* 중앙 캠퍼스 행사장 아이콘 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#C2FE0F] flex items-center justify-center shadow-lg shadow-[#C2FE0F]/20">
                  <svg
                    className="w-12 h-12 lg:w-16 lg:h-16 text-[#17161C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white font-semibold text-sm lg:text-base">캠퍼스 행사장</p>
                </div>
              </div>

              {/* 주변 시설 아이콘들 */}
              {/* 상단 왼쪽 - 갤러리/사진 */}
              <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* 상단 오른쪽 - 정보 */}
              <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white text-xl lg:text-2xl font-bold">i</span>
                </div>
              </div>

              {/* 하단 왼쪽 - Wi-Fi */}
              <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M15 13a3 3 0 11-6 0 3 3 0 016 0zm-8-5a5.5 5.5 0 017.778 0M5 10.277a7.5 7.5 0 0114.001 0"
                    />
                  </svg>
                </div>
              </div>

              {/* 하단 오른쪽 - 위치 핀 */}
              <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 lg:w-8 lg:h-8 text-white"
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
