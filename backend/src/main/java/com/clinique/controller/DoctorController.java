package com.clinique.controller;

import com.clinique.model.Doctor;
import com.clinique.repository.DoctorRepository;
import com.clinique.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final DoctorService doctorService ;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }
    @GetMapping("/search")
    public List<Doctor> searchBySpeciality(@RequestParam String speciality) {
        return doctorService.getBySpeciality(speciality);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        try {   
            return ResponseEntity.ok(doctorService.getDoctorById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<String>> getDoctorAvailability(
            @PathVariable Long id,
            @RequestParam String date) {
        try {
            return ResponseEntity.ok(doctorService.getAvailableSlots(id, date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

// iyadh: /availability endpoint
