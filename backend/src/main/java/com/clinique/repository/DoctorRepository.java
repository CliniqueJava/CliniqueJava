package com.clinique.repository;

import com.clinique.model.Doctor;
import com.clinique.model.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    boolean existsByEmail(String email);
    List<Doctor> findBySpeciality(Speciality speciality);
    Optional<Doctor> findByEmail(String email);
}
