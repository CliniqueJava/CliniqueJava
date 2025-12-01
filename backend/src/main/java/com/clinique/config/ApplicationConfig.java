package com.clinique.config;

import com.clinique.model.Doctor;
import com.clinique.repository.DoctorRepository;
import com.clinique.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Configuration
public class ApplicationConfig {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public ApplicationConfig(UserRepository userRepository, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    /**
     * Unified UserDetailsService: checks users table first, then doctors table.
     * This allows both patients/admins and doctors to authenticate via Spring Security.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            // 1. Try users table (PATIENT / ADMIN)
            Optional<com.clinique.model.User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                return user.get(); // User already implements UserDetails
            }

            // 2. Try doctors table (DOCTOR)
            Optional<Doctor> doctor = doctorRepository.findByEmail(email);
            if (doctor.isPresent()) {
                Doctor d = doctor.get();
                // Wrap Doctor as a Spring Security UserDetails
                return new org.springframework.security.core.userdetails.User(
                        d.getEmail(),
                        d.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_DOCTOR"))
                );
            }

            throw new UsernameNotFoundException("No account found for: " + email);
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
