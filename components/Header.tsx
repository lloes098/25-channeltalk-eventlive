'use client'

import Link from 'next/link'
import { useState } from 'react'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleInquiry = () => {
    if (typeof window !== 'undefined' && window.ChannelIO) {
      window.ChannelIO('showMessenger')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2A2930] bg-[#17161C]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-xl font-bold text-white">
              EventLive
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-[#C2FE0F] transition-colors whitespace-nowrap"
            >
              메인
            </Link>
            <Link
              href="/notices"
              className="text-sm font-medium text-white hover:text-[#C2FE0F] transition-colors whitespace-nowrap"
            >
              공지사항
            </Link>
            <Link
              href="/booths"
              className="text-sm font-medium text-white hover:text-[#C2FE0F] transition-colors whitespace-nowrap"
            >
              부스
            </Link>
            <Link
              href="/performances"
              className="text-sm font-medium text-white hover:text-[#C2FE0F] transition-colors whitespace-nowrap"
            >
              공연
            </Link>
            <Link
              href="/notices"
              className="px-4 py-2 bg-[#C2FE0F] text-[#17161C] text-sm font-semibold rounded-md hover:bg-[#B0E80D] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              공지
            </Link>
            <button
              onClick={handleInquiry}
              className="px-4 py-2 bg-[#C2FE0F] text-[#17161C] text-sm font-semibold rounded-md hover:bg-[#B0E80D] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              문의
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleInquiry}
              className="px-3 py-1.5 bg-[#C2FE0F] text-[#17161C] text-xs font-semibold rounded-md"
            >
              문의
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:bg-[#1F1E24] transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2A2930]">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-gray-300 hover:text-[#C2FE0F] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                메인
              </Link>
              <Link
                href="/notices"
                className="text-sm font-medium text-gray-300 hover:text-[#C2FE0F] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                공지사항
              </Link>
              <Link
                href="/booths"
                className="text-sm font-medium text-gray-300 hover:text-[#C2FE0F] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                부스
              </Link>
              <Link
                href="/performances"
                className="text-sm font-medium text-gray-300 hover:text-[#C2FE0F] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                공연
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

