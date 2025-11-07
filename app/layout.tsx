import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import ChannelTalk from '@/components/ChannelTalk'

export const metadata: Metadata = {
  title: 'EventLive',
  description: 'EventLive - Live event management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const channelTalkKey = process.env.NEXT_PUBLIC_CHANNEL_TALK_KEY || ''

  return (
    <html lang="ko">
      <head>
      </head>
      <body>
        <Header />
        {children}
        {channelTalkKey && <ChannelTalk pluginKey={channelTalkKey} />}
      </body>
    </html>
  )
}

