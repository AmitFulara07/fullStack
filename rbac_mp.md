
## Project Overview

**Project name:** Role-Based Academic Collaboration System (RBACS)
**Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
**Purpose:** A web platform that enables structured tracking of student project progress while facilitating continuous mentorship and academic guidance within a college ecosystem.

**Core concept:** Students submit periodic progress logs documenting their work. Mentors (seniors, alumni, faculty) review those logs and give structured feedback. Faculty oversee the academic journey. Admins manage the entire ecosystem. The output is a transparent, permanent learning record.

**Four roles:**
- Admin — platform oversight, user onboarding, mentor assignment, badge config
- Faculty — academic guidance, project/milestone definition, progress monitoring
- Student — submits progress logs, views timeline, earns badges, receives feedback
- Mentor — reviews logs, gives feedback, awards badges, tracks assigned students

**External services:**
- MongoDB Atlas — cloud database
- Cloudinary — file/image uploads
- Nodemailer — email notifications
- node-cron — scheduled badge/alert jobs

---

## Folder Structure (establish this first, never deviate)

```
rbacs/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── progressLogController.js
│   │   ├── mentorController.js
│   │   ├── badgeController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── verifyToken.js
│   │   └── authorizeRole.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── ProgressLog.js
│   │   ├── MentorAssignment.js
│   │   ├── Feedback.js
│   │   ├── Badge.js
│   │   ├── BadgeAward.js
│   │   ├── Notification.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── progressLogRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── badgeRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── badgeService.js
│   │   ├── notificationService.js
│   │   └── emailService.js
│   ├── jobs/
│   │   └── badgeCronJob.js
│   ├── utils/
│   │   └── asyncHandler.js
│   ├── uploads/          (temp multer storage)
│   ├── .env
│   ├── .env.example
│   └── server.js
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── NotificationBell.jsx
│   │   │   │   └── BadgeCard.jsx
│   │   │   ├── student/
│   │   │   │   ├── ProgressLogForm.jsx
│   │   │   │   ├── ProgressTimeline.jsx
│   │   │   │   ├── FeedbackInbox.jsx
│   │   │   │   └── BadgeShelf.jsx
│   │   │   ├── mentor/
│   │   │   │   ├── LogReviewCard.jsx
│   │   │   │   └── FeedbackForm.jsx
│   │   │   ├── faculty/
│   │   │   │   ├── ProjectSetup.jsx
│   │   │   │   └── ProgressMonitor.jsx
│   │   │   └── admin/
│   │   │       ├── MentorAssignmentPanel.jsx
│   │   │       ├── UserTable.jsx
│   │   │       └── AnalyticsDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useRole.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── faculty/
│   │   │   │   └── FacultyDashboard.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── SubmitLog.jsx
│   │   │   │   └── MyBadges.jsx
│   │   │   └── mentor/
│   │   │       └── MentorDashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── vite.config.js
└── README.md
```

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

---

# PHASE 1 — Project Setup & Foundation
## Weeks 1–2

```
TASK: Set up the complete MERN project foundation for the Role-Based Academic Collaboration System (RBACS).

WHAT TO BUILD:
1. Initialize a Node.js/Express server in the /server directory
2. Initialize a React + Vite app in the /client directory
3. Set up MongoDB Atlas connection
4. Configure ESLint and Prettier for both client and server
5. Set up the complete folder structure as specified in the master document

SERVER SETUP (server/server.js):
- Express app with cors, helmet, morgan, express.json() middleware
- Connect to MongoDB using mongoose
- Mount all route files under /api prefix
- Global error handler middleware at the bottom
- Listen on process.env.PORT || 5000
- Log "Server running on port X" and "MongoDB connected" on startup

SERVER DEPENDENCIES TO INSTALL:
express, mongoose, cors, helmet, morgan, dotenv, bcryptjs, jsonwebtoken,
multer, cloudinary, multer-storage-cloudinary, nodemailer, node-cron,
express-validator, express-rate-limit

SERVER DEV DEPENDENCIES:
nodemon, eslint

CLIENT SETUP:
- React + Vite (latest)
- Install: axios, react-router-dom, react-hot-toast, react-hook-form,
  @tanstack/react-query, lucide-react, date-fns, recharts
- Configure vite.config.js with a proxy: /api → http://localhost:5000
- Set up Tailwind CSS

CONFIGURATION FILES TO CREATE:
- server/.env (use the template from master document)
- server/.env.example (same as .env but with placeholder values)
- client/.env
- .gitignore at root (node_modules, .env, dist, uploads)
- README.md with setup instructions

server/config/db.js:
- Export a connectDB async function
- Uses mongoose.connect(process.env.MONGO_URI)
- Logs success or exits process on failure

server/utils/asyncHandler.js:
- Export a wrapper: const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
- This wraps all controller functions to avoid try/catch repetition

VALIDATION:
- Running "npm run dev" in /server should start nodemon and log MongoDB connected
- Running "npm run dev" in /client should start Vite on port 5173
- A GET /api/health route should return { status: 'ok', timestamp: new Date() }
- No console errors on startup

DO NOT build any features yet. This phase is purely scaffolding.
```

---

