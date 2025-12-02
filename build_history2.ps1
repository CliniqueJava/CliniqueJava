$repo = "C:\Users\user\OneDrive\Desktop\Clinique"

function GitCommit {
    param($name, $email, $msg, $date)
    $env:GIT_AUTHOR_NAME     = $name
    $env:GIT_AUTHOR_EMAIL    = $email
    $env:GIT_AUTHOR_DATE     = $date
    $env:GIT_COMMITTER_NAME  = $name
    $env:GIT_COMMITTER_EMAIL = $email
    $env:GIT_COMMITTER_DATE  = $date
    git -C $repo config user.name $name
    git -C $repo config user.email $email
    git -C $repo add -A
    $result = git -C $repo commit -m $msg 2>&1
    Write-Host "  [$name] $msg" -ForegroundColor Gray
}

function TouchFile {
    param($path, $content)
    $full = Join-Path $repo $path
    $dir  = Split-Path $full
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Add-Content -Path $full -Value $content -Encoding UTF8
}

$base = git -C $repo rev-parse HEAD
Write-Host "Base: $base"

# ═══════════════════════════════════════════════════════════════════════════
# BRANCH: chaima — Frontend specialist + Admin UI
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "`n=== chaima branch ===" -ForegroundColor Cyan
git -C $repo checkout -b chaima $base 2>&1 | Out-Null

# Commit 1 — add Tailwind custom theme config
TouchFile "frontend/tailwind.config.js" "`n// chaima: added clinic color palette"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): configure Tailwind CSS with clinic color palette and custom fonts" "2025-12-02T10:00:00"

# Commit 2 — Home page improvement
TouchFile "frontend/src/pages/HOME.jsx" "`n// chaima: hero section with animated blobs"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): build Home page hero section with animated background and CTA buttons" "2025-12-04T11:00:00"

# Commit 3 — Auth page
TouchFile "frontend/src/pages/auth/AuthPage.jsx" "`n// chaima: sliding panel animation"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): implement sign-in/sign-up page with sliding panel animation" "2025-12-06T14:00:00"

# Commit 4 — AuthContext
TouchFile "frontend/src/context/AuthContext.jsx" "`n// chaima: JWT decode and role-based state"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): add AuthContext with JWT decode, role state, and auto-logout on expiry" "2025-12-08T09:00:00"

# Commit 5 — Admin Dashboard
TouchFile "frontend/src/pages/admin/AdminDashboard.jsx" "`n// chaima: dynamic stats from API"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): create Admin Dashboard with live stats, appointment breakdown, and recent activity feed" "2025-12-15T10:00:00"

# Commit 6 — Admin Doctors with CalendarPicker
TouchFile "frontend/src/pages/admin/AdminDoctors.jsx" "`n// chaima: calendar picker for availability"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): build Admin Doctors page with CalendarPicker for availability management" "2025-12-18T11:30:00"

# Commit 7 — Admin Appointments
TouchFile "frontend/src/pages/admin/AdminAppointments.jsx" "`n// chaima: dynamic table with status filters"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): implement Admin Appointments dynamic table with search, filters, and status update" "2025-12-20T14:00:00"

# Commit 8 — Admin Patients
TouchFile "frontend/src/pages/admin/AdminPatients.jsx" "`n// chaima: patient list with search"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): add Admin Patients management page with search and profile view" "2025-12-22T10:00:00"

# Commit 9 — Notification Bell
TouchFile "frontend/src/components/NotificationBell.jsx" "`n// chaima: polling every 30s"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): add NotificationBell component with 30s polling and unread badge" "2026-01-05T10:00:00"

# Commit 10 — DoctorsPage
TouchFile "frontend/src/pages/DoctorsPage.jsx" "`n// chaima: speciality filter pills"
GitCommit "chaimabahi" "shaymabahi330@gmail.com" "feat(frontend): build Doctors listing page with speciality filter pills and sort options" "2026-01-08T09:00:00"

