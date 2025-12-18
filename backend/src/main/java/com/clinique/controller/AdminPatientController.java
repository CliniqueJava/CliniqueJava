package com.clinique.controller;

import com.clinique.model.Role;
import com.clinique.model.User;
import com.clinique.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/patients")
@RequiredArgsConstructor
public class AdminPatientController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(userRepository.findByRole(Role.PATIENT));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getPatientById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody User patient) {
        if (userRepository.existsByEmail(patient.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email already in use");
            return ResponseEntity.badRequest().body(response);
        }
        patient.setRole(Role.PATIENT);
        if (patient.getPassword() != null && !patient.getPassword().isEmpty()) {
            patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        } else {
            patient.setPassword(passwordEncoder.encode("password123")); // Default password
        }
        return ResponseEntity.ok(userRepository.save(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody User updatedPatient) {
        return userRepository.findById(id)
                .map(patient -> {
                    patient.setFirstName(updatedPatient.getFirstName());
                    patient.setLastName(updatedPatient.getLastName());
                    patient.setBirthday(updatedPatient.getBirthday());
                    // Don't update email if it exists for another user
                    if (!patient.getEmail().equals(updatedPatient.getEmail()) && userRepository.existsByEmail(updatedPatient.getEmail())) {
                        throw new RuntimeException("Email already in use");
                    }
                    patient.setEmail(updatedPatient.getEmail());
                    if (updatedPatient.getPassword() != null && !updatedPatient.getPassword().isEmpty()) {
                        patient.setPassword(passwordEncoder.encode(updatedPatient.getPassword()));
                    }
                    return ResponseEntity.ok(userRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

// islem: patient list and stats
