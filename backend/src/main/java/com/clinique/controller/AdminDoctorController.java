package com.clinique.controller;

import com.clinique.dto.DoctorRequest;
import com.clinique.model.Doctor;
import com.clinique.model.Speciality;
import com.clinique.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDoctorController(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorRequest req) {
        try {
            // Required field validation
            if (isBlank(req.getFirstName()))    return bad("First name is required");
            if (isBlank(req.getLastName()))     return bad("Last name is required");
            if (isBlank(req.getEmail()))        return bad("Email is required");
            if (isBlank(req.getPassword()))     return bad("Password is required");
            if (req.getPassword().length() < 6) return bad("Password must be at least 6 characters");
            if (isBlank(req.getSpeciality()))   return bad("Speciality is required");
            if (isBlank(req.getAvailability())) return bad("Availability is required");
            if (req.getPrice() == null || req.getPrice() <= 0) return bad("Price must be greater than zero");
            if (doctorRepository.existsByEmail(req.getEmail())) return bad("Email already in use");

            Speciality speciality;
            try {
                speciality = Speciality.valueOf(req.getSpeciality().toUpperCase());
            } catch (IllegalArgumentException e) {
                return bad("Invalid speciality value: " + req.getSpeciality());
            }

            Doctor doctor = Doctor.builder()
                    .firstName(req.getFirstName())
                    .lastName(req.getLastName())
                    .email(req.getEmail())
                    .password(passwordEncoder.encode(req.getPassword()))  // BCrypt
                    .price(req.getPrice())
                    .speciality(speciality)
                    .experience(req.getExperience())
                    .phone(req.getPhone())
                    .specialtyDescription(req.getSpecialtyDescription())
                    .availability(req.getAvailability())
                    .imageUrl(req.getImageUrl())
                    .rating(req.getRating())
                    .description(req.getDescription())
                    .build();

            Doctor saved = doctorRepository.save(doctor);
            return ResponseEntity.ok(saved); // password is @JsonIgnore — never returned
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to save doctor: " + e.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody DoctorRequest req) {
        try {
            return doctorRepository.findById(id)
                    .map(doctor -> {
                        doctor.setFirstName(req.getFirstName());
                        doctor.setLastName(req.getLastName());
                        doctor.setSpecialtyDescription(req.getSpecialtyDescription());
                        doctor.setExperience(req.getExperience());
                        doctor.setPhone(req.getPhone());
                        doctor.setAvailability(req.getAvailability());
                        doctor.setImageUrl(req.getImageUrl());
                        doctor.setRating(req.getRating());
                        doctor.setDescription(req.getDescription());
                        doctor.setPrice(req.getPrice());

                        // Update speciality if provided
                        if (!isBlank(req.getSpeciality())) {
                            try {
                                doctor.setSpeciality(Speciality.valueOf(req.getSpeciality().toUpperCase()));
                            } catch (IllegalArgumentException ignored) {}
                        }

                        // Update email if changed
                        if (!doctor.getEmail().equals(req.getEmail())) {
                            if (doctorRepository.existsByEmail(req.getEmail())) {
                                throw new RuntimeException("Email already in use");
                            }
                            doctor.setEmail(req.getEmail());
                        }

                        // Update password only if a new one is provided
                        if (!isBlank(req.getPassword())) {
                            doctor.setPassword(passwordEncoder.encode(req.getPassword()));
                        }

                        return ResponseEntity.ok(doctorRepository.save(doctor));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update doctor: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private ResponseEntity<?> bad(String msg) {
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }
}

// islem: CRUD with BCrypt password encoding
