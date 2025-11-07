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
    if (!pluginKey) return
    if (window.ChannelIOInitialized) return

    const w = window

    // ChannelIO 초기화 함수 (공식 스크립트 방식)
    const initChannelIO = () => {
      if (w.ChannelIO) {
        return w.console.error('ChannelIO script included twice.')
      }

      // ChannelIO 함수 설정
      const ch = function (args: any) {
        ch.c(arguments)
      } as any
      ch.q = []
      ch.c = function (args: any) {
        ch.q.push(args)
      }
      w.ChannelIO = ch

      // 플러그인 스크립트 로드 함수
      const loadPlugin = () => {
        if (w.ChannelIOInitialized) {
          return
        }
        w.ChannelIOInitialized = true

        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
        const x = document.getElementsByTagName('script')[0]
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x)
        }

        // 스크립트 로드 후 boot 실행
        s.onload = () => {
          if (w.ChannelIO) {
            try {
              w.ChannelIO('boot', {
                pluginKey: pluginKey,
                appearance: {
                  position: 'right',
                  xMargin: 20,
                  yMargin: 20,
                },
              })
              console.log('ChannelTalk initialized successfully')
            } catch (error) {
              console.error('ChannelTalk initialization error:', error)
            }
          }
        }
      }

      // DOM 로드 상태 확인
      if (document.readyState === 'complete') {
        loadPlugin()
      } else {
        w.addEventListener('DOMContentLoaded', loadPlugin)
        w.addEventListener('load', loadPlugin)
      }
    }

    // ChannelIO 초기화 시작
    initChannelIO()

    return () => {
      if (w.ChannelIO && window.ChannelIOInitialized) {
        try {
          w.ChannelIO('shutdown')
          window.ChannelIOInitialized = false
        } catch (error) {
          console.error('ChannelTalk shutdown error:', error)
        }
      }
    }
  }, [pluginKey])

  return null
}

