import Link from 'next/link'
import { notFound } from 'next/navigation'

// 임시 데이터
const notices: Record<number, any> = {
  1: {
    id: 1,
    title: '축제 안전 수칙 안내',
    content: `축제 기간 중 안전하게 즐기실 수 있도록 다음 사항을 준수해 주세요.

1. 인원이 많은 곳에서는 서로 배려하며 질서를 지켜주세요.
2. 화재 예방을 위해 지정된 흡연장 이외의 장소에서는 흡연을 금지합니다.
3. 음주 운전 및 음주 난동을 절대 금지합니다.
4. 응급 상황 발생 시 즉시 운영진에게 연락해 주세요.

즐거운 축제가 되도록 여러분의 협조 부탁드립니다.`,
    date: '2024.05.19',
    isPinned: true,
    image: null,
  },
}

export default function NoticeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const notice = notices[parseInt(params.id)]

  if (!notice) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/notices"
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

        <article className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            {notice.isPinned && (
              <span className="px-3 py-1 bg-[#C2FE0F] text-[#17161C] text-sm font-semibold rounded">
                고정
              </span>
            )}
            <span className="text-sm text-gray-400">{notice.date}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">{notice.title}</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {notice.content}
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}

