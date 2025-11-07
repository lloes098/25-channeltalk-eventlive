'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    ChannelIO?: any
    ChannelIOInitialized?: boolean
  }
}

interface ChannelTalkProps {
  pluginKey: string
}

export default function ChannelTalk({ pluginKey }: ChannelTalkProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.ChannelIOInitialized) return

    const w = window
    const ch = w.ChannelIO
    if (ch) {
      ch('boot', {
        pluginKey: pluginKey,
      })
      window.ChannelIOInitialized = true
    } else {
      const l = () => {
        if (w.ChannelIO) {
          w.ChannelIO('boot', {
            pluginKey: pluginKey,
          })
          window.ChannelIOInitialized = true
        } else {
          setTimeout(l, 100)
        }
      }
      l()
    }

    return () => {
      if (w.ChannelIO) {
        w.ChannelIO('shutdown')
        window.ChannelIOInitialized = false
      }
    }
  }, [pluginKey])

  return null
}

