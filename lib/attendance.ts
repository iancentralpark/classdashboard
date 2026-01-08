// 출석체크 데이터 관리 유틸리티

export interface Student {
  id: string
  name: string
  number?: number // 번호
}

export interface AttendanceRecord {
  date: string // YYYY-MM-DD 형식
  studentId: string
  status: 'present' | 'late' | 'absent' | 'excused' // 출석, 지각, 결석, 공결
  quizScore?: number // 쪽지시험 점수
}

export interface DailyAttendance {
  date: string
  records: AttendanceRecord[]
}

// 로컬스토리지 키
const STUDENTS_KEY = 'class_students'
const ATTENDANCE_KEY = 'class_attendance'

// 학생 목록 관리
export const getStudents = (): Student[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STUDENTS_KEY)
  return data ? JSON.parse(data) : []
}

export const saveStudents = (students: Student[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
}

export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const students = getStudents()
  const newStudent: Student = {
    ...student,
    id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  }
  students.push(newStudent)
  saveStudents(students)
  return newStudent
}

export const updateStudent = (id: string, updates: Partial<Student>): void => {
  const students = getStudents()
  const index = students.findIndex((s) => s.id === id)
  if (index !== -1) {
    students[index] = { ...students[index], ...updates }
    saveStudents(students)
  }
}

export const deleteStudent = (id: string): void => {
  const students = getStudents()
  const filtered = students.filter((s) => s.id !== id)
  saveStudents(filtered)
}

// 출석 기록 관리
export const getAttendanceRecords = (date: string): AttendanceRecord[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ATTENDANCE_KEY)
  if (!data) return []
  
  const allRecords: DailyAttendance[] = JSON.parse(data)
  const dayRecord = allRecords.find((r) => r.date === date)
  return dayRecord ? dayRecord.records : []
}

export const saveAttendanceRecord = (
  date: string,
  record: AttendanceRecord
): void => {
  if (typeof window === 'undefined') return
  
  const data = localStorage.getItem(ATTENDANCE_KEY)
  let allRecords: DailyAttendance[] = data ? JSON.parse(data) : []
  
  const dayIndex = allRecords.findIndex((r) => r.date === date)
  
  if (dayIndex === -1) {
    // 새로운 날짜
    allRecords.push({ date, records: [record] })
  } else {
    // 기존 날짜 업데이트
    const existingIndex = allRecords[dayIndex].records.findIndex(
      (r) => r.studentId === record.studentId
    )
    if (existingIndex !== -1) {
      allRecords[dayIndex].records[existingIndex] = record
    } else {
      allRecords[dayIndex].records.push(record)
    }
  }
  
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(allRecords))
}

export const getTodayAttendance = (): AttendanceRecord[] => {
  const today = new Date().toISOString().split('T')[0]
  return getAttendanceRecords(today)
}

