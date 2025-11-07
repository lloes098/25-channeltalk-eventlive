import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import ChannelTalk from '@/components/ChannelTalk'
import Script from 'next/script'

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
        <Script
          src="https://cdn.channel.io/plugin/ch-plugin-web-loader.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Header />
        {children}
        {channelTalkKey && <ChannelTalk pluginKey={channelTalkKey} />}
      </body>
    </html>
  )
}

