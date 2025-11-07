import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import ChannelTalk from '@/components/ChannelTalk'
import KakaoMapScript from '@/components/KakaoMapScript'

export const metadata: Metadata = {
  title: 'EVENTOK - 실시간 행사 관리 플랫폼',
  description: 'EVENTOK - ChannelTalk과 연동된 실시간 축제/행사 관리 플랫폼. 행사 정보, 공연 일정, 부스 안내, 공지사항을 한눈에 확인하세요.',
  keywords: ['행사', '축제', '이벤트', '공연', '부스', 'EVENTOK', 'EventLive'],
  authors: [{ name: 'EVENTOK' }],
  creator: 'EVENTOK',
  publisher: 'EVENTOK',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eventok.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'EVENTOK',
    title: 'EVENTOK - 실시간 행사 관리 플랫폼',
    description: 'ChannelTalk과 연동된 실시간 축제/행사 관리 플랫폼. 행사 정보, 공연 일정, 부스 안내, 공지사항을 한눈에 확인하세요.',
    images: [
      {
        url: '/img/2025_대동제_책자_내지-01.png',
        width: 1200,
        height: 630,
        alt: 'EVENTOK - 실시간 행사 관리 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EVENTOK - 실시간 행사 관리 플랫폼',
    description: 'ChannelTalk과 연동된 실시간 축제/행사 관리 플랫폼',
    images: ['/img/2025_대동제_책자_내지-01.png'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const channelTalkKey = process.env.NEXT_PUBLIC_CHANNEL_TALK_KEY || ''
  const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || ''

  return (
    <html lang="ko">
      <head>
      </head>
      <body>
        <Header />
        {children}
        {channelTalkKey && <ChannelTalk pluginKey={channelTalkKey} />}
        {kakaoMapKey && <KakaoMapScript apiKey={kakaoMapKey} />}
      </body>
    </html>
  )
}

