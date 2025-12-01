package com.clinique.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(nullable = false)
    private String type; // "CONFIRMED" | "REFUSED" | "COMPLETED" | "CANCELLED"

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String appointmentTime;

    @Column(length = 1000)
    private String cancellationReason;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private Long appointmentId;

    // ── Constructors ──────────────────────────────────────────────────────────
    public Notification() {}

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                        { return id; }
    public void setId(Long v)                  { this.id = v; }
    public User getPatient()                   { return patient; }
    public void setPatient(User v)             { this.patient = v; }
    public String getType()                    { return type; }
    public void setType(String v)              { this.type = v; }
    public String getDoctorName()              { return doctorName; }
    public void setDoctorName(String v)        { this.doctorName = v; }
    public String getAppointmentTime()         { return appointmentTime; }
    public void setAppointmentTime(String v)   { this.appointmentTime = v; }
    public String getCancellationReason()      { return cancellationReason; }
    public void setCancellationReason(String v){ this.cancellationReason = v; }
    public boolean isRead()                    { return isRead; }
    public void setRead(boolean v)             { this.isRead = v; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void setCreatedAt(LocalDateTime v)  { this.createdAt = v; }
    public Long getAppointmentId()             { return appointmentId; }
    public void setAppointmentId(Long v)       { this.appointmentId = v; }
}
