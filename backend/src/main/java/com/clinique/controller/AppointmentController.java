package com.clinique.controller;

import com.clinique.dto.AppointmentRequest;
import com.clinique.model.Appointment;
import com.clinique.repository.AppointmentRepository;
import com.clinique.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // ── Patient: book an appointment ─────────────────────────────────────────
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        try {
            Appointment appointment = appointmentService.bookAppointment(request);
            Map<String, Object> response = new HashMap<>();
            response.put("id", appointment.getId());
            response.put("status", appointment.getStatus());
            response.put("appointmentTime", appointment.getAppointmentTime().toString());
            response.put("durationMinutes", appointment.getDurationMinutes());
            response.put("message", "Appointment booked successfully!");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> err = new HashMap<>();
            err.put("error", "An error occurred while booking the appointment. Please try again later.");
            return ResponseEntity.status(500).body(err);
        }
    }

    // ── Admin: get all appointments with full DTO ────────────────────────────
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAllByOrderByAppointmentTimeDesc();

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

            // Patient info
            if (a.getPatient() != null) {
                Map<String, Object> patient = new HashMap<>();
                patient.put("id", a.getPatient().getId());
                patient.put("firstName", a.getPatient().getFirstName());
                patient.put("lastName", a.getPatient().getLastName());
                patient.put("email", a.getPatient().getEmail());
                dto.put("patient", patient);
            }

            // Doctor info
            if (a.getDoctor() != null) {
                Map<String, Object> doctor = new HashMap<>();
                doctor.put("id", a.getDoctor().getId());
                doctor.put("firstName", a.getDoctor().getFirstName());
                doctor.put("lastName", a.getDoctor().getLastName());
                doctor.put("speciality", a.getDoctor().getSpeciality());
                dto.put("doctor", doctor);
            }

            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // ── Admin: update appointment status ─────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return appointmentRepository.findById(id).map(appt -> {
            String status = body.get("status");
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required."));
            }
            appt.setStatus(status.toUpperCase());
            if (body.containsKey("cancellationReason")) {
                appt.setCancellationReason(body.get("cancellationReason"));
            }
            appointmentRepository.save(appt);
            return ResponseEntity.ok(Map.of(
                    "id", appt.getId(),
                    "status", appt.getStatus(),
                    "message", "Status updated."
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Admin: delete appointment ─────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