# PHASE 2 — Auth System & Role Middleware
## Weeks 3–4

```
TASK: Build the complete authentication system with JWT and role-based access control for RBACS.

CONTEXT: RBACS has 4 roles: admin, faculty, student, mentor.
Every API route must be protected. The frontend must redirect users
to their role-specific dashboard after login.

--- MONGOOSE MODELS ---

server/models/User.js:
const UserSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  role:         { type: String, enum: ['admin','faculty','student','mentor'], required: true },
  department:   { type: String },
  batch:        { type: String },           // e.g. "CSE-2024" — for students
  profileImage: { type: String },           // Cloudinary URL
  isActive:     { type: Boolean, default: true },
  bio:          { type: String },           // for mentors: short intro
  organisation: { type: String },           // for alumni mentors
  mentorType:   { type: String, enum: ['senior','alumni','faculty'], default: null },
}, { timestamps: true });

// Pre-save hook: hash password with bcrypt (saltRounds: 10)
// Instance method: comparePassword(candidatePassword) → returns boolean
// Never return password field in queries — use .select('-password')

--- MIDDLEWARE ---

server/middleware/verifyToken.js:
- Extract Bearer token from Authorization header
- Verify with jwt.verify(token, process.env.JWT_SECRET)
- Attach decoded payload to req.user
- Return 401 if missing or invalid

server/middleware/authorizeRole.js:
- Export: const authorizeRole = (...roles) => (req, res, next) => ...
- Check req.user.role is in the roles array
- Return 403 { message: 'Access denied' } if not authorized
- Usage: router.get('/admin-only', verifyToken, authorizeRole('admin'), controller)

--- CONTROLLERS ---

server/controllers/authController.js:

register(req, res):
- Validate: name, email, password, role (use express-validator)
- Check email not already registered
- Hash password, create User document
- Sign JWT: { id: user._id, role: user.role, name: user.name }
- Return: { token, user: { id, name, email, role } }

login(req, res):
- Find user by email, check isActive
- Compare password with bcrypt
- Sign JWT (same payload as register)
- Return: { token, user: { id, name, email, role } }

getMe(req, res):
- Uses verifyToken middleware
- Returns current user data from DB (no password)

--- ROUTES ---

server/routes/authRoutes.js:
POST /api/auth/register → register
POST /api/auth/login → login
GET  /api/auth/me → verifyToken, getMe

--- REACT AUTH ---

client/src/context/AuthContext.jsx:
- Create AuthContext with React.createContext
- AuthProvider wraps the app
- State: { user, token, loading }
- On mount: read token from localStorage, verify with GET /api/auth/me
- login(token, user): saves to localStorage and state
- logout(): clears localStorage and state
- Export useAuth hook: const useAuth = () => useContext(AuthContext)

client/src/api/axiosInstance.js:
- Create axios instance with baseURL: import.meta.env.VITE_API_URL
- Request interceptor: attach Authorization: Bearer <token> from localStorage
- Response interceptor: on 401, call logout() and redirect to /login

client/src/components/shared/ProtectedRoute.jsx:
- Reads user from useAuth()
- If loading: show spinner
- If no user: <Navigate to="/login" />
- If user.role not in allowedRoles prop: <Navigate to="/unauthorized" />
- Otherwise: render <Outlet />

client/src/App.jsx — Route structure:
/ → redirect to /login
/login → Login page (public)
/register → Register page (public)
/admin/* → ProtectedRoute allowedRoles={['admin']} → AdminDashboard
/faculty/* → ProtectedRoute allowedRoles={['faculty']} → FacultyDashboard
/student/* → ProtectedRoute allowedRoles={['student']} → StudentDashboard
/mentor/* → ProtectedRoute allowedRoles={['mentor']} → MentorDashboard

client/src/pages/Login.jsx:
- Form: email, password
- On submit: POST /api/auth/login
- On success: call login(token, user), redirect based on user.role
  admin → /admin, faculty → /faculty, student → /student, mentor → /mentor
- Show error toast on failure
- Link to /register

client/src/pages/Register.jsx:
- Form: name, email, password, role (dropdown: admin/faculty/student/mentor),
  department, batch (conditional: only if role === 'student'),
  mentorType (conditional: only if role === 'mentor')
- On submit: POST /api/auth/register
- On success: redirect to /login with success toast

VALIDATION RULES:
- Email must not already exist
- Password min 6 characters
- Role must be one of the 4 valid values
- Batch required if role === student
- MentorType required if role === mentor

DELIVERABLE CHECK:
- All 4 roles can register and log in
- JWT is stored in localStorage
- Role-specific dashboard route is rendered after login
- Non-authenticated users are redirected to /login
- Wrong-role users see /unauthorized page
- GET /api/auth/me returns current user without password field
```

---

# PHASE 3 — Progress Log Core Loop
## Weeks 5–7 | Copy this entire block into your AI editor

