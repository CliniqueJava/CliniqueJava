package com.clinique.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes;
    private String address;
    private String phone;
    private String notes;
}
