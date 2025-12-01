package com.clinique.repository;

import com.clinique.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    long countByPatientIdAndIsReadFalse(Long patientId);
}
