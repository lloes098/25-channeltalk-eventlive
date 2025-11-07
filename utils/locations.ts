// 시설 및 부스 위치 데이터
export interface Location {
  id: number
  name: string
  type?: string
  lat: number
  lng: number
}

export const facilities: Location[] = [
  { id: 1, name: '화장실', type: 'restroom', lat: 37.5665, lng: 126.9780 },
  { id: 2, name: '흡연장', type: 'smoking', lat: 37.5666, lng: 126.9781 },
  { id: 3, name: '쓰레기통', type: 'trash', lat: 37.5667, lng: 126.9782 },
]

export const booths: Location[] = [
  { id: 1, name: '맛있는 푸드트럭', lat: 37.5665, lng: 126.9780 },
  { id: 2, name: '체험 부스', lat: 37.5666, lng: 126.9781 },
  { id: 3, name: '홍보 부스', lat: 37.5667, lng: 126.9782 },
]

export const stages: Location[] = [
  { id: 1, name: '메인 무대', lat: 37.5665, lng: 126.9780 },
  { id: 2, name: '서브 무대', lat: 37.5666, lng: 126.9781 },
]

// 모든 위치 데이터 통합
export const allLocations: Location[] = [
  ...facilities,
  ...booths,
  ...stages,
]

// 키워드 매칭을 위한 별칭
const locationAliases: Record<string, string[]> = {
  화장실: ['화장실', 'restroom', 'toilet', 'wc', '화장실 위치'],
  흡연장: ['흡연장', 'smoking', '담배', '흡연구역'],
  쓰레기통: ['쓰레기통', 'trash', '쓰레기', 'garbage'],
  행사장: ['행사장', '메인 무대', '무대', 'stage', 'main stage'],
  부스: ['부스', 'booth', '푸드트럭', 'food'],
}

// 두 좌표 간 거리 계산 (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
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

// 키워드로 위치 찾기
export function findLocationByKeyword(keyword: string): Location | null {
  const normalizedKeyword = keyword.trim().toLowerCase()

  // 직접 이름 매칭
  const directMatch = allLocations.find(
    (loc) => loc.name.toLowerCase() === normalizedKeyword
  )
  if (directMatch) return directMatch

  // 별칭으로 매칭
  for (const [locationName, aliases] of Object.entries(locationAliases)) {
    if (aliases.some((alias) => normalizedKeyword.includes(alias.toLowerCase()))) {
      const match = allLocations.find((loc) => loc.name === locationName)
      if (match) return match
    }
  }

  // 부분 매칭
  const partialMatch = allLocations.find((loc) =>
    loc.name.toLowerCase().includes(normalizedKeyword)
  )
  if (partialMatch) return partialMatch

  return null
}

// 현재 위치에서 가장 가까운 시설 찾기
export function findNearestLocation(
  userLat: number,
  userLng: number,
  keyword?: string
): Location | null {
  let locations = allLocations

  // 키워드가 있으면 필터링
  if (keyword) {
    const keywordMatch = findLocationByKeyword(keyword)
    if (keywordMatch) {
      return keywordMatch
    }
    // 키워드로 필터링
    locations = locations.filter((loc) =>
      loc.name.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  if (locations.length === 0) return null

  // 가장 가까운 위치 찾기
  let nearest = locations[0]
  let minDistance = calculateDistance(userLat, userLng, nearest.lat, nearest.lng)

  for (const location of locations.slice(1)) {
    const distance = calculateDistance(userLat, userLng, location.lat, location.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = location
    }
  }

  return nearest
}

// 네이버 지도 길 찾기 URL 생성
export function generateNaverMapUrl(
  destinationLat: number,
  destinationLng: number,
  destinationName: string,
  userLat?: number,
  userLng?: number
): string {
  let url = `https://map.naver.com?lng=${destinationLng}&lat=${destinationLat}&title=${encodeURIComponent(destinationName)}`
  
  // 출발지(현재 위치)가 있으면 추가
  if (userLat && userLng) {
    url += `&start=${userLng},${userLat}`
  }
  
  return url
}

