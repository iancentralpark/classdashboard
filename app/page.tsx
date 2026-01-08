'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [currentClass, setCurrentClass] = useState('1학년 3반')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
      }
      setCurrentDate(now.toLocaleDateString('ko-KR', dateOptions))
      setCurrentTime(now.toLocaleTimeString('ko-KR', timeOptions))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: '출석체크',
      description: '학생 출석을 확인하고 관리합니다',
      href: '/attendance',
      icon: '✓',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
    },
    {
      title: '쪽지시험',
      description: '빠른 쪽지시험을 생성하고 채점합니다',
      href: '/quiz',
      icon: '📝',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
    },
    {
      title: '슬라이드',
      description: '수업 자료를 보여주고 관리합니다',
      href: '/slides',
      icon: '📊',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white',
    },
    {
      title: '숙제관리',
      description: '숙제를 배포하고 제출 현황을 확인합니다',
      href: '/homework',
      icon: '📚',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-12 text-center">
        <div className="mb-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            {currentDate}
          </h1>
          <p className="text-2xl text-gray-600">{currentTime}</p>
        </div>
        <div className="mt-6">
          <div className="inline-block bg-white rounded-lg shadow-lg px-8 py-4">
            <p className="text-sm text-gray-500 mb-1">현재 수업 중인 학급</p>
            <h2 className="text-4xl font-bold text-primary-600">
              {currentClass}
            </h2>
          </div>
        </div>
      </div>

      {/* 기능 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group"
          >
            <div
              className={`${feature.color} ${feature.textColor} rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col items-center justify-center min-h-[250px]`}
            >
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-3xl font-bold mb-3">{feature.title}</h3>
              <p className="text-lg opacity-90 text-center">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}






