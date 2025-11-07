'use client'

import { useState } from 'react'
import Link from 'next/link'

// 임시 데이터
const performances = [
  {
    id: 1,
    name: '메인 무대 공연',
    category: '교내',
    stage: '메인 무대',
    image: '/img/공연.jpg',
    startTime: '14:00',
    endTime: '15:00',
    performers: '학교 밴드',
    status: '진행중',
    description: '학교 밴드의 특별 공연입니다.',
  },
  {
    id: 2,
    name: '가수 공연',
    category: '가수',
    stage: '서브 무대',
    image: '/img/공연.jpg',
    startTime: '16:00',
    endTime: '17:00',
    performers: '인기 가수',
    status: '예정',
    description: '인기 가수의 특별 공연입니다.',
  },
  {
    id: 3,
    name: '댄스 공연',
    category: '교내',
    stage: '메인 무대',
    image: '/img/공연.jpg',
    startTime: '18:00',
    endTime: '19:00',
    performers: '댄스 동아리',
    status: '예정',
    description: '댄스 동아리의 화려한 공연입니다.',
  },
]

export default function PerformancesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'timetable'>('list')
  const currentPerformance = performances.find((p) => p.status === '진행중')

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">공연 정보</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#C2FE0F] text-[#17161C]'
                  : 'bg-[#1F1E24] text-gray-300 border border-[#2A2930]'
              }`}
            >
              리스트
            </button>
            <button
              onClick={() => setViewMode('timetable')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'timetable'
                  ? 'bg-[#C2FE0F] text-[#17161C]'
                  : 'bg-[#1F1E24] text-gray-300 border border-[#2A2930]'
              }`}
            >
              타임테이블
            </button>
          </div>
        </div>

        {/* 현재 진행 중 공연 */}
        {currentPerformance && (
          <div className="mb-8 bg-[#1F1E24] border-2 border-[#C2FE0F] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#C2FE0F] text-[#17161C] text-sm font-semibold rounded-full animate-pulse">
                현재 무대 중
              </span>
              <span className="text-sm text-gray-400">
                {currentPerformance.stage}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="w-full md:w-1/3 h-48 bg-[#2A2930] rounded-lg"
                style={{
                  backgroundImage: `url(${currentPerformance.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentPerformance.name}
                </h2>
                <p className="text-gray-300 mb-4">{currentPerformance.description}</p>
                <p className="text-gray-400 mb-4">출연: {currentPerformance.performers}</p>
                <p className="text-gray-400 mb-4">
                  시간: {currentPerformance.startTime} - {currentPerformance.endTime}
                </p>
                <Link
                  href={`/performances/${currentPerformance.id}`}
                  className="inline-block px-6 py-2 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
                >
                  상세 보기
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 공연 리스트 */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performances.map((performance) => (
              <Link
                key={performance.id}
                href={`/performances/${performance.id}`}
                className="bg-[#1F1E24] border border-[#2A2930] rounded-lg overflow-hidden hover:border-[#C2FE0F] transition-colors"
              >
                <div
                  className="w-full h-48 bg-[#2A2930]"
                  style={{
                    backgroundImage: `url(${performance.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-[#2A2930] text-[#C2FE0F] text-xs rounded">
                      {performance.category}
                    </span>
                    <span className="px-2 py-1 bg-[#2A2930] text-gray-400 text-xs rounded">
                      {performance.stage}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {performance.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {performance.startTime} - {performance.endTime}
                  </p>
                  <p className="text-sm text-gray-500">{performance.performers}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 타임테이블 */}
        {viewMode === 'timetable' && (
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
            <div className="space-y-4">
              {performances.map((performance) => (
                <div
                  key={performance.id}
                  className="flex items-center gap-4 p-4 bg-[#17161C] rounded-lg border border-[#2A2930]"
                >
                  <div className="w-24 text-center">
                    <p className="text-[#C2FE0F] font-semibold">
                      {performance.startTime}
                    </p>
                    <p className="text-gray-400 text-sm">{performance.endTime}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {performance.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {performance.stage} · {performance.performers}
                    </p>
                  </div>
                  <Link
                    href={`/performances/${performance.id}`}
                    className="px-4 py-2 bg-[#2A2930] text-white text-sm rounded-md hover:bg-[#3A3940] transition-colors"
                  >
                    상세
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 무대 위치 보기 */}
        <div className="mt-8 text-center">
          <Link
            href="/performances/stages"
            className="inline-block px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
          >
            무대 위치 지도 보기
          </Link>
        </div>
      </div>
    </main>
  )
}

