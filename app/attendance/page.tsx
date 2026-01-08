'use client'

import { useState, useEffect } from 'react'
import {
  getStudents,
  saveStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getTodayAttendance,
  saveAttendanceRecord,
  Student,
  AttendanceRecord,
} from '@/lib/attendance'

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentNumber, setNewStudentNumber] = useState('')
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  useEffect(() => {
    loadData()
  }, [selectedDate])

  const loadData = () => {
    setStudents(getStudents())
    loadAttendance()
  }

  const loadAttendance = () => {
    if (typeof window === 'undefined') return
    const data = localStorage.getItem('class_attendance')
    if (!data) {
      setAttendance([])
      return
    }
    const allRecords = JSON.parse(data)
    const dayRecord = allRecords.find(
      (r: { date: string }) => r.date === selectedDate
    )
    setAttendance(dayRecord ? dayRecord.records : [])
  }

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return

    const number = newStudentNumber ? parseInt(newStudentNumber) : undefined
    addStudent({ name: newStudentName.trim(), number })
    setNewStudentName('')
    setNewStudentNumber('')
    setIsAddingStudent(false)
    loadData()
  }

  const handleUpdateStudent = (id: string, updates: Partial<Student>) => {
    updateStudent(id, updates)
    loadData()
    setEditingStudent(null)
  }

  const handleDeleteStudent = (id: string) => {
    if (confirm('정말 이 학생을 삭제하시겠습니까?')) {
      deleteStudent(id)
      loadData()
    }
  }

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceRecord['status']
  ) => {
    const existing = attendance.find((a) => a.studentId === studentId)
    const record: AttendanceRecord = {
      date: selectedDate,
      studentId,
      status,
      quizScore: existing?.quizScore,
    }
    saveAttendanceRecord(selectedDate, record)
    loadAttendance()
  }

  const handleScoreChange = (studentId: string, score: string) => {
    const numScore = score === '' ? undefined : parseInt(score)
    const existing = attendance.find((a) => a.studentId === studentId)
    const record: AttendanceRecord = {
      date: selectedDate,
      studentId,
      status: existing?.status || 'present',
      quizScore: numScore,
    }
    saveAttendanceRecord(selectedDate, record)
    loadAttendance()
  }

  const getStudentAttendance = (studentId: string): AttendanceRecord | undefined => {
    return attendance.find((a) => a.studentId === studentId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 border-green-500 text-green-700'
      case 'late':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      case 'absent':
        return 'bg-red-100 border-red-500 text-red-700'
      case 'excused':
        return 'bg-blue-100 border-blue-500 text-blue-700'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">출석체크</h1>
        <p className="text-gray-600">학생 출석과 쪽지시험 점수를 관리하세요</p>
      </div>

      {/* 날짜 선택 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          날짜 선택
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 학생 목록 관리 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">학생 목록</h2>
          <button
            onClick={() => setIsAddingStudent(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 학생 추가
          </button>
        </div>

        {/* 학생 추가 폼 */}
        {isAddingStudent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="번호 (선택)"
                value={newStudentNumber}
                onChange={(e) => setNewStudentNumber(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="학생 이름"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                className="flex-2 px-3 py-2 border border-gray-300 rounded-lg"
                autoFocus
              />
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setIsAddingStudent(false)
                  setNewStudentName('')
                  setNewStudentNumber('')
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 학생 목록 */}
        <div className="space-y-2">
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-8">학생을 추가해주세요.</p>
          ) : (
            students
              .sort((a, b) => (a.number || 0) - (b.number || 0))
              .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {editingStudent?.id === student.id ? (
                    <>
                      <input
                        type="number"
                        placeholder="번호"
                        value={editingStudent.number || ''}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            number: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={editingStudent.name}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            name: e.target.value,
                          })
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          handleUpdateStudent(student.id, editingStudent)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 text-center font-semibold text-gray-600">
                        {student.number || '-'}
                      </div>
                      <div className="flex-1 font-medium text-gray-800">
                        {student.name}
                      </div>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              ))
          )}
        </div>
      </div>

      {/* 출석체크 및 점수 입력 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          출석체크 및 점수 입력 ({selectedDate})
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            먼저 학생 목록을 추가해주세요.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    번호
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    이름
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    출석 상태
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    쪽지시험 점수
                  </th>
                </tr>
              </thead>
              <tbody>
                {students
                  .sort((a, b) => (a.number || 0) - (b.number || 0))
                  .map((student) => {
                    const record = getStudentAttendance(student.id)
                    const status = record?.status || 'none'

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-600">
                          {student.number || '-'}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {student.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            {[
                              { value: 'present', label: '출석' },
                              { value: 'late', label: '지각' },
                              { value: 'absent', label: '결석' },
                              { value: 'excused', label: '공결' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() =>
                                  handleAttendanceChange(
                                    student.id,
                                    option.value as AttendanceRecord['status']
                                  )
                                }
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  status === option.value
                                    ? getStatusColor(status)
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="점수"
                              value={record?.quizScore || ''}
                              onChange={(e) =>
                                handleScoreChange(student.id, e.target.value)
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="text-gray-500">점</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
