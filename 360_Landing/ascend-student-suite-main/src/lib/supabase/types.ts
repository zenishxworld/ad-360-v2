export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: number
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          preferred_countries: string[] | null
          degree_level: string | null
          target_course: string | null
          cgpa: number | null
          english_test: string | null
          english_score: number | null
          gre_score: number | null
          gmat_score: number | null
          work_experience: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          preferred_countries?: string[] | null
          degree_level?: string | null
          target_course?: string | null
          cgpa?: number | null
          english_test?: string | null
          english_score?: number | null
          gre_score?: number | null
          gmat_score?: number | null
          work_experience?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          preferred_countries?: string[] | null
          degree_level?: string | null
          target_course?: string | null
          cgpa?: number | null
          english_test?: string | null
          english_score?: number | null
          gre_score?: number | null
          gmat_score?: number | null
          work_experience?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: number
          student_id: number
          university_name: string
          course_name: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          student_id: number
          university_name: string
          course_name: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          university_name?: string
          course_name?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: number
          student_id: number
          document_type: string
          file_name: string
          file_url: string | null
          status: string
          uploaded_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          student_id: number
          document_type: string
          file_name: string
          file_url?: string | null
          status?: string
          uploaded_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          document_type?: string
          file_name?: string
          file_url?: string | null
          status?: string
          uploaded_at?: string
          updated_at?: string
        }
      }
      saved_universities: {
        Row: {
          id: number
          student_id: number
          university_id: number
          country: string | null
          created_at: string
        }
        Insert: {
          id?: number
          student_id: number
          university_id: number
          country?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          university_id?: number
          country?: string | null
          created_at?: string
        }
      }
      saved_courses: {
        Row: {
          id: number
          student_id: number
          course_id: number
          university_id: number
          created_at: string
        }
        Insert: {
          id?: number
          student_id: number
          course_id: number
          university_id: number
          created_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          course_id?: number
          university_id?: number
          created_at?: string
        }
      }
      admin_notes: {
        Row: {
          id: number
          student_id: number
          admin_id: string
          note: string
          created_at: string
        }
        Insert: {
          id?: number
          student_id: number
          admin_id: string
          note: string
          created_at?: string
        }
        Update: {
          id?: number
          student_id?: number
          admin_id?: string
          note?: string
          created_at?: string
        }
      }
    }
  }
}
