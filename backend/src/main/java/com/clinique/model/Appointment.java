package com.clinique.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    private String address;
    private String phone;

    @Column(length = 1000)
    private String notes;

    @Column(length = 1000)
    private String cancellationReason;

    @Column(nullable = false)
    private String status;

    // ── Constructors ──────────────────────────────────────────────────────────
    public Appointment() {}

    public Appointment(Long id, User patient, Doctor doctor, LocalDateTime appointmentTime,
                       Integer durationMinutes, String address, String phone,
                       String notes, String cancellationReason, String status) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentTime = appointmentTime;
        this.durationMinutes = durationMinutes;
        this.address = address;
        this.phone = phone;
        this.notes = notes;
        this.cancellationReason = cancellationReason;
        this.status = status;
    }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User patient;
        private Doctor doctor;
        private LocalDateTime appointmentTime;
        private Integer durationMinutes;
        private String address, phone, notes, cancellationReason, status;

        public Builder id(Long v)                        { this.id = v; return this; }
        public Builder patient(User v)                   { this.patient = v; return this; }
        public Builder doctor(Doctor v)                  { this.doctor = v; return this; }
        public Builder appointmentTime(LocalDateTime v)  { this.appointmentTime = v; return this; }
        public Builder durationMinutes(Integer v)        { this.durationMinutes = v; return this; }
        public Builder address(String v)                 { this.address = v; return this; }
        public Builder phone(String v)                   { this.phone = v; return this; }
        public Builder notes(String v)                   { this.notes = v; return this; }
        public Builder cancellationReason(String v)      { this.cancellationReason = v; return this; }
        public Builder status(String v)                  { this.status = v; return this; }

        public Appointment build() {
            return new Appointment(id, patient, doctor, appointmentTime,
                    durationMinutes, address, phone, notes, cancellationReason, status);
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                          { return id; }
    public void setId(Long v)                    { this.id = v; }
    public User getPatient()                     { return patient; }
    public void setPatient(User v)               { this.patient = v; }
    public Doctor getDoctor()                    { return doctor; }
    public void setDoctor(Doctor v)              { this.doctor = v; }
    public LocalDateTime getAppointmentTime()    { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime v) { this.appointmentTime = v; }
    public Integer getDurationMinutes()          { return durationMinutes; }
    public void setDurationMinutes(Integer v)    { this.durationMinutes = v; }
    public String getAddress()                   { return address; }
    public void setAddress(String v)             { this.address = v; }
    public String getPhone()                     { return phone; }
    public void setPhone(String v)               { this.phone = v; }
    public String getNotes()                     { return notes; }
    public void setNotes(String v)               { this.notes = v; }
    public String getCancellationReason()        { return cancellationReason; }
    public void setCancellationReason(String v)  { this.cancellationReason = v; }
    public String getStatus()                    { return status; }
    public void setStatus(String v)              { this.status = v; }
}

// islem: Appointment with ManyToOne patient and doctor
