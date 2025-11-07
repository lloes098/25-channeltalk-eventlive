import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import ChannelTalk from '@/components/ChannelTalk'
import KakaoMapScript from '@/components/KakaoMapScript'

export const metadata: Metadata = {
  title: 'EVENTOK',
  description: 'EVENTOK - Live event management platform',
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

