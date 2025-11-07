import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#17161C] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#C2FE0F] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  )
}