```
TASK: Build the progress log submission system — the core feature of RBACS.
Students submit periodic logs. This is the primary data flow of the entire platform.

CONTEXT: A progress log documents one week of a student's project work.
It has: work done, skills learned, challenges faced, file attachments,
and evidence links. Status flows: draft → submitted → reviewed → approved / revision_requested.

--- MONGOOSE MODELS ---

server/models/Project.js:
const ProjectSchema = new Schema({
  title:         { type: String, required: true },
  description:   { type: String },
  studentId:     { type: ObjectId, ref: 'User', required: true },
  facultyId:     { type: ObjectId, ref: 'User' },
  batch:         { type: String },
  department:    { type: String },
  currentPhase:  { type: String, enum: ['ideation','design','development','testing','final_review'], default: 'ideation' },
  phases: [{
    name:       String,
    deadline:   Date,
    isComplete: { type: Boolean, default: false }
  }],
  status:        { type: String, enum: ['active','completed','archived'], default: 'active' },
  techStack:     [String],
  repoUrl:       String,
}, { timestamps: true });

server/models/ProgressLog.js:
const ProgressLogSchema = new Schema({
  studentId:     { type: ObjectId, ref: 'User', required: true },
  projectId:     { type: ObjectId, ref: 'Project', required: true },
  weekNumber:    { type: Number, required: true },
  title:         { type: String, required: true },
  workDone:      { type: String, required: true },       // rich text / markdown
  skillsLearned: [{ type: String }],                     // tags array
  challenges:    { type: String },
  plannedNext:   { type: String },
  evidenceLinks: [{ type: String }],                     // GitHub, deployment URLs
  attachments: [{
    url:         String,
    filename:    String,
    fileType:    String,
    publicId:    String,                                 // Cloudinary public_id for deletion
  }],
  status:        { type: String, enum: ['draft','submitted','reviewed','approved','revision_requested'], default: 'draft' },
  submittedAt:   Date,
  reviewedAt:    Date,
  version:       { type: Number, default: 1 },
}, { timestamps: true });

// Unique: one log per student per week per project
ProgressLogSchema.index({ studentId: 1, weekNumber: 1, projectId: 1 }, { unique: true });

--- CLOUDINARY SETUP ---

server/config/cloudinary.js:
- Configure cloudinary v2 with env vars
- Create multer-storage-cloudinary storage:
  folder: 'rbacs/progress-logs'
  allowed_formats: ['pdf','png','jpg','jpeg','zip','docx']
  resource_type: 'auto'
- Export: { cloudinary, upload } where upload = multer({ storage })
- upload.array('attachments', 5) — max 5 files per log

--- CONTROLLERS ---

server/controllers/progressLogController.js:

createLog(req, res):
- Only role: student
- Build attachments array from req.files (Cloudinary URLs)
- If status === 'submitted': set submittedAt = new Date()
- Save to DB
- Return created log

updateLog(req, res):
- Only owner student can update
- Only allowed if status === 'draft' or 'revision_requested'
- Increment version if resubmitting
- If new status is 'submitted': set submittedAt
- Return updated log

getMyLogs(req, res):
- Student fetches their own logs
- Sort by weekNumber descending
- Populate projectId (title, currentPhase)
- Support query params: ?status=approved&projectId=xxx

getLogById(req, res):
- Accessible by: owner student, assigned mentor, faculty, admin
- Populate studentId (name, email), projectId (title)

deleteLog(req, res):
- Only owner student, only if status === 'draft'
- Delete Cloudinary files using publicId before DB deletion

--- ROUTES ---

server/routes/progressLogRoutes.js:
POST   /api/logs                     verifyToken, authorizeRole('student'), upload.array('attachments',5), createLog
PUT    /api/logs/:id                 verifyToken, authorizeRole('student'), upload.array('attachments',5), updateLog
GET    /api/logs/my                  verifyToken, authorizeRole('student'), getMyLogs
GET    /api/logs/:id                 verifyToken, getLogById
DELETE /api/logs/:id                 verifyToken, authorizeRole('student'), deleteLog

--- REACT COMPONENTS ---

client/src/pages/student/SubmitLog.jsx:
Form fields:
  - title (text input, required)
  - weekNumber (number input, required, min: 1)
  - projectId (dropdown populated from student's projects)
  - workDone (textarea, required, min 100 chars)
  - skillsLearned (tag input — type and press Enter to add tags, click × to remove)
  - challenges (textarea)
  - plannedNext (textarea)
  - evidenceLinks (dynamic list — add/remove URL fields)
  - attachments (file input, multiple, accept: .pdf,.png,.jpg,.jpeg,.zip,.docx, max 5)
  - Two buttons: "Save as Draft" and "Submit Log"

Behavior:
  - Use react-hook-form for form state
  - Show file size validation (max 10MB per file)
  - Show upload progress bar during submission
  - On success: toast "Log submitted!" and redirect to /student/timeline
  - On revision_requested: pre-fill form with existing log data for editing

client/src/components/student/ProgressTimeline.jsx:
- Fetches GET /api/logs/my
- Renders a vertical timeline (left border with dots)
- Each entry shows:
    Week number + date submitted
    Title
    Status badge (color-coded):
      draft → gray
      submitted → blue
      reviewed → amber
      approved → green
      revision_requested → red
    Skills tags
    If approved/reviewed: show mentor feedback snippet (from Feedback collection — fetch separately)
    Click to expand full log details
- Empty state: "No logs yet. Submit your first progress log."

client/src/pages/student/StudentDashboard.jsx:
Stats cards row:
  - Current week streak (count consecutive weeks with submitted logs)
  - Total logs submitted
  - Badges earned count
  - Pending feedback count

Project phase bar:
  - 5 phases: Ideation → Design → Development → Testing → Final Review
  - Fetch from student's active project
  - Highlight current phase in purple, completed in green

Below stats: render <ProgressTimeline /> showing last 5 logs

DELIVERABLE CHECK:
- Student can submit a log with or without file attachments
- Files appear in Cloudinary dashboard under rbacs/progress-logs
- Draft logs can be edited and resubmitted
- Timeline renders all logs in chronological order
- Status badges update correctly
- GET /api/logs/my returns only the authenticated student's logs
```

