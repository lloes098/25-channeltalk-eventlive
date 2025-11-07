'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface FestivalMapProps {
  imagePath: string
  height?: string
}

export default function FestivalMap({ imagePath, height = '600px' }: FestivalMapProps) {
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(null)
  const [routeMode, setRouteMode] = useState<'selecting' | 'start' | 'end' | 'routed'>('selecting')
  const [routePath, setRoutePath] = useState<Array<{ x: number; y: number }>>([])
  const [routeDistance, setRouteDistance] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

  // 이미지 크기 측정
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current) {
        const container = imageRef.current
        const img = container.querySelector('img')
        if (img && img.complete) {
          // 컨테이너 크기 사용 (SVG 오버레이와 동일한 크기)
          setImageSize({ width: container.offsetWidth, height: container.offsetHeight })
        }
      }
    }

    // 이미지 로드 후 크기 업데이트
    const img = imageRef.current?.querySelector('img')
    if (img) {
      if (img.complete) {
        updateImageSize()
      } else {
        img.addEventListener('load', updateImageSize)
      }
    }

    updateImageSize()
    window.addEventListener('resize', updateImageSize)
    return () => {
      window.removeEventListener('resize', updateImageSize)
      if (img) {
        img.removeEventListener('load', updateImageSize)
      }
    }
  }, [imagePath])

  // 경로 계산 (직선 경로)
  const calculateRoute = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const path: Array<{ x: number; y: number }> = [start, end]
    setRoutePath(path)

    // 거리 계산 (픽셀 단위를 대략적인 미터로 변환)
    const dx = end.x - start.x
    const dy = end.y - start.y
    const pixelDistance = Math.sqrt(dx * dx + dy * dy)
    
    // 이미지 크기에 따라 스케일 조정 (대략적인 변환)
    const scale = imageSize ? Math.min(imageSize.width, imageSize.height) / 1000 : 1
    const distanceMeters = Math.round(pixelDistance * scale * 0.5) // 대략적인 미터 변환
    const distanceStr = distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`
    
    setRouteDistance(distanceStr)
  }

  // 이미지 클릭 핸들러
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const container = imageRef.current
    const img = container.querySelector('img')
    if (!img) return

    // 이미지의 실제 표시 영역 계산 (object-contain 고려)
    const containerRect = container.getBoundingClientRect()
    const imgNaturalWidth = img.naturalWidth
    const imgNaturalHeight = img.naturalHeight
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // object-contain 비율 계산
    const scaleX = containerWidth / imgNaturalWidth
    const scaleY = containerHeight / imgNaturalHeight
    const scale = Math.min(scaleX, scaleY)

    const displayedWidth = imgNaturalWidth * scale
    const displayedHeight = imgNaturalHeight * scale
    const offsetX = (containerWidth - displayedWidth) / 2
    const offsetY = (containerHeight - displayedHeight) / 2

    // 클릭 위치를 컨테이너 기준으로 변환
    const clickX = e.clientX - containerRect.left
    const clickY = e.clientY - containerRect.top

    // 이미지 표시 영역 내인지 확인
    if (
      clickX < offsetX ||
      clickY < offsetY ||
      clickX > offsetX + displayedWidth ||
      clickY > offsetY + displayedHeight
    ) {
      return
    }

    // 이미지 원본 좌표로 변환
    const relativeX = (clickX - offsetX) / scale
    const relativeY = (clickY - offsetY) / scale

    // SVG 좌표는 컨테이너 기준이므로 다시 변환
    const svgX = clickX
    const svgY = clickY

    if (routeMode === 'start') {
      setStartPoint({ x: svgX, y: svgY })
      setRouteMode('end')
    } else if (routeMode === 'end') {
      setEndPoint({ x: svgX, y: svgY })
      if (startPoint) {
        calculateRoute(startPoint, { x: svgX, y: svgY })
        setRouteMode('routed')
      }
    }
  }

  const handleStartRoute = () => {
    setStartPoint(null)
    setEndPoint(null)
    setRoutePath([])
    setRouteDistance(null)
    setRouteMode('start')
    setIsPanelOpen(true)
  }

  const handleReset = () => {
    setStartPoint(null)
    setEndPoint(null)
    setRoutePath([])
    setRouteDistance(null)
    setRouteMode('selecting')
    setIsPanelOpen(false)
  }

  const handleOpenPanel = () => {
    setIsPanelOpen(true)
    if (routeMode === 'routed') {
      // 이미 경로가 있으면 그대로 표시
    } else {
      setRouteMode('selecting')
    }
  }

  return (
    <div className="w-full bg-[#1F1E24] relative" style={{ height }}>
      {/* 길찾기 열기 버튼 (패널이 닫혀있을 때) */}
      {!isPanelOpen && (
        <button
          onClick={handleOpenPanel}
          className="absolute top-4 left-4 px-4 py-2 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors shadow-lg z-10"
        >
          길찾기
        </button>
      )}

      {/* 길찾기 컨트롤 패널 */}
      {isPanelOpen && (
        <div className="absolute top-4 left-4 bg-[#1F1E24] border border-[#2A2930] rounded-lg p-4 shadow-lg z-10 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">길찾기</div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
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

          {routeMode === 'routed' && routeDistance && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">거리</div>
                <div className="text-lg font-semibold text-white">{routeDistance}</div>
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
      )}

      {/* 지도 이미지 */}
      <div
        ref={imageRef}
        onClick={handleImageClick}
        className="w-full h-full relative overflow-hidden"
        style={{
          cursor: routeMode === 'start' || routeMode === 'end' ? 'crosshair' : 'default',
        }}
      >
        <Image
          src={imagePath}
          alt="대동제 지도"
          fill
          className="object-contain"
          priority
        />

        {/* SVG 오버레이 - 핀과 경로 표시 */}
        {imageSize && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* 경로 표시 */}
            {routePath.length > 1 && (
              <g>
                <polyline
                  points={routePath.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#C2FE0F"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                  opacity="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* 출발지 마커 */}
            {startPoint && (
              <g>
                {/* 그림자 효과 */}
                <circle
                  cx={startPoint.x}
                  cy={startPoint.y + 2}
                  r="18"
                  fill="rgba(0,0,0,0.3)"
                  opacity="0.5"
                />
                {/* 핀 원 */}
                <circle
                  cx={startPoint.x}
                  cy={startPoint.y}
                  r="16"
                  fill="#4A90E2"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                {/* 핀 아이콘 */}
                <text
                  x={startPoint.x}
                  y={startPoint.y + 6}
                  fontSize="20"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontWeight="bold"
                >
                  📍
                </text>
                {/* 라벨 배경 */}
                <rect
                  x={startPoint.x - 25}
                  y={startPoint.y - 35}
                  width="50"
                  height="20"
                  rx="4"
                  fill="#4A90E2"
                  opacity="0.9"
                />
                {/* 라벨 텍스트 */}
                <text
                  x={startPoint.x}
                  y={startPoint.y - 22}
                  fontSize="12"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  출발
                </text>
              </g>
            )}

            {/* 도착지 마커 */}
            {endPoint && (
              <g>
                {/* 그림자 효과 */}
                <circle
                  cx={endPoint.x}
                  cy={endPoint.y + 2}
                  r="18"
                  fill="rgba(0,0,0,0.3)"
                  opacity="0.5"
                />
                {/* 핀 원 */}
                <circle
                  cx={endPoint.x}
                  cy={endPoint.y}
                  r="16"
                  fill="#E74C3C"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                {/* 핀 아이콘 */}
                <text
                  x={endPoint.x}
                  y={endPoint.y + 6}
                  fontSize="20"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontWeight="bold"
                >
                  🎯
                </text>
                {/* 라벨 배경 */}
                <rect
                  x={endPoint.x - 25}
                  y={endPoint.y - 35}
                  width="50"
                  height="20"
                  rx="4"
                  fill="#E74C3C"
                  opacity="0.9"
                />
                {/* 라벨 텍스트 */}
                <text
                  x={endPoint.x}
                  y={endPoint.y - 22}
                  fontSize="12"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  도착
                </text>
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  )
}

