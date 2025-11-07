'use client'

import { useState } from 'react'

interface FloorPlanProps {
  facilities?: Array<{
    id: string
    name: string
    type: 'restroom' | 'exit' | 'elevator' | 'stairs' | 'smoking' | 'cafe' | 'other'
    description?: string
  }>
}

export default function FloorPlan({ facilities = [] }: FloorPlanProps) {
  const [startPoint, setStartPoint] = useState<{ x: number; y: number; name: string } | null>(null)
  const [endPoint, setEndPoint] = useState<{ x: number; y: number; name: string } | null>(null)
  const [routeMode, setRouteMode] = useState<'selecting' | 'start' | 'end' | 'routed'>('selecting')
  const [routePath, setRoutePath] = useState<Array<{ x: number; y: number }>>([])
  const [routeDistance, setRouteDistance] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  // 시설 타입별 색상 및 아이콘
  const getFacilityStyle = (type: string) => {
    switch (type) {
      case 'restroom':
        return { color: '#4A90E2', emoji: '🚻', label: '화장실' }
      case 'cafe':
        return { color: '#27AE60', emoji: '☕', label: '카페' }
      case 'exit':
        return { color: '#E74C3C', emoji: '🚪', label: '출구' }
      case 'elevator':
        return { color: '#9B59B6', emoji: '🛗', label: '엘리베이터' }
      case 'stairs':
        return { color: '#F39C12', emoji: '🪜', label: '계단' }
      default:
        return { color: '#95A5A6', emoji: '📍', label: '시설' }
    }
  }

  // 클릭 위치에서 가장 가까운 시설 찾기
  const findNearestFacility = (clickX: number, clickY: number) => {
    let nearest: { id: string; name: string; x: number; y: number; distance: number } | null = null
    let minDistance = Infinity

    facilities.forEach((facility) => {
      const pos = facilityPositions[facility.id]
      if (pos) {
        const distance = Math.sqrt(Math.pow(clickX - pos.x, 2) + Math.pow(clickY - pos.y, 2))
        if (distance < minDistance) {
          minDistance = distance
          nearest = { id: facility.id, name: facility.name, x: pos.x, y: pos.y, distance }
        }
      }
    })

    // 복도나 주요 공간도 선택 가능하도록
    if (minDistance > 5) {
      // 복도 영역 체크
      if (clickX >= 25 && clickX <= 75) {
        return { id: 'corridor', name: '복도', x: clickX, y: clickY, distance: 0 }
      }
      // 좌측 사무실 구역
      if (clickX >= 0 && clickX <= 25) {
        return { id: 'office-area', name: '사무실 구역', x: clickX, y: clickY, distance: 0 }
      }
      // 우측 행사장 구역
      if (clickX >= 75 && clickX <= 100) {
        return { id: 'venue-area', name: '행사장 구역', x: clickX, y: clickY, distance: 0 }
      }
    }

    return nearest
  }

  // 경로 계산 (간단한 경로 찾기 알고리즘)
  const calculateRoute = (start: { x: number; y: number; name?: string }, end: { x: number; y: number; name?: string }) => {
    const path: Array<{ x: number; y: number }> = [start]

    // 복도를 통한 경로 계산
    const startInCorridor = start.x >= 25 && start.x <= 75
    const endInCorridor = end.x >= 25 && end.x <= 75

    if (!startInCorridor && !endInCorridor) {
      // 양쪽 모두 복도 밖이면 복도를 거쳐감
      const corridorY = (start.y + end.y) / 2
      path.push({ x: 25, y: corridorY })
      path.push({ x: 75, y: corridorY })
    } else if (!startInCorridor) {
      // 시작점만 복도 밖
      path.push({ x: 25, y: start.y })
      path.push({ x: 25, y: end.y })
    } else if (!endInCorridor) {
      // 도착점만 복도 밖
      path.push({ x: 75, y: start.y })
      path.push({ x: 75, y: end.y })
    } else {
      // 둘 다 복도 안이면 직선
      // 복도 내에서는 Y축으로만 이동
      if (Math.abs(start.x - end.x) < 5) {
        // 같은 복도 라인
        path.push(end)
      } else {
        // 다른 복도 라인
        const midY = (start.y + end.y) / 2
        path.push({ x: start.x, y: midY })
        path.push({ x: end.x, y: midY })
        path.push(end)
      }
    }

    // 거리 계산 (대략적인 거리)
    let distance = 0
    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x
      const dy = path[i + 1].y - path[i].y
      distance += Math.sqrt(dx * dx + dy * dy)
    }
    // 대략적인 미터 변환 (약도 스케일 기준)
    const distanceMeters = Math.round(distance * 2) // 1 단위 = 약 2미터
    const distanceStr = distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`

    setRoutePath(path)
    setRouteDistance(distanceStr)
  }

  // SVG 클릭 핸들러
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const viewBox = svg.viewBox.baseVal
    const scaleX = viewBox.width / rect.width
    const scaleY = viewBox.height / rect.height

    const clickX = (e.clientX - rect.left) * scaleX
    const clickY = (e.clientY - rect.top) * scaleY

    const nearest = findNearestFacility(clickX, clickY)

    // 출발지/도착지 선택 모드일 때만 시설 선택 처리
    if (routeMode === 'start') {
      if (nearest) {
        setStartPoint({ x: nearest.x, y: nearest.y, name: nearest.name })
        setRouteMode('end')
      }
      return
    } else if (routeMode === 'end') {
      if (nearest) {
        setEndPoint({ x: nearest.x, y: nearest.y, name: nearest.name })
        if (startPoint) {
          calculateRoute(startPoint, { x: nearest.x, y: nearest.y, name: nearest.name })
          setRouteMode('routed')
        }
      }
      return
    }

    // 패널이 열려있고 선택 모드가 아닐 때 약도 클릭하면 패널 닫기
    if (isPanelOpen && (routeMode === 'selecting' || routeMode === 'routed')) {
      setIsPanelOpen(false)
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

  // 시설 위치 매핑 (약도상 위치)
  const facilityPositions: Record<string, { x: number; y: number }> = {
    'restroom-1': { x: 15, y: 20 }, // 남자 화장실
    'restroom-2': { x: 15, y: 50 }, // 여자 화장실
    'cafe-1': { x: 50, y: 35 }, // 카페테리아
    'exit-1': { x: 50, y: 5 }, // 메인 출구
    'exit-2': { x: 85, y: 35 }, // 비상 출구
    'elevator-1': { x: 30, y: 35 }, // 엘리베이터
    'stairs-1': { x: 70, y: 35 }, // 계단
  }

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto relative">
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
            <div className="text-sm text-[#C2FE0F]">약도를 클릭하여 출발지를 선택하세요</div>
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
              출발지: {startPoint?.name || '선택됨'} ✓
            </div>
            <div className="text-sm text-[#C2FE0F]">약도를 클릭하여 도착지를 선택하세요</div>
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
              <div className="text-xs text-gray-400">출발지</div>
              <div className="text-sm font-semibold text-white">{startPoint?.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">도착지</div>
              <div className="text-sm font-semibold text-white">{endPoint?.name}</div>
            </div>
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

      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleSvgClick}
        style={{ cursor: routeMode === 'start' || routeMode === 'end' ? 'crosshair' : 'default' }}
      >
        {/* 배경 */}
        <rect width="100" height="60" fill="#F8F9FA" stroke="#E0E0E0" strokeWidth="0.5" />

        {/* 복도 (중앙) */}
        <rect x="25" y="0" width="50" height="60" fill="#E8E8E8" opacity="0.5" />
        <line x1="25" y1="0" x2="25" y2="60" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="75" y1="0" x2="75" y2="60" stroke="#D0D0D0" strokeWidth="1" />

        {/* 좌측 구역 - 사무실 */}
        <g>
          <rect x="0" y="0" width="25" height="60" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="1" />
          <text x="12.5" y="8" fontSize="3" fill="#666" textAnchor="middle" fontWeight="bold">
            사무실 구역
          </text>
          
          {/* 사무실 1 */}
          <rect x="2" y="12" width="10" height="8" fill="#E3F2FD" stroke="#2196F3" strokeWidth="0.5" />
          <text x="7" y="16.5" fontSize="2.5" fill="#1976D2" textAnchor="middle">사무실</text>
          <text x="7" y="19" fontSize="2" fill="#1976D2" textAnchor="middle">A</text>
          
          {/* 사무실 2 */}
          <rect x="13" y="12" width="10" height="8" fill="#E3F2FD" stroke="#2196F3" strokeWidth="0.5" />
          <text x="18" y="16.5" fontSize="2.5" fill="#1976D2" textAnchor="middle">사무실</text>
          <text x="18" y="19" fontSize="2" fill="#1976D2" textAnchor="middle">B</text>
          
          {/* 회의실 */}
          <rect x="2" y="22" width="21" height="10" fill="#FFF3E0" stroke="#FF9800" strokeWidth="0.5" />
          <text x="12.5" y="27" fontSize="3" fill="#F57C00" textAnchor="middle" fontWeight="bold">회의실</text>
          
          {/* 세미나실 */}
          <rect x="2" y="34" width="21" height="12" fill="#F3E5F5" stroke="#9C27B0" strokeWidth="0.5" />
          <text x="12.5" y="39" fontSize="3" fill="#7B1FA2" textAnchor="middle" fontWeight="bold">세미나실</text>
          
          {/* 탕비실 */}
          <rect x="2" y="48" width="10" height="10" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="0.5" />
          <text x="7" y="53" fontSize="2.5" fill="#388E3C" textAnchor="middle">탕비실</text>
        </g>

        {/* 우측 구역 - 행사장 */}
        <g>
          <rect x="75" y="0" width="25" height="60" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="1" />
          <text x="87.5" y="8" fontSize="3" fill="#666" textAnchor="middle" fontWeight="bold">
            행사장 구역
          </text>
          
          {/* 행사장 메인 */}
          <rect x="77" y="12" width="21" height="36" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="0.5" />
          <text x="87.5" y="28" fontSize="3.5" fill="#F57F17" textAnchor="middle" fontWeight="bold">
            행사장
          </text>
          
          {/* 부스 공간 */}
          <rect x="79" y="30" width="17" height="16" fill="#FFFFFF" stroke="#FBC02D" strokeWidth="0.3" strokeDasharray="1,1" />
          <text x="87.5" y="38" fontSize="2" fill="#F57F17" textAnchor="middle">부스 공간</text>
        </g>

        {/* 시설 마커 표시 */}
        {facilities.map((facility) => {
          const position = facilityPositions[facility.id]
          if (!position) return null

          const style = getFacilityStyle(facility.type)
          return (
            <g key={facility.id}>
              {/* 마커 원 */}
              <circle
                cx={position.x}
                cy={position.y}
                r="3"
                fill={style.color}
                stroke="#FFFFFF"
                strokeWidth="0.5"
                opacity="0.9"
              />
              {/* 이모지 */}
              <text
                x={position.x}
                y={position.y + 1}
                fontSize="2.5"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {style.emoji}
              </text>
              {/* 라벨 */}
              <text
                x={position.x}
                y={position.y + 5}
                fontSize="2"
                fill="#333"
                textAnchor="middle"
                fontWeight="bold"
              >
                {facility.name}
              </text>
            </g>
          )
        })}

        {/* 출입구 표시 */}
        <g>
          {/* 메인 출구 */}
          <rect x="48" y="0" width="4" height="2" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.3" />
          <text x="50" y="1.5" fontSize="1.5" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
            출
          </text>
          <text x="50" y="3.5" fontSize="1.8" fill="#E74C3C" textAnchor="middle" fontWeight="bold">
            메인 출구
          </text>
        </g>

        {/* 엘리베이터 표시 */}
        <g>
          <rect x="28" y="32" width="4" height="6" fill="#9B59B6" stroke="#7D3C98" strokeWidth="0.5" />
          <text x="30" y="35.5" fontSize="2" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
            🛗
          </text>
          <text x="30" y="39.5" fontSize="1.5" fill="#7D3C98" textAnchor="middle">
            엘리베이터
          </text>
        </g>

        {/* 계단 표시 */}
        <g>
          <rect x="68" y="32" width="4" height="6" fill="#F39C12" stroke="#D68910" strokeWidth="0.5" />
          <text x="70" y="35.5" fontSize="2" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
            🪜
          </text>
          <text x="70" y="39.5" fontSize="1.5" fill="#D68910" textAnchor="middle">
            계단
          </text>
        </g>

        {/* 경로 표시 */}
        {routePath.length > 1 && (
          <g>
            {/* 경로 선 */}
            <polyline
              points={routePath.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#C2FE0F"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.8"
            />
            {/* 경로 점들 */}
            {routePath.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="0.5"
                fill="#C2FE0F"
                stroke="#FFFFFF"
                strokeWidth="0.2"
              />
            ))}
          </g>
        )}

        {/* 출발지 마커 */}
        {startPoint && (
          <g>
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="2.5"
              fill="#4A90E2"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.9"
            />
            <text
              x={startPoint.x}
              y={startPoint.y + 0.5}
              fontSize="2"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              📍
            </text>
            <text
              x={startPoint.x}
              y={startPoint.y + 4}
              fontSize="2"
              fill="#4A90E2"
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
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="2.5"
              fill="#E74C3C"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.9"
            />
            <text
              x={endPoint.x}
              y={endPoint.y + 0.5}
              fontSize="2"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontWeight="bold"
            >
              🎯
            </text>
            <text
              x={endPoint.x}
              y={endPoint.y + 4}
              fontSize="2"
              fill="#E74C3C"
              textAnchor="middle"
              fontWeight="bold"
            >
              도착
            </text>
          </g>
        )}

        {/* 범례 */}
        <g>
          <rect x="1" y="1" width="12" height="8" fill="#FFFFFF" stroke="#D0D0D0" strokeWidth="0.3" opacity="0.9" />
          <text x="2" y="3" fontSize="1.8" fill="#333" fontWeight="bold">
            범례
          </text>
          <circle cx="2.5" cy="4.5" r="0.8" fill="#4A90E2" />
          <text x="4" y="5" fontSize="1.5" fill="#333">화장실</text>
          <circle cx="2.5" cy="6" r="0.8" fill="#27AE60" />
          <text x="4" y="6.5" fontSize="1.5" fill="#333">카페</text>
        </g>
      </svg>
    </div>
  )
}