---

# PHASE 4 — Mentorship & Feedback Engine
## Weeks 8–10 |

```
TASK: Build the mentor assignment system, feedback flow, and mentor portal for RBACS.
This connects the two sides of the platform — student logs and mentor reviews.

--- MONGOOSE MODELS ---

server/models/MentorAssignment.js:
const MentorAssignmentSchema = new Schema({
  studentId:    { type: ObjectId, ref: 'User', required: true },
  mentorId:     { type: ObjectId, ref: 'User', required: true },
  projectId:    { type: ObjectId, ref: 'Project', required: true },
  assignedBy:   { type: ObjectId, ref: 'User', required: true },   // admin's _id
  assignedAt:   { type: Date, default: Date.now },
  status:       { type: String, enum: ['pending','active','reassigned','inactive','completed'], default: 'active' },
  note:         { type: String },
  reassignedAt: Date,
}, { timestamps: true });

// One active assignment per student per project
MentorAssignmentSchema.index(
  { studentId: 1, projectId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

server/models/Feedback.js:
const FeedbackSchema = new Schema({
  logId:       { type: ObjectId, ref: 'ProgressLog', required: true },
  mentorId:    { type: ObjectId, ref: 'User', required: true },
  studentId:   { type: ObjectId, ref: 'User', required: true },
  comment:     { type: String, required: true },
  rating:      { type: Number, min: 1, max: 5 },
  status:      { type: String, enum: ['approved','revision_requested'], required: true },
  commend:     { type: Boolean, default: false },   // triggers Mentor Commend badge
  reviewedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

--- ADMIN MENTOR ASSIGNMENT CONTROLLERS ---

server/controllers/adminController.js:

assignMentor(req, res):
- Only role: admin
- Body: { studentId, mentorId, projectId, note }
- Validate: student exists with role 'student', mentor exists with role 'mentor'
- Check no active assignment exists already (unique index handles DB level)
- Create MentorAssignment with assignedBy: req.user.id, status: 'active'
- Create Notification for student: "Mentor [name] has been assigned to your project"
- Create Notification for mentor: "You have been assigned to student [name]"
- Log to AuditLog: { actorId: req.user.id, action: 'MENTOR_ASSIGNED', targetId: assignment._id }
- Return created assignment populated with mentor and student names

reassignMentor(req, res):
- Body: { newMentorId, reason }
- Set old assignment status: 'reassigned', reassignedAt: new Date()
- Create new active assignment with newMentorId
- Notify student of change

getAssignableStudents(req, res):
- Returns all students with their assignment status
- Aggregate: lookup MentorAssignment where status='active', flag hasActiveMentor

getAvailableMentors(req, res):
- Returns all users with role 'mentor'
- Include count of active assignments per mentor (from MentorAssignment)

--- MENTOR CONTROLLERS ---

server/controllers/mentorController.js:

getAssignedStudents(req, res):
- Role: mentor
- Find all active MentorAssignments where mentorId = req.user.id
- Populate studentId (name, email, batch, department)
- For each student, include their project info and last log date

getStudentLogs(req, res):
- Role: mentor
- Verify mentor is assigned to this student (check MentorAssignment)
- Return all submitted/reviewed logs for that student
- Populate project info

reviewLog(req, res):
- Role: mentor
- Params: :logId
- Body: { comment, rating, status ('approved'|'revision_requested'), commend }
- Verify mentor is assigned to this log's student
- Create Feedback document
- Update ProgressLog status and reviewedAt
- If commend === true: trigger badgeService.awardBadge(studentId, 'mentor_commend', mentorId, logId)
- Create Notification for student: "Your Week X log has been reviewed"
- If status === 'approved': create Notification "Your log was approved ✓"
- Return feedback document

getFeedbackByLog(req, res):
- Accessible by: student (own logs only), mentor, faculty, admin
- Returns all feedback for a specific log

--- ROUTES ---

server/routes/adminRoutes.js (add to existing):
POST  /api/admin/assign-mentor          verifyToken, authorizeRole('admin'), assignMentor
PATCH /api/admin/assignments/:id/reassign verifyToken, authorizeRole('admin'), reassignMentor
GET   /api/admin/students               verifyToken, authorizeRole('admin'), getAssignableStudents
GET   /api/admin/mentors                verifyToken, authorizeRole('admin'), getAvailableMentors

server/routes/mentorRoutes.js:
GET   /api/mentor/students              verifyToken, authorizeRole('mentor'), getAssignedStudents
GET   /api/mentor/students/:studentId/logs  verifyToken, authorizeRole('mentor'), getStudentLogs
POST  /api/mentor/logs/:logId/review    verifyToken, authorizeRole('mentor'), reviewLog
GET   /api/logs/:logId/feedback         verifyToken, getFeedbackByLog

--- REACT COMPONENTS ---

client/src/pages/mentor/MentorDashboard.jsx:
Sidebar nav items: Dashboard, My Students, Review Queue, Notifications

Dashboard overview cards:
  - Total assigned students
  - Pending reviews (submitted logs not yet reviewed)
  - Average response time (days between submittedAt and reviewedAt)
  - Total reviews given

Review queue section:
  - List of all submitted logs from assigned students sorted by submittedAt ascending (oldest first)
  - Each item shows: student name, week number, project title, days waiting
  - "Review" button opens the review panel

client/src/components/mentor/LogReviewCard.jsx:
- Shows full log details: title, workDone, skills, challenges, plannedNext
- Shows attachment links (open in new tab)
- Shows evidence links
- Below: FeedbackForm component

client/src/components/mentor/FeedbackForm.jsx:
Fields:
  - comment (textarea, required, min 20 chars)
  - rating (1–5 star selector)
  - status (radio: "Approve" | "Request Revision")
  - commend (checkbox: "Commend this student — awards a badge")
Submit button: "Submit Review"
On success: toast "Review submitted" and refresh queue

client/src/components/student/FeedbackInbox.jsx:
- Fetches feedback for each of student's reviewed/approved logs
- Groups by log (week number)
- Shows mentor name, comment, rating stars, status badge
- If commend=true: show "⭐ Mentor commended this log" banner
- Unread indicator (feedback newer than last login)

Admin mentor assignment UI (client/src/components/admin/MentorAssignmentPanel.jsx):
- Two-panel layout (see master doc for spec)
- Left: students list with batch/dept filter and search. Unassigned students show amber pill.
- Right: mentors list with active student count. Each has "Assign" button.
- Select a student → select a mentor → add optional note → "Confirm Assignment"
- On confirm: POST /api/admin/assign-mentor
- Success: student pill turns green

DELIVERABLE CHECK:
- Admin can assign a mentor to a student with optional note
- Mentor dashboard shows all assigned students and their pending logs
- Mentor can open a log, read full details, and submit a review with feedback
- Student sees feedback in their inbox with mentor's comment and rating
- ProgressLog status updates correctly after review
- Notification appears for student when feedback is given
```

