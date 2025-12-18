package com.clinique.controller;

import com.clinique.model.Appointment;
import com.clinique.model.Doctor;
import com.clinique.model.Notification;
import com.clinique.repository.AppointmentRepository;
import com.clinique.repository.DoctorRepository;
import com.clinique.repository.NotificationRepository;
import com.clinique.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor")
public class DoctorDashboardController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public DoctorDashboardController(DoctorRepository doctorRepository,
                                      AppointmentRepository appointmentRepository,
                                      UserRepository userRepository,
                                      NotificationRepository notificationRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getDoctorProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        if (doctor.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error",
                    "Your doctor account is not available. Please contact the administration."));
        }
        return ResponseEntity.ok(doctor.get());
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getMyAppointments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        if (doctor.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Doctor profile not found."));
        }

        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdOrderByAppointmentTimeDesc(doctor.get().getId());

        List<Map<String, Object>> result = appointments.stream().map(a -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", a.getId());
            dto.put("appointmentTime", a.getAppointmentTime().toString());
            dto.put("durationMinutes", a.getDurationMinutes());
            dto.put("status", a.getStatus());
            dto.put("notes", a.getNotes());
            dto.put("address", a.getAddress());
            dto.put("phone", a.getPhone());
            dto.put("cancellationReason", a.getCancellationReason());
            if (a.getPatient() != null) {
                Map<String, Object> patient = new HashMap<>();
                patient.put("id", a.getPatient().getId());
                patient.put("firstName", a.getPatient().getFirstName());
                patient.put("lastName", a.getPatient().getLastName());
                patient.put("email", a.getPatient().getEmail());
                patient.put("birthday", a.getPatient().getBirthday());
                dto.put("patient", patient);
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

    /**
     * Update appointment status.
     * - CONFIRMED → creates a confirmation notification for the patient
     * - REFUSED   → requires cancellationReason, creates a refusal notification
     * - COMPLETED / CANCELLED → simple status update
     */
    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Doctor profile not found."));
        }
        Doctor doctor = doctorOpt.get();

        Optional<Appointment> optAppt = appointmentRepository.findById(id);
        if (optAppt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Appointment not found."));
        }
        Appointment appt = optAppt.get();

        if (!appt.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
        }

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required."));
        }
        newStatus = newStatus.toUpperCase();

        // REFUSED requires a cancellation reason
        if ("REFUSED".equals(newStatus)) {
            String reason = body.get("cancellationReason");
            if (reason == null || reason.isBlank()) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "A cancellation reason is required when refusing an appointment."));
            }
            appt.setCancellationReason(reason);
        }

        appt.setStatus(newStatus);
        appointmentRepository.save(appt);

        // Create notification for patient on CONFIRMED or REFUSED
        if (("CONFIRMED".equals(newStatus) || "REFUSED".equals(newStatus)) && appt.getPatient() != null) {
            Notification notif = new Notification();
            notif.setPatient(appt.getPatient());
            notif.setType(newStatus);
            notif.setDoctorName("Dr. " + doctor.getFirstName() + " " + doctor.getLastName());
            notif.setAppointmentTime(appt.getAppointmentTime().toString());
            notif.setAppointmentId(appt.getId());
            if ("REFUSED".equals(newStatus)) {
                notif.setCancellationReason(appt.getCancellationReason());
            }
            notificationRepository.save(notif);
        }

        return ResponseEntity.ok(Map.of(
                "id", appt.getId(),
                "status", appt.getStatus(),
                "message", "Appointment status updated successfully."
        ));
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getMyPatients() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        if (doctor.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Doctor profile not found."));
        }

        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdOrderByAppointmentTimeDesc(doctor.get().getId());

        Map<Long, Map<String, Object>> patientMap = new HashMap<>();
        for (Appointment a : appointments) {
            if (a.getPatient() == null) continue;
            Long pid = a.getPatient().getId();
            if (!patientMap.containsKey(pid)) {
                Map<String, Object> p = new HashMap<>();
                p.put("id", pid);
                p.put("firstName", a.getPatient().getFirstName());
                p.put("lastName", a.getPatient().getLastName());
                p.put("email", a.getPatient().getEmail());
                p.put("birthday", a.getPatient().getBirthday());
                p.put("phone", a.getPhone());
                p.put("appointments", new java.util.ArrayList<>());
                patientMap.put(pid, p);
            }
            Map<String, Object> apptSummary = new HashMap<>();
            apptSummary.put("id", a.getId());
            apptSummary.put("appointmentTime", a.getAppointmentTime().toString());
            apptSummary.put("status", a.getStatus());
            apptSummary.put("notes", a.getNotes());
            apptSummary.put("durationMinutes", a.getDurationMinutes());
            ((List<Map<String, Object>>) patientMap.get(pid).get("appointments")).add(apptSummary);
        }

        return ResponseEntity.ok(patientMap.values());
    }
}

// iyadh: doctor dashboard
