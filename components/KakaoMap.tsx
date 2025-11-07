'use client'

import { useEffect, useRef, useState } from 'react'

interface KakaoMapProps {
  lat: number
  lng: number
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
  }>
  level?: number
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMap({
  lat,
  lng,
  height = '256px',
  markers = [],
  level = 3,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // 카카오맵 초기화 함수
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.warn('카카오맵 스크립트가 아직 로드되지 않았습니다.')
        return false
      }

      if (!mapRef.current) return false

      // 이미 지도가 생성되어 있으면 스킵
      if (mapInstanceRef.current) {
        return true
      }

      try {
        // 지도 생성
        const container = mapRef.current
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: level,
        }

        const map = new window.kakao.maps.Map(container, options)
        mapInstanceRef.current = map

        // 마커가 있으면 추가
        if (markers.length > 0) {
          markers.forEach((marker) => {
            const markerPosition = new window.kakao.maps.LatLng(marker.lat, marker.lng)
            const kakaoMarker = new window.kakao.maps.Marker({
              position: markerPosition,
            })
            kakaoMarker.setMap(map)

            // 마커에 제목이 있으면 인포윈도우 추가
            if (marker.title) {
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${marker.title}</div>`,
              })
              window.kakao.maps.event.addListener(kakaoMarker, 'click', function () {
                infowindow.open(map, kakaoMarker)
              })
            }
          })
        } else {
          // 마커가 없으면 중심 위치에 마커 추가
          const markerPosition = new window.kakao.maps.LatLng(lat, lng)
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          })
          marker.setMap(map)
        }

        setIsLoaded(true)
        return true
      } catch (error: any) {
        console.error('카카오맵 초기화 오류:', error)
        return false
      }
    }

    // 카카오맵 초기화 시도
    const tryInitMap = () => {
      if (window.kakao && window.kakao.maps) {
        if (window.kakao.maps.load) {
          // 아직 완전히 로드되지 않음
          window.kakao.maps.load(() => {
            initMap()
          })
        } else {
          // 이미 로드됨
          initMap()
        }
      } else {
        return false
      }
      return true
    }

    // 즉시 시도
    if (!tryInitMap()) {
      // 카카오맵 로드 이벤트 리스너
      const handleKakaoMapLoad = () => {
        tryInitMap()
      }

      window.addEventListener('kakaoMapLoaded', handleKakaoMapLoad)

      // 주기적으로 확인 (스크립트가 나중에 로드될 수 있음)
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval)
          tryInitMap()
        }
      }, 200)

      // 타임아웃 설정 (5초 후에도 로드되지 않으면 에러 표시하지 않음)
      const timeout = setTimeout(() => {
        // 에러 메시지 표시하지 않음
      }, 5000)

      return () => {
        window.removeEventListener('kakaoMapLoaded', handleKakaoMapLoad)
        clearInterval(checkInterval)
        clearTimeout(timeout)
      }
    }
  }, [lat, lng, markers, level])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height }}
      className="rounded-lg relative"
    >
    </div>
  )
}

