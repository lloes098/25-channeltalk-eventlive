import Link from 'next/link'

// 임시 데이터
const notices = [
  {
    id: 1,
    title: '축제 안전 수칙 안내',
    content: '축제 기간 중 안전하게 즐기실 수 있도록 다음 사항을 준수해 주세요.',
    date: '2024.05.19',
    isPinned: true,
    image: '/api/placeholder/800/400',
  },
  {
    id: 2,
    title: '주차장 이용 안내',
    content: '축제 기간 중 주차장 이용에 대한 안내입니다.',
    date: '2024.05.18',
    isPinned: false,
    image: null,
  },
  {
    id: 3,
    title: '비 대비 공지',
    content: '우천 시 축제 진행 방안에 대한 안내입니다.',
    date: '2024.05.17',
    isPinned: false,
    image: null,
  },
]

export default function NoticesPage() {
  const pinnedNotices = notices.filter((n) => n.isPinned)
  const regularNotices = notices.filter((n) => !n.isPinned)

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">공지사항</h1>

        {/* 고정 공지 */}
        {pinnedNotices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#C2FE0F] mb-4">주요 공지</h2>
            <div className="space-y-4">
              {pinnedNotices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="block bg-[#1F1E24] border border-[#C2FE0F] rounded-lg p-6 hover:bg-[#2A2930] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {notice.image && (
                      <div
                        className="w-24 h-24 bg-[#2A2930] rounded-lg flex-shrink-0"
                        style={{
                          backgroundImage: `url(${notice.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#C2FE0F] text-[#17161C] text-xs font-semibold rounded">
                          고정
                        </span>
                        <span className="text-sm text-gray-400">{notice.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-2">{notice.content}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 일반 공지 */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">전체 공지</h2>
          <div className="space-y-3">
            {regularNotices.map((notice) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6 hover:border-[#C2FE0F] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {notice.content}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 ml-4">{notice.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

