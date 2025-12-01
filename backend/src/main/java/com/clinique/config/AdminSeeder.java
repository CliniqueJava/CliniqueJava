package com.clinique.config;

import com.clinique.model.Role;
import com.clinique.model.User;
import com.clinique.model.Doctor;
import com.clinique.model.Speciality;
import com.clinique.repository.UserRepository;
import com.clinique.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "clinique@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("Clinique")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("0000"))
                    .birthday("01/01/1990")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin account seeded successfully.");
        }

        if (doctorRepository.count() == 0) {
            Doctor d1 = Doctor.builder()
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .email("sarah.jenkins@clinique.com")
                    .speciality(Speciality.CARDIOLOGY)
                    .experience("15 years")
                    .phone("+1 (555) 234-5678")
                    .price(150.0)
                    .availability("09:00,10:00,11:00,13:00,14:00,15:00,16:00")
                    .imageUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop")
                    .rating(4.9)
                    .description("Dr. Sarah Jenkins is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management.")
                    .build();

            Doctor d2 = Doctor.builder()
                    .firstName("Michael")
                    .lastName("Chang")
                    .email("michael.chang@clinique.com")
                    .speciality(Speciality.NEUROLOGY)
                    .experience("12 years")
                    .phone("+1 (555) 987-6543")
                    .price(130.0)
                    .availability("09:00,10:00,11:00,14:00,15:00,16:00")
                    .imageUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop")
                    .rating(4.8)
                    .description("Dr. Michael Chang is a leading expert in neurology, specializing in migraine treatment, sleep disorders, and cognitive healthcare. He focuses on comprehensive patient education and holistic treatment plans.")
                    .build();

            Doctor d3 = Doctor.builder()
                    .firstName("Emily")
                    .lastName("Ross")
                    .email("emily.ross@clinique.com")
                    .speciality(Speciality.PEDIATRICS)
                    .experience("10 years")
                    .phone("+1 (555) 456-7890")
                    .price(100.0)
                    .availability("09:30,10:30,11:30,13:30,14:30,15:30")
                    .imageUrl("https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop")
                    .rating(4.7)
                    .description("Dr. Emily Ross is passionate about providing gentle and caring medical services to children from infancy through adolescence. She is well-known for her comforting bedside manner and preventative wellness expertise.")
                    .build();

            Doctor d4 = Doctor.builder()
                    .firstName("James")
                    .lastName("Carter")
                    .email("james.carter@clinique.com")
                    .speciality(Speciality.DERMATOLOGY)
                    .experience("8 years")
                    .phone("+1 (555) 321-7654")
                    .price(120.0)
                    .availability("09:00,10:00,11:00,13:00,14:00,15:00")
                    .imageUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop")
                    .rating(4.6)
                    .description("Dr. James Carter offers expert care in medical, surgical, and cosmetic dermatology. He is dedicated to helping patients achieve healthy, beautiful skin through cosmetic skin treatments and evidence-based medicine.")
                    .build();

            doctorRepository.saveAll(List.of(d1, d2, d3, d4));
            System.out.println("Doctor accounts seeded successfully.");
        }
    }
}