---

# PHASE 5 — Badges, Notifications & Accountability
## Weeks 11–12 | Copy this entire block into your AI editor

```
TASK: Build the badge award system, notification service, automated cron jobs,
and at-risk student monitoring for RBACS.
This is the accountability and motivation layer of the platform.

--- MONGOOSE MODELS ---

server/models/Badge.js:
const BadgeSchema = new Schema({
  name:         { type: String, required: true, unique: true },
  description:  { type: String, required: true },
  icon:         { type: String, required: true },        // emoji string e.g. '🚀'
  triggerType:  { type: String, enum: ['auto','mentor','admin','faculty'], required: true },
  triggerRule: {
    type:       String,    // 'first_log', 'streak', 'skill_builder', 'mentor_commend', 'milestone_approved', 'final_review'
    threshold:  Number,    // for streak: 4, for skill_builder: 5, for total_logs: 10
  },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

server/models/BadgeAward.js:
const BadgeAwardSchema = new Schema({
  studentId:   { type: ObjectId, ref: 'User', required: true },
  badgeId:     { type: ObjectId, ref: 'Badge', required: true },
  awardedBy:   { type: ObjectId, ref: 'User', default: null },    // null = auto
  refLogId:    { type: ObjectId, ref: 'ProgressLog', default: null },
  note:        String,
  awardedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate awards — each badge earned only once per student
BadgeAwardSchema.index({ studentId: 1, badgeId: 1 }, { unique: true });

server/models/Notification.js:
const NotificationSchema = new Schema({
  userId:    { type: ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['badge_awarded','feedback_received','log_approved','log_revision','mentor_assigned','deadline_reminder','announcement','at_risk_alert'], required: true },
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  refId:     ObjectId,         // reference to the related document
  refModel:  String,           // 'ProgressLog', 'Badge', 'MentorAssignment'
  isRead:    { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

server/models/AuditLog.js:
const AuditLogSchema = new Schema({
  actorId:    { type: ObjectId, ref: 'User', required: true },
  action:     { type: String, required: true },   // 'MENTOR_ASSIGNED', 'BADGE_AWARDED', 'USER_DEACTIVATED' etc.
  targetId:   ObjectId,
  targetModel: String,
  metadata:   Object,     // any extra context
  ip:         String,
  timestamp:  { type: Date, default: Date.now },
});

--- SEED DEFAULT BADGES ---

Create server/seeders/badgeSeeder.js that inserts these badges if they don't exist:

[
  { name: 'First Log', icon: '🚀', triggerType: 'auto', triggerRule: { type: 'first_log' }, description: 'Submitted your first progress log' },
  { name: '4-Week Streak', icon: '🔥', triggerType: 'auto', triggerRule: { type: 'streak', threshold: 4 }, description: 'Submitted logs on time for 4 consecutive weeks' },
  { name: '10-Log Streak', icon: '📦', triggerType: 'auto', triggerRule: { type: 'streak', threshold: 10 }, description: 'Submitted 10 logs without missing a week' },
  { name: 'Skill Builder', icon: '💡', triggerType: 'auto', triggerRule: { type: 'skill_builder', threshold: 5 }, description: 'Logged 5 or more distinct skills across your logs' },
  { name: 'Milestone Approved', icon: '✅', triggerType: 'mentor', triggerRule: { type: 'milestone_approved' }, description: 'A project phase milestone was approved by your mentor' },
  { name: 'Mentor Commended', icon: '⭐', triggerType: 'mentor', triggerRule: { type: 'mentor_commend' }, description: 'Your mentor gave your log a special commendation' },
  { name: 'Final Review', icon: '🏆', triggerType: 'admin', triggerRule: { type: 'final_review' }, description: 'Completed the final project review phase' },
]

Run seeder on server startup if Badge collection is empty.

--- BADGE SERVICE ---

server/services/badgeService.js:

awardBadge(studentId, triggerRuleType, awardedById = null, refLogId = null):
- Find badge where triggerRule.type === triggerRuleType and isActive = true
- If no badge found: return null (gracefully)
- Use findOneAndUpdate with upsert + $setOnInsert to prevent duplicates:
  BadgeAward.findOneAndUpdate(
    { studentId, badgeId: badge._id },
    { $setOnInsert: { studentId, badgeId: badge._id, awardedBy: awardedById, refLogId } },
    { upsert: true, new: true, rawResult: true }
  )
- If rawResult.lastErrorObject.upserted (newly created): send notification and return award
- If already existed: return null (already earned, no duplicate notification)

checkAndAwardAutomatic(studentId):
- Calls each auto-check function below
- Run for a student whenever they submit a log

checkFirstLog(studentId):
- Count total ProgressLogs with status not 'draft' for this student
- If count === 1: awardBadge(studentId, 'first_log')

checkStreak(studentId, threshold):
- Get last [threshold] logs ordered by weekNumber descending
- Check weekNumbers are consecutive (no gaps)
- If yes: awardBadge(studentId, 'streak')

checkSkillBuilder(studentId, threshold):
- Aggregate all skillsLearned arrays from student's submitted logs
- Get unique skills count
- If >= threshold: awardBadge(studentId, 'skill_builder')

--- NOTIFICATION SERVICE ---

server/services/notificationService.js:

createNotification({ userId, type, title, message, refId, refModel }):
- Insert Notification document
- Return created notification

getUserNotifications(userId):
- Find all notifications for userId
- Sort by createdAt descending
- Return with unread count

markAsRead(notificationId, userId):
- Update isRead to true, verify userId matches

--- EMAIL SERVICE ---

server/services/emailService.js:
- Configure Nodemailer transporter with Gmail (EMAIL_USER, EMAIL_PASS from .env)
- sendBadgeEmail(to, studentName, badgeName, badgeIcon): HTML email with badge award
- sendFeedbackEmail(to, studentName, mentorName, weekNumber, status): feedback notification
- sendDeadlineReminderEmail(to, studentName, projectTitle, deadline): deadline alert
- All emails use simple HTML template with inline styles (no external CSS)
- Wrap in try/catch — email failure should NOT break the main API response

--- CRON JOB ---

server/jobs/badgeCronJob.js:
- Import node-cron
- Schedule: '0 0 * * *' (midnight every day)
- For each active student:
    1. checkAndAwardAutomatic(student._id) — runs all auto checks
    2. Check at-risk: if no log submitted in last 7 days:
       Create Notification for student (type: 'deadline_reminder')
       Create Notification for their assigned mentor (type: 'at_risk_alert')
       Create Notification for faculty if exists
- Log cron job start/completion to console with timestamp

Import and start cron job in server.js after DB connection.

--- ROUTES ---

server/routes/notificationRoutes.js:
GET   /api/notifications             verifyToken → getUserNotifications(req.user.id)
PATCH /api/notifications/:id/read    verifyToken → markAsRead
PATCH /api/notifications/read-all    verifyToken → mark all as read for user

server/routes/badgeRoutes.js:
GET   /api/badges                    verifyToken, authorizeRole('admin') → all badges (catalogue)
POST  /api/badges                    verifyToken, authorizeRole('admin') → create badge
GET   /api/badges/my                 verifyToken, authorizeRole('student') → student's earned badges + locked
GET   /api/badges/history            verifyToken, authorizeRole('student') → award history

--- REACT COMPONENTS ---

client/src/components/shared/NotificationBell.jsx:
- Bell icon in Navbar
- Red dot with count if unread notifications > 0
- Click opens dropdown panel showing last 10 notifications
- Each notification: icon, title, message, time ago (using date-fns formatDistanceToNow)
- "Mark all as read" button at top
- Poll for new notifications every 60 seconds (or use a simple interval)

client/src/pages/student/MyBadges.jsx:
Tabs: All Badges | Earned | Locked | History

All Badges tab:
  - Grid of BadgeCard components
  - Earned: colored border, badge icon, name, date earned
  - Locked: grayed out, shows unlock condition
  - Click earned badge: show detail modal (trigger type, condition, who awarded, date)

Streak bar:
  - Last 8 weeks shown as colored boxes
  - Green: submitted on time, Red: missed, Blue: current week, Gray: future
  - Below: "Current streak: X weeks · Best streak: Y weeks"

History tab:
  - Chronological list of all badge awards
  - Shows: date, badge icon + name, awarded by (System / Mentor name), any note

BadgeCard component:
  - Props: badge, award (null if locked), onClick
  - If earned: purple/colored border, show earned date
  - If locked: opacity 0.4, locked label

DELIVERABLE CHECK:
- Badge seeder runs on startup and populates Badge collection
- Student submitting their first log automatically earns "First Log" badge
- Notification appears in bell after badge award
- Email is sent for badge award (check inbox)
- Cron job logs run at midnight
- At-risk students (no log in 7 days) trigger notifications for mentor and student
- MyBadges page shows earned and locked badges correctly
- Admin can view and create badge types at GET/POST /api/badges
```

