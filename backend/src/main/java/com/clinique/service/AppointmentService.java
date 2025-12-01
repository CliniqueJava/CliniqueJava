package com.clinique.service;

import com.clinique.dto.AppointmentRequest;
import com.clinique.model.Appointment;
import com.clinique.model.Doctor;
import com.clinique.model.User;
import com.clinique.repository.AppointmentRepository;
import com.clinique.repository.DoctorRepository;
import com.clinique.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(AppointmentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Validation 1: Must be in the future
        if (request.getAppointmentTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Appointments must be booked in the future.");
        }

        // Validation 2: Missing required fields
        if (request.getAddress() == null || request.getAddress().trim().isEmpty() ||
            request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Please fill all required fields to complete the reservation.");
        }

        // Validation 3: Check if slot is already taken
        if (appointmentRepository.existsByDoctorIdAndAppointmentTime(doctor.getId(), request.getAppointmentTime())) {
            throw new RuntimeException("This appointment slot is no longer available. Please choose another time.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentTime(request.getAppointmentTime())
                .durationMinutes(request.getDurationMinutes())
                .address(request.getAddress())
                .phone(request.getPhone())
                .notes(request.getNotes())
                .status("CONFIRMED")
                .build();

        return appointmentRepository.save(appointment);
    }
}
