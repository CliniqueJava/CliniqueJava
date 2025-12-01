package com.clinique.controller;

import com.clinique.model.Notification;
import com.clinique.model.User;
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
@RequestMapping("/api/notifications")
public class PatientNotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public PatientNotificationController(NotificationRepository notificationRepository,
                                          UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /** Get all notifications for the logged-in patient, newest first. */
    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
        }
        Long patientId = userOpt.get().getId();

        List<Notification> notifications = notificationRepository
                .findByPatientIdOrderByCreatedAtDesc(patientId);

        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", n.getId());
            dto.put("type", n.getType());
            dto.put("doctorName", n.getDoctorName());
            dto.put("appointmentTime", n.getAppointmentTime());
            dto.put("cancellationReason", n.getCancellationReason());
            dto.put("isRead", n.isRead());
            dto.put("createdAt", n.getCreatedAt().toString());
            dto.put("appointmentId", n.getAppointmentId());
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

    /** Get unread notification count. */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
        long count = notificationRepository.countByPatientIdAndIsReadFalse(userOpt.get().getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /** Mark a single notification as read. */
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
        }

        return notificationRepository.findById(id).map(n -> {
            if (!n.getPatient().getId().equals(userOpt.get().getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
            }
            n.setRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok(Map.of("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Mark all notifications as read. */
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied."));
        }
        List<Notification> unread = notificationRepository
                .findByPatientIdOrderByCreatedAtDesc(userOpt.get().getId())
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok(Map.of("marked", unread.size()));
    }
}