---

# PHASE 6 — Analytics, Faculty Portal & Deployment
## Weeks 13–15 | Copy this entire block into your AI editor

```
TASK: Build the Faculty portal, Admin analytics dashboard, and deploy
the full RBACS application to production.

--- FACULTY PORTAL ---

Faculty role responsibilities:
- Define projects and milestones for students
- Monitor all student progress in their courses
- Post announcements to a batch or department
- View platform-wide reports for their students
- Cannot review individual logs (that's the mentor's job)

server/controllers/facultyController.js:

createProject(req, res):
- Role: faculty
- Body: { title, description, studentId, batch, department, phases[], techStack[], repoUrl }
- phases is an array: [{ name: 'ideation', deadline: Date }, ...]
- Create Project with facultyId = req.user.id
- Notify student: "A project has been set up for you by [Faculty name]"

updateProjectPhase(req, res):
- Role: faculty
- Body: { currentPhase, phaseComplete: true/false }
- Update project's currentPhase

getFacultyStudents(req, res):
- Returns all students in faculty's department/batch
- Includes: last log date, total logs, mentor assigned?, project phase
- Flags at-risk students (no log in 7+ days)

getFacultyAnalytics(req, res):
- MongoDB aggregation pipeline:
  - Total students in faculty's department
  - Submission rate this week (students who submitted / total students)
  - Phase distribution (how many students in each phase)
  - Top performing students (most badges)
  - At-risk count

postAnnouncement(req, res):
- Role: faculty
- Body: { title, message, targetBatch, targetDepartment }
- Create Notification for every matching student
- Optionally send email

server/routes/facultyRoutes.js:
POST  /api/faculty/projects              verifyToken, authorizeRole('faculty'), createProject
PATCH /api/faculty/projects/:id/phase    verifyToken, authorizeRole('faculty'), updateProjectPhase
GET   /api/faculty/students              verifyToken, authorizeRole('faculty'), getFacultyStudents
GET   /api/faculty/analytics             verifyToken, authorizeRole('faculty'), getFacultyAnalytics
POST  /api/faculty/announcements         verifyToken, authorizeRole('faculty'), postAnnouncement

client/src/pages/faculty/FacultyDashboard.jsx:
Sidebar: Dashboard, My Students, Project Setup, Announcements, Reports

Dashboard stats cards:
  - Total students in department
  - Submissions this week (count / total)
  - At-risk students (red alert card)
  - Mentor response rate (% of submitted logs reviewed within 5 days)

Student monitoring table:
  - Columns: Name, Batch, Project, Phase, Last Log, Streak, Mentor, Status
  - Status: On Track (green) | At Risk (red) | No Project (gray)
  - Click row: expand to see last 3 log titles

Project setup form:
  - Title, description, assign to student (dropdown)
  - Phase builder: drag-and-drop list of 5 phases with deadline pickers

--- ADMIN ANALYTICS DASHBOARD ---

server/controllers/adminController.js (add):

getPlatformAnalytics(req, res):
- Role: admin
MongoDB aggregation queries:
  1. Total users by role (group by role, count)
  2. Logs submitted this week vs last week (trend)
  3. Submission rate by batch
  4. Badge distribution (most awarded badges)
  5. Average mentor response time (submittedAt to reviewedAt diff)
  6. At-risk students count (no log in 7 days, active status)
  7. Top 5 most active students (most logs)

GET /api/admin/analytics → verifyToken, authorizeRole('admin'), getPlatformAnalytics

client/src/components/admin/AnalyticsDashboard.jsx:
Use recharts for all charts.

Charts to render:
  1. Bar chart: Logs submitted per week (last 8 weeks)
  2. Pie chart: Users by role distribution
  3. Bar chart: Submission rate by batch
  4. Horizontal bar: Top 5 most active students
  5. Number cards: Total users, Total logs, Total badges awarded, At-risk count

--- AUDIT LOG DISPLAY ---

GET /api/admin/audit-logs → verifyToken, authorizeRole('admin')
- Returns AuditLog records sorted by timestamp desc
- Support pagination: ?page=1&limit=20
- Support filter: ?action=MENTOR_ASSIGNED

Admin UI: Simple table with columns: Timestamp, Actor, Action, Target, Details

--- TESTING ---

Install in server: jest, supertest

Create server/__tests__/auth.test.js:
- POST /api/auth/register: valid data creates user, returns token
- POST /api/auth/register: duplicate email returns 400
- POST /api/auth/login: correct credentials return token
- POST /api/auth/login: wrong password returns 401
- GET /api/auth/me: valid token returns user, invalid token returns 401

Create server/__tests__/progressLog.test.js:
- POST /api/logs: student can create log, non-student gets 403
- GET /api/logs/my: returns only authenticated student's logs
- PUT /api/logs/:id: cannot update an approved log

Add to server/package.json: "test": "jest --detectOpenHandles"

--- DEPLOYMENT ---

SERVER (Render.com):
1. Push code to GitHub
2. Create new Web Service on Render
3. Build command: npm install
4. Start command: node server.js
5. Add all .env variables in Render dashboard
6. Set NODE_ENV=production
7. MongoDB Atlas: add Render's IP to Network Access (or allow 0.0.0.0/0 for testing)

CLIENT (Netlify):
1. Build command: npm run build
2. Publish directory: dist
3. Add environment variable: VITE_API_URL=https://your-render-app.onrender.com/api
4. Add _redirects file in /client/public: /* /index.html 200
   (This handles React Router's client-side routing)

Post-deployment checks:
- All 4 role logins work on production URL
- File uploads go to Cloudinary (check dashboard)
- Badge cron job runs (check Render logs at midnight)
- Email notifications arrive (check spam if not in inbox)

--- FINAL FOLDER CLEANUP ---

Ensure these files exist before final commit:
- README.md with: project description, setup steps, all env vars listed, API route table
- server/.env.example (no real secrets)
- .gitignore includes: node_modules, .env, dist, uploads/*, *.log

DELIVERABLE CHECK:
- Faculty dashboard shows all their students with at-risk flags
- Faculty can create a project and assign phases with deadlines
- Admin analytics dashboard renders all 5 charts with real data
- Audit log shows all admin actions with timestamps
- Jest tests pass for auth and progress log routes
- Both server and client deploy successfully
- All 4 role dashboards are accessible on the production URL
- Progress logs, feedback, badges all work end-to-end on production
```

