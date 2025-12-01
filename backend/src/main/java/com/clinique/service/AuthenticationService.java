package com.clinique.service;

import com.clinique.config.JwtService;
import com.clinique.dto.AuthenticationRequest;
import com.clinique.dto.AuthenticationResponse;
import com.clinique.dto.RegisterRequest;
import com.clinique.exception.UserAlreadyExistsException;
import com.clinique.model.Doctor;
import com.clinique.model.Role;
import com.clinique.model.User;
import com.clinique.repository.DoctorRepository;
import com.clinique.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository,
                                  DoctorRepository doctorRepository,
                                  PasswordEncoder passwordEncoder,
                                  JwtService jwtService,
                                  AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .birthday(request.getBirthday())
                .role(Role.PATIENT)
                .build();

        userRepository.save(user);

        var extraClaims = new HashMap<String, Object>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("userId", user.getId());
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return new AuthenticationResponse.Builder()
                .token(jwtToken)
                .message("User registered successfully")
                .role(user.getRole().name())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Spring Security validates credentials (works for both users and doctors
        // because ApplicationConfig.userDetailsService checks both tables)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Check doctors table first
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(request.getEmail());
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();

            // Build a minimal UserDetails wrapper to generate the token
            var springUser = new org.springframework.security.core.userdetails.User(
                    doctor.getEmail(),
                    doctor.getPassword(),
                    java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_DOCTOR"))
            );

            var extraClaims = new HashMap<String, Object>();
            extraClaims.put("role", "DOCTOR");
            extraClaims.put("userId", doctor.getId());
            var jwtToken = jwtService.generateToken(extraClaims, springUser);

            return new AuthenticationResponse.Builder()
                    .token(jwtToken)
                    .message("Doctor authenticated successfully")
                    .role("DOCTOR")
                    .userId(doctor.getId())
                    .firstName(doctor.getFirstName())
                    .lastName(doctor.getLastName())
                    .email(doctor.getEmail())
                    .build();
        }

        // Fall back to users table (PATIENT / ADMIN)
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        var extraClaims = new HashMap<String, Object>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("userId", user.getId());
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return new AuthenticationResponse.Builder()
                .token(jwtToken)
                .message("User authenticated successfully")
                .role(user.getRole().name())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}
