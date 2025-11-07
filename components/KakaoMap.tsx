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
    type?: 'restroom' | 'exit' | 'elevator' | 'stairs' | 'smoking' | 'cafe' | 'other'
    description?: string
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
            
            // 시설 타입별 아이콘 및 색상 설정
            const getMarkerInfo = (type?: string) => {
              switch (type) {
                case 'restroom':
                  return { emoji: '🚻', color: '#4A90E2' }
                case 'exit':
                  return { emoji: '🚪', color: '#E74C3C' }
                case 'elevator':
                  return { emoji: '🛗', color: '#9B59B6' }
                case 'stairs':
                  return { emoji: '🪜', color: '#F39C12' }
                case 'cafe':
                  return { emoji: '☕', color: '#27AE60' }
                default:
                  return { emoji: '📍', color: '#95A5A6' }
              }
            }

            const markerInfo = getMarkerInfo(marker.type)
            
            // DOM 요소 생성
            const markerElement = document.createElement('div')
            markerElement.style.cssText = `
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: ${markerInfo.color};
              border: 3px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            `
            markerElement.textContent = markerInfo.emoji
            
            // 커스텀 오버레이로 HTML 마커 생성
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: markerElement,
              yAnchor: 0.5,
              xAnchor: 0.5,
            })
            
            customOverlay.setMap(map)

            // 클릭 시 인포윈도우 표시
            if (marker.title) {
              const content = `
                <div style="padding:8px;font-size:13px;min-width:120px;">
                  <div style="font-weight:bold;margin-bottom:4px;">${marker.title}</div>
                  ${marker.description ? `<div style="font-size:11px;color:#666;">${marker.description}</div>` : ''}
                </div>
              `
              const infowindow = new window.kakao.maps.InfoWindow({
                content: content,
              })
              
              // 커스텀 오버레이 클릭 이벤트
              markerElement.addEventListener('click', function () {
                infowindow.open(map, markerPosition)
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

