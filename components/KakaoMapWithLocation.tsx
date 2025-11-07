'use client'

import { useEffect, useRef, useState } from 'react'
import KakaoMap from './KakaoMap'

interface KakaoMapWithLocationProps {
  defaultLat?: number
  defaultLng?: number
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
  }>
  level?: number
}

export default function KakaoMapWithLocation({
  defaultLat = 37.5665,
  defaultLng = 126.9780,
  height = '600px',
  markers = [],
  level = 3,
}: KakaoMapWithLocationProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 현재 위치 가져오기
    if (typeof window === 'undefined' || !navigator.geolocation) {
      // 서버 사이드 렌더링이거나 Geolocation을 지원하지 않는 경우
      setIsLoading(false)
      return
    }

    // 위치 정보 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
        setLocationError(null)
      },
      (error) => {
        console.warn('위치 정보를 가져올 수 없습니다:', error)
        
        // 오류 타입에 따른 메시지
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        let errorDetails = ''
        
        if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다.'
          errorDetails = '브라우저 주소창의 자물쇠 아이콘을 클릭하여 위치 권한을 허용해주세요.'
        } else if (error.code === 2 || error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = '위치 정보를 사용할 수 없습니다.'
          errorDetails = '시스템 위치 서비스를 확인해주세요.\n• macOS: 시스템 설정 > 개인정보 보호 및 보안 > 위치 서비스\n• Windows: 설정 > 개인정보 > 위치'
        } else if (error.code === 3 || error.code === error.TIMEOUT) {
          errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
          errorDetails = '네트워크 연결을 확인하고 다시 시도해주세요.'
        }
        
        // 위치 정보를 사용할 수 없어도 기본 위치로 지도는 표시
        setLocationError(errorMessage + (errorDetails ? `\n${errorDetails}` : ''))
        setIsLoading(false)
      },
      {
        enableHighAccuracy: false, // WiFi/IP 기반 위치 사용 (더 빠름)
        timeout: 10000, // 타임아웃
        maximumAge: 300000, // 5분간 캐시된 위치 허용
      }
    )
  }, [defaultLat, defaultLng])

  // 현재 위치를 포함한 모든 마커
  const allMarkers = [
    ...(userLocation
      ? [
          {
            lat: userLocation.lat,
            lng: userLocation.lng,
            title: '내 위치',
          },
        ]
      : []),
    ...markers,
  ]

  // 지도 중심을 현재 위치로 설정 (현재 위치가 있으면)
  const centerLat = userLocation ? userLocation.lat : defaultLat
  const centerLng = userLocation ? userLocation.lng : defaultLng

  if (isLoading) {
    return (
      <div
        style={{ width: '100%', height }}
        className="rounded-lg bg-[#2A2930] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2FE0F] mx-auto mb-4"></div>
          <p className="text-gray-400">위치 정보를 가져오는 중...</p>
        </div>
      </div>
    )
  }

  const handleRetryLocation = () => {
    setIsLoading(true)
    setLocationError(null)
    
    if (!navigator.geolocation) {
      setLocationError('이 브라우저는 위치 정보를 지원하지 않습니다.')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoading(false)
        setLocationError(null)
      },
      (error) => {
        console.warn('위치 정보를 가져올 수 없습니다:', error)
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        let errorDetails = ''
        
        if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다.'
          errorDetails = '브라우저 주소창의 자물쇠 아이콘을 클릭하여 위치 권한을 허용해주세요.'
        } else if (error.code === 2 || error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = '위치 정보를 사용할 수 없습니다.'
          errorDetails = '시스템 위치 서비스를 확인해주세요.\n• macOS: 시스템 설정 > 개인정보 보호 및 보안 > 위치 서비스\n• Windows: 설정 > 개인정보 > 위치'
        } else if (error.code === 3 || error.code === error.TIMEOUT) {
          errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
          errorDetails = '네트워크 연결을 확인하고 다시 시도해주세요.'
        }
        
        setLocationError(errorMessage + (errorDetails ? `\n${errorDetails}` : ''))
        setIsLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0, // 재시도 시 캐시 사용 안 함
      }
    )
  }

  return (
    <div className="relative">
      <KakaoMap
        lat={centerLat}
        lng={centerLng}
        height={height}
        markers={allMarkers}
        level={level}
      />
      {userLocation && !locationError && (
        <div className="absolute top-4 right-4 bg-[#C2FE0F] text-[#17161C] px-4 py-2 rounded-md text-sm font-semibold">
          📍 내 위치 표시됨
        </div>
      )}
    </div>
  )
}

