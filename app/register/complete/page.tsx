'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getEventById } from '@/utils/events'

function RegisterCompleteContent() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event') || ''
  const event = eventId ? getEventById(eventId) : null
  
  const [registrationId, setRegistrationId] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    // 랜덤 참가 ID 생성
    const id = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setRegistrationId(id)

    // QR 코드 URL 생성 (행사 ID + 랜덤 데이터)
    const qrData = eventId 
      ? `${eventId}-${id}-${Math.random().toString(36).substr(2, 16)}`
      : `${id}-${Math.random().toString(36).substr(2, 16)}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
    setQrCodeUrl(qrUrl)
  }, [eventId])

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* 성공 메시지 */}
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-[#C2FE0F] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#17161C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">참가 신청되었습니다!</h1>
            {event && (
              <p className="text-lg text-[#C2FE0F] mb-2">{event.name}</p>
            )}
            <p className="text-gray-400">현장 인증을 위해 아래 QR 코드를 보여주세요</p>
          </div>

          {/* QR 코드 섹션 */}
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">현장 인증 QR 코드</h2>
              
              {qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      width={256}
                      height={256}
                      className="w-64 h-64"
                      unoptimized
                    />
                  </div>
                  <p className="text-sm text-gray-400 mb-2">참가 번호</p>
                  <p className="text-lg font-mono text-[#C2FE0F] mb-6">{registrationId}</p>
                </div>
              ) : (
                <div className="w-64 h-64 bg-[#2A2930] rounded-lg mx-auto flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2FE0F]"></div>
                </div>
              )}

              <div className="mt-6 p-4 bg-[#2A2930] rounded-lg">
                <p className="text-sm text-gray-400 mb-2">안내사항</p>
                <ul className="text-sm text-gray-300 text-left space-y-1">
                  <li>• 행사 당일 현장에서 이 QR 코드를 보여주세요</li>
                  <li>• QR 코드는 스크린샷으로 저장해두시면 편리합니다</li>
                  <li>• 참가 번호를 메모해두시면 분실 시 도움이 됩니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-6 flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-white text-[#17161C] font-semibold rounded-md hover:bg-gray-100 transition-colors text-center"
            >
              홈으로 돌아가기
            </Link>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-[#2A2930] text-white font-semibold rounded-md hover:bg-[#3A3940] transition-colors"
            >
              인쇄하기
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function RegisterCompletePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#17161C] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2FE0F] mx-auto"></div>
              <p className="text-gray-400 mt-4">로딩 중...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <RegisterCompleteContent />
    </Suspense>
  )
}

