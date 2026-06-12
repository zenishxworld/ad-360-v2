# UNI360 MVP MASTER INSTRUCTIONS

## Project Status

This project is NOT being built from scratch.

We already have:

* Landing Page
* Student Portal
* Admin Portal
* Existing UI Components
* Existing Routes
* Existing Layouts
* Existing Styling
* Existing Mock Data Layer

The objective is NOT to redesign the project.

The objective is to refine the workflow and prepare the MVP for backend integration.

---

# Important Global Rules

## Rule 1

Do NOT redesign UI unless explicitly requested.

Keep:

* Existing colors
* Existing styling
* Existing layouts
* Existing component structure

UI text should remain consistent with the current portal.

---

## Rule 2

Do NOT create unnecessary pages.

If functionality already exists:

* Reuse it
* Move it
* Refactor it

Never duplicate functionality.

---

## Rule 3

Authentication is temporarily disabled.

Current development uses:

```typescript
DEMO_STUDENT
DEMO_ADMIN
```

No:

* OTP
* Google Auth
* Supabase Auth
* Session Management

until MVP workflow is complete.

---

## Rule 4

University and Course data are NOT finalized.

Do NOT:

* Create university database tables
* Create course database tables
* Create recommendation database tables

Use mock data only.

---

## Rule 5

Everything should support future Supabase migration.

Avoid architecture that would make migration difficult later.

---

# Student Portal Final Sidebar

Keep:

* Dashboard
* University Finder
* Applications
* Documents
* AI Tools
* Finances
* Visa
* Resources
* Profile Builder

Remove:

* Preferences
* Recommendations
* Discover
* Saved
* Universities

These features are merged into University Finder.

---

# Student Journey

## Landing Page

Buttons:

* Login
* Sign Up
* Services

---

## Authentication

Future implementation:

### Option A

Google Login

### Option B

Mobile Number + OTP

Current MVP:

Authentication disabled.

---

## Dashboard

Dashboard is the first screen.

Remove country-specific focus:

Remove:

* Germany Dashboard
* UK Dashboard
* Italy Dashboard
* Serbia Dashboard

Dashboard must be global.

Dashboard should show:

* Recommended Universities
* Applications
* Documents
* Recent Activity
* Student Progress

---

# University Finder

This is the most important module.

All university-related features live here.

---

## Step 1

Check if student preferences exist.

If not:

Show Preferences Builder.

---

## Step 2

Preferences Builder

Reuse existing implementation.

Do NOT rewrite.

Collect:

* Preferred Countries
* Degree Level
* Target Course
* CGPA
* IELTS
* TOEFL
* PTE
* GRE
* GMAT
* Work Experience

Rules:

* Minimize typing
* Use cards
* Use chips
* Use radio selections
* Use sliders
* Make onboarding extremely fast

---

## AI Profile Evaluation

Current MVP:

Preferences + AI Profile Evaluation

Both exist.

Future:

Student uploads CV

AI extracts profile automatically.

Not part of current MVP.

---

## Step 3

Recommendations

Show:

### Dream Universities

### Target Universities

### Safe Universities

Current MVP:

Use mock logic.

No AI.

No external APIs.

No LLMs.

No recommendation engine redesign.

---

## Step 4

Discover Universities

Reuse current Discover UI.

Keep:

* Search
* Filters
* University Cards

Do not redesign.

---

## Step 5

University Details

Student clicks university.

Open University Detail Page.

For now use mock data.

Future data:

* Overview
* Courses
* Tuition Fees
* Deadlines
* Requirements
* Scholarships
* Rankings
* Country Information

Do not redesign until university data structure is finalized.

---

## Step 6

University Actions

Student can:

* Save University
* Save Course
* Compare Universities
* Apply

---

## Step 7

Application Creation

Important Workflow:

Interested ≠ Application

Flow:

Student finds university

↓

Interested / Save

↓

University added to Saved Universities

↓

Student clicks Apply

↓

Application Created

↓

Application sent to Admin

---

# Applications

Statuses:

* Draft
* Submitted
* Under Review
* Accepted
* Rejected

Current MVP:

Local state only.

No backend.

No Supabase.

---

# Documents

Keep current structure.

Document categories:

### Personal Documents

* Passport
* National ID

### Academic Documents

* Degree
* Transcript

### Language Documents

* IELTS
* TOEFL
* PTE

### Financial Documents

* Bank Statement
* Loan Letter

### SOP

### LOR

### Additional Documents

Current implementation is acceptable.

Only minor improvements later.

---

# Admin Portal

Important:

Admin is student-centric.

NOT application-centric.

---

## Admin Main View

Admin should first see:

Students

Not applications.

---

## Student Overview

Each student record should display:

* Student Profile
* Interested Universities
* Saved Courses
* Applications
* Documents
* Status

---

## Student Detail View

Admin opens student.

Can see:

### Profile

### Applications

### Interested Universities

### Documents

### Notes

### Status Updates

Everything related to one student should be visible from a single screen.

---

# Demo Mode

Current MVP operates in Demo Mode.

Create:

```typescript
DEMO_MODE = true
```

All temporary functionality should use this flag.

---

## Demo Student

Use:

```typescript
const DEMO_STUDENT = {
 id: "demo-student-1"
}
```

---

## Demo Admin

Use:

```typescript
const DEMO_ADMIN = {
 id: "demo-admin-1"
}
```

---

## Demo Profile

Add:

Load Demo Profile

One click fills:

* Country
* Degree
* Course
* CGPA
* IELTS
* GRE
* Experience

---

## Demo Recommendations

One click:

Generate Dream / Target / Safe universities.

---

## Demo Applications

One click:

Create sample application.

---

## Demo Documents

One click:

Generate sample:

* Passport
* Transcript
* IELTS
* SOP
* LOR

---

## Demo Admin Data

One click:

Generate sample:

* Students
* Applications
* Documents
* Interests

---

# Current Development Priority

Priority 1

Complete workflow.

Priority 2

Perfect student journey.

Priority 3

Perfect admin workflow.

Priority 4

Backend integration.

---

# Do NOT Build Yet

Do not implement:

* Supabase Auth
* Google Auth
* OTP
* Payments
* Visa Workflow Engine
* Commission Tracking
* Master Admin
* Notification System
* AI SOP Generator
* AI LOR Generator
* Advanced Analytics

These belong to later phases.

---

# Next Phase After MVP Workflow

Only after workflow is complete:

Phase 2:

* Supabase Integration
* Real Data Persistence
* Applications Storage
* Documents Storage
* Student Preferences Storage

Phase 3:

* Authentication
* Google Login
* Email Login

Phase 4:

* Real University Data
* Real Course Data
* Recommendation Engine Upgrade

Until then:

Focus only on making the workflow perfect.
