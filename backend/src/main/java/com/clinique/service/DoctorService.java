package com.clinique.service;

import com.clinique.model.Doctor;
import com.clinique.model.Speciality;
import com.clinique.repository.DoctorRepository;
import com.clinique.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Default time slots used for every available day
    private static final List<String> DEFAULT_TIME_SLOTS =
            Arrays.asList("09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00");

    public List<Doctor> getBySpeciality(String speciality) {
        try {
            Speciality spec = Speciality.valueOf(speciality.toUpperCase());
            return doctorRepository.findBySpeciality(spec);
        } catch (IllegalArgumentException e) {
            return new ArrayList<>();
        }
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    /**
     * Returns available time slots for a given doctor on a given date.
     * Availability is stored as a comma-separated list of dates (YYYY-MM-DD).
     * If the requested date is not in that list, returns an empty list.
     * Otherwise returns DEFAULT_TIME_SLOTS minus already-booked slots.
     */
    public List<String> getAvailableSlots(Long doctorId, String dateString) {
        Doctor doctor = getDoctorById(doctorId);
        LocalDate date = LocalDate.parse(dateString);

        // Check if this date is in the doctor's available days
        List<String> availableDays = parseAvailableDays(doctor.getAvailability());
        if (!availableDays.contains(dateString)) {
            return new ArrayList<>();
        }

        // Find already-booked slots on this day
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        List<String> bookedSlots = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end)
                .stream()
                .filter(app -> !"CANCELLED".equals(app.getStatus()))
                .map(app -> String.format("%02d:%02d",
                        app.getAppointmentTime().getHour(),
                        app.getAppointmentTime().getMinute()))
                .toList();

        // Return default slots minus booked ones
        List<String> available = new ArrayList<>();
        for (String slot : DEFAULT_TIME_SLOTS) {
            if (!bookedSlots.contains(slot)) {
                available.add(slot);
            }
        }
        return available;
    }

    /**
     * Parses the availability string into a list of date strings (YYYY-MM-DD).
     */
    private List<String> parseAvailableDays(String availability) {
        if (availability == null || availability.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(availability.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}

// iyadh: date-based availability
