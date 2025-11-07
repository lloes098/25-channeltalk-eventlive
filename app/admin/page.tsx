'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'commands' | 'notices' | 'logs' | 'locations'>('commands')
  const [commands, setCommands] = useState([
    { id: 1, command: '/입장줄', response: '30분' },
    { id: 2, command: '/화장실', response: '운동장 북쪽 입구 옆' },
  ])
  const [newCommand, setNewCommand] = useState({ command: '', response: '' })

  const handleAddCommand = () => {
    if (newCommand.command && newCommand.response) {
      setCommands([
        ...commands,
        { id: commands.length + 1, ...newCommand },
      ])
      setNewCommand({ command: '', response: '' })
    }
  }

  return (
    <main className="min-h-screen bg-[#17161C] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-8">관리자 페이지</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-8 border-b border-[#2A2930]">
          {[
            { id: 'commands', label: 'Command 관리' },
            { id: 'notices', label: '공지 등록' },
            { id: 'logs', label: '문의 로그' },
            { id: 'locations', label: '위치 관리' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#C2FE0F] border-b-2 border-[#C2FE0F]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Command 관리 */}
        {activeTab === 'commands' && (
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Command 등록</h2>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="/입장줄"
                  value={newCommand.command}
                  onChange={(e) =>
                    setNewCommand({ ...newCommand, command: e.target.value })
                  }
                  className="flex-1 px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
                />
                <input
                  type="text"
                  placeholder="응답 내용"
                  value={newCommand.response}
                  onChange={(e) =>
                    setNewCommand({ ...newCommand, response: e.target.value })
                  }
                  className="flex-1 px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
                />
                <button
                  onClick={handleAddCommand}
                  className="px-6 py-2 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors"
                >
                  등록
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white mb-4">등록된 Command</h3>
              {commands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-center justify-between p-4 bg-[#17161C] rounded-lg border border-[#2A2930]"
                >
                  <div>
                    <span className="text-[#C2FE0F] font-mono">{cmd.command}</span>
                    <span className="text-gray-400 mx-3">→</span>
                    <span className="text-gray-300">{cmd.response}</span>
                  </div>
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공지 등록 */}
        {activeTab === 'notices' && (
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">공지 등록</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="공지 제목"
                className="w-full px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
              />
              <textarea
                placeholder="공지 내용"
                rows={10}
                className="w-full px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  주요 공지로 고정
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  ChannelTalk Broadcast 전송
                </label>
              </div>
              <button className="px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors">
                공지 등록
              </button>
            </div>
          </div>
        )}

        {/* 문의 로그 */}
        {activeTab === 'logs' && (
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">문의 로그</h2>
            <div className="mb-4 flex justify-end">
              <button className="px-4 py-2 bg-[#2A2930] text-white rounded-md hover:bg-[#3A3940] transition-colors">
                CSV 다운로드
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  id: 1,
                  user: '사용자1',
                  message: '입장줄 얼마나 걸려요?',
                  response: '30분',
                  responseTime: '2분',
                  timestamp: '2024.05.20 14:30',
                },
              ].map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-[#17161C] rounded-lg border border-[#2A2930]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold">{log.user}</span>
                    <span className="text-gray-400 text-sm">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-300 mb-2">Q: {log.message}</p>
                  <p className="text-[#C2FE0F]">A: {log.response}</p>
                  <p className="text-gray-500 text-sm mt-2">응답 시간: {log.responseTime}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 위치 관리 */}
        {activeTab === 'locations' && (
          <div className="bg-[#1F1E24] border border-[#2A2930] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">시설 위치 관리</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="시설명 (예: 화장실)"
                  className="px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
                />
                <select className="px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white focus:outline-none focus:border-[#C2FE0F]">
                  <option>화장실</option>
                  <option>흡연장</option>
                  <option>쓰레기통</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="위도"
                  className="px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
                />
                <input
                  type="number"
                  placeholder="경도"
                  className="px-4 py-2 bg-[#17161C] border border-[#2A2930] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#C2FE0F]"
                />
              </div>
              <button className="px-6 py-3 bg-[#C2FE0F] text-[#17161C] font-semibold rounded-md hover:bg-[#B0E80D] transition-colors">
                위치 등록
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">등록된 시설</h3>
              <div className="space-y-2">
                {[
                  { id: 1, name: '화장실', type: 'restroom', lat: 37.5665, lng: 126.9780 },
                  { id: 2, name: '흡연장', type: 'smoking', lat: 37.5666, lng: 126.9781 },
                ].map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between p-4 bg-[#17161C] rounded-lg border border-[#2A2930]"
                  >
                    <div>
                      <span className="text-white font-semibold">{facility.name}</span>
                      <span className="text-gray-400 ml-3">
                        ({facility.lat}, {facility.lng})
                      </span>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

