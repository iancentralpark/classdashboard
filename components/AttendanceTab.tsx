'use client'

import { useState, useEffect } from 'react'
import { getStudents, getTodayAttendance, Student, AttendanceRecord } from '@/lib/attendance'

interface AttendanceTabProps {
  isVisible: boolean
  onToggle: () => void
}

export default function AttendanceTab({ isVisible, onToggle }: AttendanceTabProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    const loadData = () => {
      setStudents(getStudents())
      setAttendance(getTodayAttendance())
    }
    
    loadData()
    // 실시간 업데이트를 위해 주기적으로 새로고침
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500'
      case 'late':
        return 'bg-yellow-500'
      case 'absent':
        return 'bg-red-500'
      case 'excused':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return '출석'
      case 'late':
        return '지각'
      case 'absent':
        return '결석'
      case 'excused':
        return '공결'
      default:
        return '미확인'
    }
  }

  const getStudentAttendance = (studentId: string): AttendanceRecord | undefined => {
    return attendance.find((a) => a.studentId === studentId)
  }

  return (
    <div className="fixed top-16 left-4 z-50 bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-h-[80vh] overflow-hidden flex flex-col">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">출석 현황</h2>
        <button
          onClick={onToggle}
          className="text-white hover:text-gray-200 transition-colors"
          title="숨기기"
        >
          ✕
        </button>
      </div>

      {/* 내용 */}
      <div className="overflow-y-auto p-4 min-w-[300px] max-w-[400px]">
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">학생 목록이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {students
              .sort((a, b) => (a.number || 0) - (b.number || 0))
              .map((student) => {
                const record = getStudentAttendance(student.id)
                const status = record?.status || 'none'
                const quizScore = record?.quizScore

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
                        title={getStatusText(status)}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {student.number ? `${student.number}. ` : ''}
                          {student.name}
                        </div>
                        {quizScore !== undefined && (
                          <div className="text-sm text-gray-600">
                            점수: <span className="font-bold text-blue-600">{quizScore}점</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getStatusText(status)}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* 통계 */}
      {students.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">출석: </span>
              <span className="font-bold text-green-600">
                {attendance.filter((a) => a.status === 'present').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">지각: </span>
              <span className="font-bold text-yellow-600">
                {attendance.filter((a) => a.status === 'late').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">결석: </span>
              <span className="font-bold text-red-600">
                {attendance.filter((a) => a.status === 'absent').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">평균: </span>
              <span className="font-bold text-blue-600">
                {(() => {
                  const scores = attendance
                    .map((a) => a.quizScore)
                    .filter((s): s is number => s !== undefined)
                  return scores.length > 0
                    ? Math.round(
                        scores.reduce((a, b) => a + b, 0) / scores.length
                      )
                    : '-'
                })()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






