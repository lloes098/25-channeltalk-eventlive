'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    ChannelIO?: any
    __channelScriptAppended?: boolean
    __channelBooted?: boolean
  }
}

type Props = { pluginKey: string }

export default function ChannelTalk({ pluginKey }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!pluginKey) return

    const w = window

    // 이미 부트되어 있으면 아무 것도 안 함
    if (w.__channelBooted && typeof w.ChannelIO === 'function') {
      return
    }

    const boot = () => {
      if (w.__channelBooted) return
      if (typeof w.ChannelIO !== 'function') return

      try {
        w.ChannelIO('boot', { pluginKey }, (error: any) => {
          if (error) {
            console.error('[ChannelTalk] boot error:', error)
            return
          }
          w.__channelBooted = true
          // 필요 시 버튼 보이기
          try { w.ChannelIO('showChannelButton') } catch {}
          console.log('[ChannelTalk] booted')
        })
      } catch (e) {
        console.error('[ChannelTalk] boot threw:', e)
      }
    }

    // 스크립트가 이미 붙어 있고 실제 라이브러리 함수면 바로 부트
    if (typeof w.ChannelIO === 'function') {
      boot()
      return
    }

    // 아직 로드 전이면 로더 삽입 (한 번만)
    if (!w.__channelScriptAppended) {
      w.__channelScriptAppended = true

      // 공식 권장 큐 스텁 (중복 호출 안전)
      ;(function() {
        const ch: any = function() { ch.c(arguments) }
        ch.q = []
        ch.c = function(args: any) { ch.q.push(args) }
        w.ChannelIO = ch
      })()

      const s = document.createElement('script')
      s.async = true
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
      s.onload = () => boot()
      s.onerror = () => {
        console.error('[ChannelTalk] script load failed')
        w.__channelScriptAppended = false
      }
      document.head.appendChild(s)
    } else {
      // 스크립트는 붙었지만 아직 로딩 중인 경우: 로딩 완료 후 부트를 한 번 더 시도
      const retry = setInterval(() => {
        if (typeof w.ChannelIO === 'function') {
          clearInterval(retry)
          boot()
        }
      }, 300)
      // 10초 후 포기
      setTimeout(() => clearInterval(retry), 10000)
    }

    // 전역 1회만 종료하도록: 이 컴포넌트가 전역에서 한 번만 쓰이는 전제라면 cleanup은 생략 가능
    return () => {
      // 개발 중 잦은 HMR로 리로드될 때 강제 종료를 원하면 주석 해제
      // try { if (w.ChannelIO) { w.ChannelIO('shutdown'); w.__channelBooted = false } } catch {}
    }
  }, [pluginKey])

  return null
}
