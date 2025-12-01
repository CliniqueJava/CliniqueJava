package com.clinique.dto;

public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;          // plain-text, will be BCrypt-encoded
    private Double price;
    private String speciality;        // enum name as string
    private String experience;
    private String phone;
    private String specialtyDescription;
    private String availability;
    private String imageUrl;
    private Double rating;
    private String description;

    // Getters & Setters
    public String getFirstName()            { return firstName; }
    public void setFirstName(String v)      { this.firstName = v; }
    public String getLastName()             { return lastName; }
    public void setLastName(String v)       { this.lastName = v; }
    public String getEmail()                { return email; }
    public void setEmail(String v)          { this.email = v; }
    public String getPassword()             { return password; }
    public void setPassword(String v)       { this.password = v; }
    public Double getPrice()                { return price; }
    public void setPrice(Double v)          { this.price = v; }
    public String getSpeciality()           { return speciality; }
    public void setSpeciality(String v)     { this.speciality = v; }
    public String getExperience()           { return experience; }
    public void setExperience(String v)     { this.experience = v; }
    public String getPhone()                { return phone; }
    public void setPhone(String v)          { this.phone = v; }
    public String getSpecialtyDescription() { return specialtyDescription; }
    public void setSpecialtyDescription(String v) { this.specialtyDescription = v; }
    public String getAvailability()         { return availability; }
    public void setAvailability(String v)   { this.availability = v; }
    public String getImageUrl()             { return imageUrl; }
    public void setImageUrl(String v)       { this.imageUrl = v; }
    public Double getRating()               { return rating; }
    public void setRating(Double v)         { this.rating = v; }
    public String getDescription()          { return description; }
    public void setDescription(String v)    { this.description = v; }
}
