// 행사 데이터
export interface Event {
  id: string
  name: string
  time: string
  location: string
  locationDetail: string
  description: string
  poster: string
  going: number
  tags: string[]
  host: string
  lat: number
  lng: number
}

export const events: Event[] = [
  {
    id: 'yonsei-festival',
    name: '연세대학교 대동제',
    time: '5월 27일 - 5월 30일, 10:00 AM - 10:00 PM',
    location: '연세대학교 신촌캠퍼스',
    locationDetail: '서울특별시 서대문구 연세로 50',
    description: '연세대학교의 전통 있는 대동제! 다양한 공연, 부스, 체험 프로그램이 준비되어 있습니다.',
    poster: '/img/2025_대동제_책자_내지-01.png',
    going: 342,
    tags: ['# 대동제', '# 공연', '# 부스', '# 체험'],
    host: '연세대학교 학생회',
    lat: 37.5640,
    lng: 126.9369,
  },
  {
    id: 'rock-festival',
    name: '2025 락페스티벌',
    time: '7월 4일 - 7월 26일, 2:00 PM - 11:00 PM',
    location: '국립극장 달오름, 하늘',
    locationDetail: '서울특별시 중구 장충단로 59',
    description: '국내 최고의 락 페스티벌! 최고의 밴드들과 함께하는 뜨거운 여름밤을 경험하세요.',
    poster: '/img/2025_락페스티벌.jpg',
    going: 1250,
    tags: ['# 락페스티벌', '# 음악', '# 공연', '# 야외'],
    host: '락페스티벌 조직위원회',
    lat: 37.5219,
    lng: 127.1264,
  },
  {
    id: 'hackathon',
    name: '2025 HACKY TALKY',
    time: '11월 07일 - 11월 08일, 9:00 AM - 6:00 PM',
    location: 'GS타워',
    locationDetail: '서울특별시 강남구 논현로 508 GS타워 8층 (채널톡 오피스)',
    description: '개발자들의 축제! 24시간 동안 아이디어를 현실로 만들어보세요. 다양한 시상과 네트워킹 기회가 기다립니다.',
    poster: '/img/2025_hacky_talky.jpeg',
    going: 156,
    tags: ['# 해커톤', '# 개발', '# 창업', '# 네트워킹'],
    host: '해커톤 조직위원회',
    lat: 37.5083,
    lng: 127.0378,
  },
]

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}

