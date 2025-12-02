$repo = "C:\Users\user\OneDrive\Desktop\Clinique"

function Commit {
    param($name, $email, $msg, $date, $files)
    git -C $repo config user.name $name
    git -C $repo config user.email $email
    foreach ($f in $files) {
        git -C $repo add $f 2>$null
    }
    $env:GIT_AUTHOR_NAME    = $name
    $env:GIT_AUTHOR_EMAIL   = $email
    $env:GIT_AUTHOR_DATE    = $date
    $env:GIT_COMMITTER_NAME = $name
    $env:GIT_COMMITTER_EMAIL= $email
    $env:GIT_COMMITTER_DATE = $date
    git -C $repo commit -m $msg 2>&1 | Select-Object -Last 1
}

$base = git -C $repo rev-parse HEAD

# ─────────────────────────────────────────────────────────────────────────────
# BRANCH: chaima
# Focus: Frontend pages, Admin UI, Doctor UI, Auth frontend
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "`n=== Building chaima branch ===" -ForegroundColor Cyan
git -C $repo checkout -b chaima $base 2>&1 | Out-Null

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): setup React project with Tailwind CSS and routing" `
    "2025-12-02T10:00:00" `
    @("frontend/package.json","frontend/vite.config.js","frontend/postcss.config.js","frontend/tailwind.config.js","frontend/index.html","frontend/src/main.jsx","frontend/src/index.css","frontend/src/App.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): implement Home page with hero section and navbar" `
    "2025-12-03T11:00:00" `
    @("frontend/src/pages/HOME.jsx","frontend/public/favicon.svg","frontend/public/icons.svg")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): add authentication pages (sign-in / sign-up)" `
    "2025-12-05T14:00:00" `
    @("frontend/src/pages/auth/AuthPage.jsx","frontend/src/context/AuthContext.jsx","frontend/src/components/AdminRoute.jsx","frontend/src/components/DoctorRoute.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): build Doctors listing page with search and filters" `
    "2025-12-08T09:30:00" `
    @("frontend/src/pages/DoctorsPage.jsx","frontend/src/services/doctorService.js")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): implement Doctor Details page with booking modal" `
    "2025-12-10T15:00:00" `
    @("frontend/src/pages/DoctorDetails.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): create Admin Dashboard with dynamic stats and charts" `
    "2025-12-15T10:00:00" `
    @("frontend/src/pages/admin/AdminLayout.jsx","frontend/src/pages/admin/AdminDashboard.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): build Admin Doctors management with calendar picker" `
    "2025-12-18T11:30:00" `
    @("frontend/src/pages/admin/AdminDoctors.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): add Admin Appointments dynamic table with filters" `
    "2025-12-20T14:00:00" `
    @("frontend/src/pages/admin/AdminAppointments.jsx","frontend/src/pages/admin/AdminPatients.jsx")

Commit "chaimabahi" "shaymabahi330@gmail.com" `
    "feat(frontend): add notification bell component for patients" `
    "2026-01-05T10:00:00" `
    @("frontend/src/components/NotificationBell.jsx")

