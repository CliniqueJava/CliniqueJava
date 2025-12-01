package com.clinique.repository;

import com.clinique.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentTime(Long doctorId, LocalDateTime appointmentTime);
    List<Appointment> findByDoctorIdOrderByAppointmentTimeDesc(Long doctorId);
    List<Appointment> findByPatientIdOrderByAppointmentTimeDesc(Long patientId);
    List<Appointment> findAllByOrderByAppointmentTimeDesc();
}
