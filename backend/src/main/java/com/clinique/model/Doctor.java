package com.clinique.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Speciality speciality;

    private String experience;
    private String phone;

    @Column(length = 2000)
    private String specialtyDescription;

    @Column(name = "availability", nullable = false)
    private String availability;

    private String imageUrl;
    private Double rating;

    @Column(length = 1000)
    private String description;

    // ── Constructors ──────────────────────────────────────────────────────────
    public Doctor() {}

    public Doctor(Long id, String firstName, String lastName, String email,
                  String password, Double price, Speciality speciality,
                  String experience, String phone, String specialtyDescription,
                  String availability, String imageUrl, Double rating, String description) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.price = price;
        this.speciality = speciality;
        this.experience = experience;
        this.phone = phone;
        this.specialtyDescription = specialtyDescription;
        this.availability = availability;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.description = description;
    }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String firstName, lastName, email, password;
        private Double price;
        private Speciality speciality;
        private String experience, phone, specialtyDescription, availability, imageUrl, description;
        private Double rating;

        public Builder id(Long v)                      { this.id = v; return this; }
        public Builder firstName(String v)             { this.firstName = v; return this; }
        public Builder lastName(String v)              { this.lastName = v; return this; }
        public Builder email(String v)                 { this.email = v; return this; }
        public Builder password(String v)              { this.password = v; return this; }
        public Builder price(Double v)                 { this.price = v; return this; }
        public Builder speciality(Speciality v)        { this.speciality = v; return this; }
        public Builder experience(String v)            { this.experience = v; return this; }
        public Builder phone(String v)                 { this.phone = v; return this; }
        public Builder specialtyDescription(String v)  { this.specialtyDescription = v; return this; }
        public Builder availability(String v)          { this.availability = v; return this; }
        public Builder imageUrl(String v)              { this.imageUrl = v; return this; }
        public Builder rating(Double v)                { this.rating = v; return this; }
        public Builder description(String v)           { this.description = v; return this; }

        public Doctor build() {
            return new Doctor(id, firstName, lastName, email, password, price, speciality,
                    experience, phone, specialtyDescription, availability, imageUrl, rating, description);
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                        { return id; }
    public void setId(Long v)                  { this.id = v; }
    public String getFirstName()               { return firstName; }
    public void setFirstName(String v)         { this.firstName = v; }
    public String getLastName()                { return lastName; }
    public void setLastName(String v)          { this.lastName = v; }
    public String getEmail()                   { return email; }
    public void setEmail(String v)             { this.email = v; }
    public String getPassword()                { return password; }
    public void setPassword(String v)          { this.password = v; }
    public Double getPrice()                   { return price; }
    public void setPrice(Double v)             { this.price = v; }
    public Speciality getSpeciality()          { return speciality; }
    public void setSpeciality(Speciality v)    { this.speciality = v; }
    public String getExperience()              { return experience; }
    public void setExperience(String v)        { this.experience = v; }
    public String getPhone()                   { return phone; }
    public void setPhone(String v)             { this.phone = v; }
    public String getSpecialtyDescription()    { return specialtyDescription; }
    public void setSpecialtyDescription(String v) { this.specialtyDescription = v; }
    public String getAvailability()            { return availability; }
    public void setAvailability(String v)      { this.availability = v; }
    public String getImageUrl()                { return imageUrl; }
    public void setImageUrl(String v)          { this.imageUrl = v; }
    public Double getRating()                  { return rating; }
    public void setRating(Double v)            { this.rating = v; }
    public String getDescription()             { return description; }
    public void setDescription(String v)       { this.description = v; }
}

// islem: Doctor entity with Speciality enum