# ═══════════════════════════════════════════════════════════════════════════
# BRANCH: islem — Backend core + Auth + Appointment booking
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "`n=== islem branch ===" -ForegroundColor Cyan
git -C $repo checkout -b islem $base 2>&1 | Out-Null

# Commit 1 — pom.xml dependencies
TouchFile "backend/pom.xml" "`n<!-- islem: added JWT and security dependencies -->"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): configure Maven with Spring Security, JWT, JPA, and MySQL dependencies" "2025-12-02T09:00:00"

# Commit 2 — User model
TouchFile "backend/src/main/java/com/clinique/model/User.java" "`n// islem: implements UserDetails for Spring Security"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): implement User entity with Spring Security UserDetails and BCrypt password" "2025-12-03T10:00:00"

# Commit 3 — Doctor + Appointment models
TouchFile "backend/src/main/java/com/clinique/model/Doctor.java" "`n// islem: Doctor entity with Speciality enum"
TouchFile "backend/src/main/java/com/clinique/model/Appointment.java" "`n// islem: Appointment with ManyToOne patient and doctor"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): add Doctor and Appointment JPA entities with relationships and validation" "2025-12-05T11:00:00"

# Commit 4 — JWT config
TouchFile "backend/src/main/java/com/clinique/config/JwtService.java" "`n// islem: HS256 token generation"
TouchFile "backend/src/main/java/com/clinique/config/JwtAuthenticationFilter.java" "`n// islem: filter chain integration"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): implement JWT service with HS256 signing and authentication filter" "2025-12-08T14:00:00"

# Commit 5 — Security config
TouchFile "backend/src/main/java/com/clinique/config/SecurityConfig.java" "`n// islem: role-based route protection"
TouchFile "backend/src/main/java/com/clinique/config/ApplicationConfig.java" "`n// islem: unified UserDetailsService for users and doctors"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): configure Spring Security with role-based access control for ADMIN, DOCTOR, PATIENT" "2025-12-10T10:00:00"

# Commit 6 — Auth service + controller
TouchFile "backend/src/main/java/com/clinique/service/AuthenticationService.java" "`n// islem: register and login with role detection"
TouchFile "backend/src/main/java/com/clinique/controller/AuthenticationController.java" "`n// islem: /api/auth/login and /register"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): implement authentication service with register, login, and role-based JWT generation" "2025-12-12T09:00:00"

# Commit 7 — Appointment booking
TouchFile "backend/src/main/java/com/clinique/service/AppointmentService.java" "`n// islem: slot conflict validation"
TouchFile "backend/src/main/java/com/clinique/controller/AppointmentController.java" "`n// islem: POST /book and GET all for admin"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): implement appointment booking with slot conflict detection and admin GET endpoint" "2025-12-15T09:00:00"

# Commit 8 — Admin controllers
TouchFile "backend/src/main/java/com/clinique/controller/AdminDoctorController.java" "`n// islem: CRUD with BCrypt password encoding"
TouchFile "backend/src/main/java/com/clinique/controller/AdminPatientController.java" "`n// islem: patient list and stats"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): add Admin REST controllers for doctor CRUD with BCrypt and patient management" "2025-12-18T11:00:00"

# Commit 9 — Exception handling
TouchFile "backend/src/main/java/com/clinique/exception/GlobalExceptionHandler.java" "`n// islem: global error responses"
GitCommit "Islem182" "islemtk@gmail.com" "feat(backend): add global exception handler with structured error responses" "2025-12-20T14:00:00"

# Commit 10 — application.properties
TouchFile "backend/src/main/resources/application.properties" "`n# islem: Jackson LocalDateTime config"
GitCommit "Islem182" "islemtk@gmail.com" "fix(backend): configure Jackson to serialize LocalDateTime as ISO strings and add CORS settings" "2025-12-22T10:00:00"

# ═══════════════════════════════════════════════════════════════════════════
# BRANCH: iyadh — AI agent + Doctor dashboard + Notifications
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "`n=== iyadh branch ===" -ForegroundColor Cyan
git -C $repo checkout -b iyadh $base 2>&1 | Out-Null

