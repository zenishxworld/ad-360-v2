# Supabase Migration Plan (Phase 2A to 2B)

This document outlines the migration strategy for moving data from the current `localStorage` mock stores into the finalized Supabase database schema for the UNI360 project.

## Migration Mapping

### 1. `student_profiles`
- **Current Source:** `localStorage` key `student_preferences`
- **Migration Path:**
  - `preferredCountries` ➔ `preferred_countries` (TEXT[])
  - `degreeLevel` ➔ `degree_level` (TEXT)
  - `targetCourse` ➔ `target_course` (TEXT)
  - `cgpa` ➔ `cgpa` (NUMERIC)
  - `ielts` ➔ `english_test` = 'IELTS', `english_score` = `ielts` (NUMERIC)
  - `gre` ➔ `gre_score` (INTEGER)
  - `gmat` ➔ `gmat_score` (INTEGER)
  - `workExperience` ➔ `work_experience` (TEXT)
- **Additional Auth Info:** `user_id`, `full_name`, `email` will be populated from Auth hook integration (Google/Email).

### 2. `applications`
- **Current Source:** `localStorage` key `student_applications`
- **Migration Path:**
  - `studentId` ➔ Linked to `student_profiles(id)`
  - `universityName` ➔ `university_name` (TEXT)
  - `courseName` ➔ `course_name` (TEXT)
  - `status` ➔ `status` (TEXT)
  - `notes` ➔ `notes` (TEXT)
  - `appliedDate` ➔ `created_at` (TIMESTAMP)
  - `lastUpdated` ➔ `updated_at` (TIMESTAMP)

### 3. `documents`
- **Current Source:** `localStorage` key `student_documents`
- **Migration Path:**
  - `studentId` ➔ Linked to `student_profiles(id)`
  - `type` ➔ `document_type` (TEXT)
  - `name` ➔ `file_name` (TEXT)
  - *(New Field)* ➔ `file_url` (Requires Supabase Storage upload, mock data won't have real URLs)
  - `status` ➔ `status` (TEXT)
  - `uploadDate` ➔ `uploaded_at` (TIMESTAMP)

### 4. `saved_universities`
- **Current Source:** `localStorage` key `saved_universities`
- **Migration Path:**
  - `universityId` ➔ Convert mock ID to `university_name` (TEXT) based on mock data resolution.
  - `studentId` ➔ Linked to `student_profiles(id)`
  - `savedAt` ➔ `created_at` (TIMESTAMP)

### 5. `saved_courses`
- **Current Source:** `localStorage` key `saved_courses`
- **Migration Path:**
  - `courseId` ➔ Convert mock ID to `course_name` (TEXT)
  - `universityId` ➔ Convert mock ID to `university_name` (TEXT)
  - `studentId` ➔ Linked to `student_profiles(id)`
  - `savedAt` ➔ `created_at` (TIMESTAMP)

### 6. `admin_notes`
- **Current Source:** New table, no existing `localStorage` equivalent was rigorously used. (If exists, key is `admin_notes`).
- **Migration Path:**
  - `studentId` ➔ Linked to `student_profiles(id)`
  - `admin_id` ➔ Linked to admin `auth.users(id)`
  - `note` ➔ `note` (TEXT)

## Execution Strategy

1. **Phase 2B (Auth Integration):** Connect Supabase Auth.
2. **Data Seeding Script:** Create a utility script to read the browser's `localStorage`, parse the existing JSON, map it to the Supabase types as outlined above, and bulk insert it via the created Service layer.
3. **Storage Upload:** For documents, any existing mock records will just serve as metadata placeholders since local files are not persisted. Future uploads will go directly to Supabase storage buckets.
4. **Flip Switch:** Set `DEMO_MODE = false` in `src/config/demoMode.ts`.
