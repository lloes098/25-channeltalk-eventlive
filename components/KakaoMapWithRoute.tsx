'use client'

import { useEffect, useRef, useState } from 'react'

interface KakaoMapWithRouteProps {
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

export default function KakaoMapWithRoute({
  lat,
  lng,
  height = '600px',
  markers = [],
  level = 3,
}: KakaoMapWithRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapInstanceRef = useRef<any>(null)
  const [startPoint, setStartPoint] = useState<{ lat: number; lng: number } | null>(null)
  const [endPoint, setEndPoint] = useState<{ lat: number; lng: number } | null>(null)
  const [routeMode, setRouteMode] = useState<'selecting' | 'start' | 'end' | 'routed'>('selecting')
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const polylinesRef = useRef<any[]>([])
  const routeMarkersRef = useRef<any[]>([])

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

        // 기존 마커 표시
        if (markers.length > 0) {
          markers.forEach((marker) => {
            const markerPosition = new window.kakao.maps.LatLng(marker.lat, marker.lng)
            
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
            
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: markerElement,
              yAnchor: 0.5,
              xAnchor: 0.5,
            })
            
            customOverlay.setMap(map)

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
              
              markerElement.addEventListener('click', function () {
                infowindow.open(map, markerPosition)
              })
            }
          })
        }

        // 지도 클릭 이벤트 - 출발지/도착지 선택
        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
          const latlng = mouseEvent.latLng
          const clickedLat = latlng.getLat()
          const clickedLng = latlng.getLng()

          if (routeMode === 'start') {
            setStartPoint({ lat: clickedLat, lng: clickedLng })
            setRouteMode('end')
          } else if (routeMode === 'end') {
            setEndPoint({ lat: clickedLat, lng: clickedLng })
            setRouteMode('routed')
          }
        })

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
          window.kakao.maps.load(() => {
            initMap()
          })
        } else {
          initMap()
        }
      } else {
        return false
      }
      return true
    }

    if (!tryInitMap()) {
      const handleKakaoMapLoad = () => {
        tryInitMap()
      }

      window.addEventListener('kakaoMapLoaded', handleKakaoMapLoad)

      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval)
          tryInitMap()
        }
      }, 200)

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

  // 출발지/도착지 마커 표시 및 경로 계산
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return

    const map = mapInstanceRef.current

    // 기존 경로 및 마커 제거
    polylinesRef.current.forEach((polyline) => polyline.setMap(null))
    routeMarkersRef.current.forEach((marker) => marker.setMap(null))
    polylinesRef.current = []
    routeMarkersRef.current = []

    // 출발지 마커
    if (startPoint) {
      const startMarkerElement = document.createElement('div')
      startMarkerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #4A90E2;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      `
      startMarkerElement.textContent = '📍'

      const startOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng),
        content: startMarkerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      })
      startOverlay.setMap(map)
      routeMarkersRef.current.push(startOverlay)
    }

    // 도착지 마커
    if (endPoint) {
      const endMarkerElement = document.createElement('div')
      endMarkerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #E74C3C;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      `
      endMarkerElement.textContent = '🎯'

      const endOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(endPoint.lat, endPoint.lng),
        content: endMarkerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      })
      endOverlay.setMap(map)
      routeMarkersRef.current.push(endOverlay)
    }

    // 경로 계산 및 표시
    if (startPoint && endPoint) {
      // 카카오맵 REST API를 사용하여 경로 계산
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
      if (apiKey) {
        fetch(
          `https://dapi.kakao.com/v2/local/search/direction.json?origin=${startPoint.lng},${startPoint.lat}&destination=${endPoint.lng},${endPoint.lat}`,
          {
            headers: {
              Authorization: `KakaoAK ${apiKey}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0]
              
              // 경로 좌표 추출
              let path: any[] = []
              if (route.sections && route.sections.length > 0) {
                route.sections.forEach((section: any) => {
                  if (section.roads) {
                    section.roads.forEach((road: any) => {
                      if (road.vertexes) {
                        // vertexes는 [lng, lat, lng, lat, ...] 형식
                        for (let i = 0; i < road.vertexes.length; i += 2) {
                          if (i + 1 < road.vertexes.length) {
                            path.push(new window.kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]))
                          }
                        }
                      }
                    })
                  }
                })
              }

              // 경로가 있으면 표시
              if (path.length > 0) {
                const polyline = new window.kakao.maps.Polyline({
                  path: path,
                  strokeWeight: 5,
                  strokeColor: '#C2FE0F',
                  strokeOpacity: 0.8,
                  strokeStyle: 'solid',
                })
                polyline.setMap(map)
                polylinesRef.current.push(polyline)

                // 경로 정보
                const distance = route.summary?.distance || 0
                const duration = route.summary?.duration || 0
                const distanceKm = (distance / 1000).toFixed(1)
                const durationMin = duration > 0 ? Math.round(duration / 60) : 0

                setRouteInfo({
                  distance: `${distanceKm}km`,
                  duration: durationMin > 0 ? `${durationMin}분` : '계산 중',
                })
              } else {
                // 경로 데이터가 없으면 직선으로 표시
                drawStraightLine()
                return
              }

              // 경로가 보이도록 지도 범위 조정
              const bounds = new window.kakao.maps.LatLngBounds()
              bounds.extend(new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng))
              bounds.extend(new window.kakao.maps.LatLng(endPoint.lat, endPoint.lng))
              map.setBounds(bounds)
            } else {
              drawStraightLine()
            }
          })
          .catch((error) => {
            console.error('경로 계산 실패:', error)
            drawStraightLine()
          })
      } else {
        drawStraightLine()
      }
    }

    // 직선 경로 그리기 함수
    const drawStraightLine = () => {
      const path = [
        new window.kakao.maps.LatLng(startPoint!.lat, startPoint!.lng),
        new window.kakao.maps.LatLng(endPoint!.lat, endPoint!.lng),
      ]
      const polyline = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 5,
        strokeColor: '#C2FE0F',
        strokeOpacity: 0.8,
        strokeStyle: 'dashed',
      })
      polyline.setMap(map)
      polylinesRef.current.push(polyline)

      // 직선 거리 계산
      const distance = calculateDistance(startPoint!.lat, startPoint!.lng, endPoint!.lat, endPoint!.lng)
      setRouteInfo({
        distance: `${distance.toFixed(1)}km`,
        duration: '직선 거리',
      })

      // 경로가 보이도록 지도 범위 조정
      const bounds = new window.kakao.maps.LatLngBounds()
      bounds.extend(new window.kakao.maps.LatLng(startPoint!.lat, startPoint!.lng))
      bounds.extend(new window.kakao.maps.LatLng(endPoint!.lat, endPoint!.lng))
      map.setBounds(bounds)
    }
  }, [startPoint, endPoint, routeMode])

  // 직선 거리 계산 함수
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // 지구 반경 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleStartRoute = () => {
    setStartPoint(null)
    setEndPoint(null)
    setRouteInfo(null)
    setRouteMode('start')
  }

  const handleReset = () => {
    setStartPoint(null)
    setEndPoint(null)
    setRouteInfo(null)
    setRouteMode('selecting')
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ width: '100%', height }}
        className="rounded-lg relative"
      />
      
      {/* 길찾기 컨트롤 패널 */}
      <div className="absolute top-4 left-4 bg-[#1F1E24] border border-[#2A2930] rounded-lg p-4 shadow-lg z-10 min-w-[200px]">
        <div className="text-sm text-gray-400 mb-3">길찾기</div>
        
        {routeMode === 'selecting' && (
          <button
            onClick={handleStartRoute}
            className="w-full px-4 py-2 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
          >
            출발지 선택
          </button>
        )}

        {routeMode === 'start' && (
          <div className="space-y-2">
            <div className="text-sm text-[#C2FE0F]">지도를 클릭하여 출발지를 선택하세요</div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-[#2A2930] text-gray-300 font-semibold rounded-md hover:bg-[#3A3940] transition-colors"
            >
              취소
            </button>
          </div>
        )}

        {routeMode === 'end' && (
          <div className="space-y-2">
            <div className="text-sm text-white">
              출발지: 선택됨 ✓
            </div>
            <div className="text-sm text-[#C2FE0F]">지도를 클릭하여 도착지를 선택하세요</div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-[#2A2930] text-gray-300 font-semibold rounded-md hover:bg-[#3A3940] transition-colors"
            >
              취소
            </button>
          </div>
        )}

        {routeMode === 'routed' && routeInfo && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-400">거리</div>
              <div className="text-lg font-semibold text-white">{routeInfo.distance}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">예상 시간</div>
              <div className="text-lg font-semibold text-white">{routeInfo.duration}</div>
            </div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-[#2A2930] text-gray-300 font-semibold rounded-md hover:bg-[#3A3940] transition-colors mt-2"
            >
              다시 선택
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