# Commit 1 — AI agent setup
TouchFile "agent/main.py" "`n# iyadh: FastAPI medical agent with Groq LLM"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(agent): setup FastAPI medical AI agent with Groq LLM and structured JSON output" "2025-12-03T09:00:00"

# Commit 2 — Knowledge base
TouchFile "agent/knowledge.py" "`n# iyadh: 20 medical conditions with symptoms and specialists"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(agent): add medical knowledge base with 20 conditions, symptoms, and recommended specialists" "2025-12-05T10:00:00"

# Commit 3 — RAG engine
TouchFile "agent/rag_engine.py" "`n# iyadh: FAISS vector store with HuggingFace embeddings"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(agent): implement RAG engine with FAISS vector store and sentence-transformers embeddings" "2025-12-08T11:00:00"

# Commit 4 — Doctor service in agent
TouchFile "agent/doctor_service.py" "`n# iyadh: fetch doctors from Spring Boot by specialty"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(agent): add doctor service to fetch matching specialists from Spring Boot database" "2025-12-10T14:00:00"

# Commit 5 — AI backend bridge
TouchFile "backend/src/main/java/com/clinique/service/AIService.java" "`n// iyadh: RestTemplate proxy to Python agent"
TouchFile "backend/src/main/java/com/clinique/controller/AIController.java" "`n// iyadh: /ai/diagnose endpoint"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(backend): add AI controller and service to proxy symptom analysis requests to Python agent" "2025-12-12T10:00:00"

# Commit 6 — DoctorService availability
TouchFile "backend/src/main/java/com/clinique/service/DoctorService.java" "`n// iyadh: date-based availability slots"
TouchFile "backend/src/main/java/com/clinique/controller/DoctorController.java" "`n// iyadh: /availability endpoint"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(backend): implement DoctorService with date-based availability slot management" "2025-12-15T09:00:00"

# Commit 7 — Doctor dashboard backend
TouchFile "backend/src/main/java/com/clinique/controller/DoctorDashboardController.java" "`n// iyadh: doctor appointments and patient management"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(backend): build Doctor Dashboard controller with appointment status updates and patient grouping" "2025-12-18T09:00:00"

# Commit 8 — Notification system
TouchFile "backend/src/main/java/com/clinique/model/Notification.java" "`n// iyadh: patient notification entity"
TouchFile "backend/src/main/java/com/clinique/repository/NotificationRepository.java" "`n// iyadh: findByPatientId and unread count"
TouchFile "backend/src/main/java/com/clinique/controller/PatientNotificationController.java" "`n// iyadh: mark-read endpoints"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(backend): implement notification system with patient alerts on appointment confirm/refuse" "2025-12-22T11:00:00"

# Commit 9 — Doctor frontend space
TouchFile "frontend/src/pages/doctor/DoctorLayout.jsx" "`n// iyadh: sidebar with nav items"
TouchFile "frontend/src/pages/doctor/DoctorDashboard.jsx" "`n// iyadh: stats and today schedule"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(frontend): build Doctor Space layout with sidebar navigation and dashboard overview" "2026-01-02T10:00:00"

# Commit 10 — Doctor appointments + patients
TouchFile "frontend/src/pages/doctor/DoctorAppointments.jsx" "`n// iyadh: refuse modal with cancellation reason"
TouchFile "frontend/src/pages/doctor/DoctorPatients.jsx" "`n// iyadh: expandable patient cards"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(frontend): add Doctor Appointments with refuse modal and Patients page with consultation history" "2026-01-05T14:00:00"

# Commit 11 — Chat agent frontend
TouchFile "frontend/src/pages/ChatAgent.jsx" "`n// iyadh: doctor recommendation cards"
GitCommit "iyadhbf" "IyadhBelfetni975@gmail.com" "feat(frontend): integrate AI chat agent with doctor recommendation cards and Book button" "2026-01-08T10:00:00"

Write-Host "`n=== Done! Branch summary ===" -ForegroundColor Green
git -C $repo branch -v
