'use client'

import { useState } from 'react'
import AttendanceTab from '@/components/AttendanceTab'

export default function SlidesPage() {
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 출석체크 탭 토글 버튼 */}
      {!isAttendanceVisible && (
        <button
          onClick={() => setIsAttendanceVisible(true)}
          className="fixed top-20 left-4 z-40 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          title="출석 현황 보기"
        >
          <span>📋</span>
          <span>출석 현황</span>
        </button>
      )}

      {/* 출석체크 탭 */}
      <AttendanceTab
        isVisible={isAttendanceVisible}
        onToggle={() => setIsAttendanceVisible(false)}
      />

      {/* 슬라이드 컨텐츠 */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">슬라이드</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-4">
            슬라이드 기능이 곧 추가될 예정입니다.
          </p>
          <p className="text-sm text-gray-500">
            좌측 상단의 출석 현황 탭을 통해 학생들의 출석 상태와 쪽지시험 점수를
            확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