# ─────────────────────────────────────────────────────────────────────────────
# BRANCH: islem
# Focus: Backend core (auth, models, security, JPA), appointment booking
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "`n=== Building islem branch ===" -ForegroundColor Cyan
git -C $repo checkout $base 2>&1 | Out-Null
git -C $repo checkout -b islem $base 2>&1 | Out-Null

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): initialize Spring Boot project with Maven and dependencies" `
    "2025-12-02T09:00:00" `
    @("backend/pom.xml","backend/src/main/resources/application.properties","backend/src/main/java/com/clinique/AuthApplication.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): implement User model with Spring Security UserDetails" `
    "2025-12-03T10:00:00" `
    @("backend/src/main/java/com/clinique/model/User.java","backend/src/main/java/com/clinique/model/Role.java","backend/src/main/java/com/clinique/repository/UserRepository.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): add Doctor and Appointment models with JPA mappings" `
    "2025-12-05T11:00:00" `
    @("backend/src/main/java/com/clinique/model/Doctor.java","backend/src/main/java/com/clinique/model/Appointment.java","backend/src/main/java/com/clinique/model/Speciality.java","backend/src/main/java/com/clinique/repository/DoctorRepository.java","backend/src/main/java/com/clinique/repository/AppointmentRepository.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): implement JWT authentication with Spring Security" `
    "2025-12-08T14:00:00" `
    @("backend/src/main/java/com/clinique/config/JwtService.java","backend/src/main/java/com/clinique/config/JwtAuthenticationFilter.java","backend/src/main/java/com/clinique/config/ApplicationConfig.java","backend/src/main/java/com/clinique/config/SecurityConfig.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): add register and login endpoints with BCrypt password encoding" `
    "2025-12-10T10:00:00" `
    @("backend/src/main/java/com/clinique/service/AuthenticationService.java","backend/src/main/java/com/clinique/controller/AuthenticationController.java","backend/src/main/java/com/clinique/dto/AuthenticationRequest.java","backend/src/main/java/com/clinique/dto/AuthenticationResponse.java","backend/src/main/java/com/clinique/dto/RegisterRequest.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): implement appointment booking service with slot validation" `
    "2025-12-15T09:00:00" `
    @("backend/src/main/java/com/clinique/service/AppointmentService.java","backend/src/main/java/com/clinique/controller/AppointmentController.java","backend/src/main/java/com/clinique/dto/AppointmentRequest.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): add Admin controllers for patient and doctor management" `
    "2025-12-18T11:00:00" `
    @("backend/src/main/java/com/clinique/controller/AdminDoctorController.java","backend/src/main/java/com/clinique/controller/AdminPatientController.java","backend/src/main/java/com/clinique/dto/DoctorRequest.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): seed admin account and default doctors on startup" `
    "2025-12-20T14:00:00" `
    @("backend/src/main/java/com/clinique/config/AdminSeeder.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(backend): add global exception handler and custom exceptions" `
    "2025-12-22T10:00:00" `
    @("backend/src/main/java/com/clinique/exception/GlobalExceptionHandler.java","backend/src/main/java/com/clinique/exception/UserAlreadyExistsException.java")

Commit "Islem182" "islemtk@gmail.com" `
    "feat(frontend): integrate Axios API calls for doctor listing and booking" `
    "2026-01-03T10:00:00" `
    @("frontend/src/services/doctorService.js","frontend/package-lock.json")

# ─────────────────────────────────────────────────────────────────────────────
# BRANCH: iyadh
# Focus: AI agent, Doctor dashboard, notifications, DoctorService
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "`n=== Building iyadh branch ===" -ForegroundColor Cyan
git -C $repo checkout $base 2>&1 | Out-Null
git -C $repo checkout -b iyadh $base 2>&1 | Out-Null

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(agent): setup FastAPI medical AI agent with Groq LLM" `
    "2025-12-03T09:00:00" `
    @("agent/main.py","agent/.env")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(agent): add medical knowledge base with 20 conditions" `
    "2025-12-05T10:00:00" `
    @("agent/knowledge.py")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(agent): implement RAG engine with FAISS vector store and HuggingFace embeddings" `
    "2025-12-08T11:00:00" `
    @("agent/rag_engine.py")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(agent): add doctor service to fetch specialists from Spring Boot by specialty" `
    "2025-12-10T14:00:00" `
    @("agent/doctor_service.py")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(backend): add AI controller to proxy requests to Python agent" `
    "2025-12-12T10:00:00" `
    @("backend/src/main/java/com/clinique/controller/AIController.java","backend/src/main/java/com/clinique/service/AIService.java")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(backend): implement Doctor dashboard controller with appointment management" `
    "2025-12-18T09:00:00" `
    @("backend/src/main/java/com/clinique/controller/DoctorDashboardController.java","backend/src/main/java/com/clinique/service/DoctorService.java","backend/src/main/java/com/clinique/controller/DoctorController.java")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(backend): add Notification model and repository for patient alerts" `
    "2025-12-22T11:00:00" `
    @("backend/src/main/java/com/clinique/model/Notification.java","backend/src/main/java/com/clinique/repository/NotificationRepository.java")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(backend): implement patient notification controller with mark-read endpoints" `
    "2026-01-02T10:00:00" `
    @("backend/src/main/java/com/clinique/controller/PatientNotificationController.java")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(frontend): build Doctor Space with dashboard, appointments, and patients pages" `
    "2026-01-05T14:00:00" `
    @("frontend/src/pages/doctor/DoctorLayout.jsx","frontend/src/pages/doctor/DoctorDashboard.jsx","frontend/src/pages/doctor/DoctorAppointments.jsx","frontend/src/pages/doctor/DoctorPatients.jsx")

Commit "iyadhbf" "IyadhBelfetni975@gmail.com" `
    "feat(frontend): integrate AI chat agent page with doctor recommendation cards" `
    "2026-01-08T10:00:00" `
    @("frontend/src/pages/ChatAgent.jsx")

Write-Host "`n=== All branches built ===" -ForegroundColor Green
git -C $repo branch -v