---

## Quick Reference — All API Routes

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Any | Get current user |
| POST | /api/logs | Student | Submit progress log |
| PUT | /api/logs/:id | Student | Update log |
| GET | /api/logs/my | Student | Get own logs |
| GET | /api/logs/:id | Any (authorized) | Get single log |
| DELETE | /api/logs/:id | Student | Delete draft log |
| GET | /api/logs/:id/feedback | Any (authorized) | Get feedback for log |
| GET | /api/mentor/students | Mentor | Get assigned students |
| GET | /api/mentor/students/:id/logs | Mentor | Student's logs |
| POST | /api/mentor/logs/:id/review | Mentor | Submit feedback |
| GET | /api/badges/my | Student | Earned + locked badges |
| GET | /api/badges/history | Student | Badge award history |
| GET | /api/badges | Admin | All badge types |
| POST | /api/badges | Admin | Create badge type |
| GET | /api/notifications | Any | User's notifications |
| PATCH | /api/notifications/:id/read | Any | Mark as read |
| POST | /api/admin/assign-mentor | Admin | Assign mentor to student |
| PATCH | /api/admin/assignments/:id/reassign | Admin | Reassign mentor |
| GET | /api/admin/students | Admin | All students + status |
| GET | /api/admin/mentors | Admin | All mentors + load |
| GET | /api/admin/analytics | Admin | Platform analytics |
| GET | /api/admin/audit-logs | Admin | Audit trail |
| POST | /api/faculty/projects | Faculty | Create project |
| PATCH | /api/faculty/projects/:id/phase | Faculty | Update phase |
| GET | /api/faculty/students | Faculty | Department students |
| GET | /api/faculty/analytics | Faculty | Faculty-level analytics |
| POST | /api/faculty/announcements | Faculty | Post announcement |

---

## Key Rules for AI Code Editor

1. **Never skip the asyncHandler wrapper** on controllers — always `asyncHandler(async (req, res) => { ... })`
2. **Never return passwords** — always `.select('-password')` on User queries
3. **Always verify ownership** before allowing update/delete — check `req.user.id === resource.studentId.toString()`
4. **Middleware order always:** `verifyToken` → `authorizeRole` → controller
5. **Badge awards are idempotent** — always use `findOneAndUpdate` with `upsert + $setOnInsert`
6. **Emails never break the API** — always wrap email sends in `try/catch`
7. **Cloudinary cleanup** — always delete Cloudinary files (by publicId) when deleting a log
8. **Unique indexes enforce business rules at DB level** — trust them, don't double-check in code
9. **One phase at a time** — complete and test each phase before starting the next
10. **Test every route in Thunder Client** before wiring it to React

---

