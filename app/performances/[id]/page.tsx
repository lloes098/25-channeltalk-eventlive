import Link from 'next/link'
import { notFound } from 'next/navigation'

// 임시 데이터
const performances: Record<number, any> = {
  1: {
    id: 1,
    name: '메인 무대 공연',
    category: '교내',
    stage: '메인 무대',
    image: '/api/placeholder/800/400',
    startTime: '14:00',
    endTime: '15:00',
    performers: '학교 밴드',
    status: '진행중',
    description:
      '학교 밴드의 특별 공연입니다. 다양한 장르의 음악을 선보이며 축제의 분위기를 한층 더 끌어올립니다.',
    lat: 37.5665,
    lng: 126.9780,
  },
}

export default function PerformanceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const performance = performances[parseInt(params.id)]

  if (!performance) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/performances"
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
              backgroundImage: `url(${performance.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              {performance.status === '진행중' && (
                <span className="px-3 py-1 bg-[#C2FE0F] text-[#17161C] text-sm font-semibold rounded-full animate-pulse">
                  현재 무대 중
                </span>
              )}
              <span className="px-3 py-1 bg-[#2A2930] text-[#C2FE0F] text-sm rounded">
                {performance.category}
              </span>
              <span className="px-3 py-1 bg-[#2A2930] text-gray-400 text-sm rounded">
                {performance.stage}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              {performance.name}
            </h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {performance.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-[#C2FE0F] mb-2">공연 시간</h3>
                <p className="text-gray-300">
                  {performance.startTime} - {performance.endTime}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#C2FE0F] mb-2">출연진</h3>
                <p className="text-gray-300">{performance.performers}</p>
              </div>
            </div>

            <Link
              href="/performances/stages"
              className="inline-block px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
            >
              무대 위치 지도 보기
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}

