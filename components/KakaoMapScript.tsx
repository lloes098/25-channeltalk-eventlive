'use client'

import { useEffect } from 'react'

interface KakaoMapScriptProps {
  apiKey: string
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMapScript({ apiKey }: KakaoMapScriptProps) {
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (typeof window !== 'undefined' && window.kakao) {
      if (window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          window.dispatchEvent(new Event('kakaoMapLoaded'))
        })
      } else {
        window.dispatchEvent(new Event('kakaoMapLoaded'))
      }
      return
    }

    // 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.querySelector(
      `script[src*="dapi.kakao.com/v2/maps/sdk.js"]`
    )
    if (existingScript) {
      // 스크립트가 이미 있으면 로드 이벤트 대기
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao)
          if (window.kakao.maps.load) {
            window.kakao.maps.load(() => {
              window.dispatchEvent(new Event('kakaoMapLoaded'))
            })
          } else {
            window.dispatchEvent(new Event('kakaoMapLoaded'))
          }
        }
      }, 100)
      return () => clearInterval(checkKakao)
    }

    // 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`
    script.async = true
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          window.dispatchEvent(new Event('kakaoMapLoaded'))
        })
      }
    }
    script.onerror = (e) => {
      console.error('카카오맵 스크립트 로드 실패:', e)
    }
    document.head.appendChild(script)

    return () => {
      // cleanup은 스크립트를 제거하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    }
  }, [apiKey])

  return null
}

