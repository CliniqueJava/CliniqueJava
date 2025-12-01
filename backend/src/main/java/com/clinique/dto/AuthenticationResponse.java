package com.clinique.dto;

public class AuthenticationResponse {
    private String token;
    private String message;
    private String role;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String token, String message, String role,
                                   Long userId, String firstName, String lastName, String email) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Builder pattern (manual, no Lombok)
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token, message, role, firstName, lastName, email;
        private Long userId;
        public Builder token(String v)     { this.token = v; return this; }
        public Builder message(String v)   { this.message = v; return this; }
        public Builder role(String v)      { this.role = v; return this; }
        public Builder userId(Long v)      { this.userId = v; return this; }
        public Builder firstName(String v) { this.firstName = v; return this; }
        public Builder lastName(String v)  { this.lastName = v; return this; }
        public Builder email(String v)     { this.email = v; return this; }
        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, message, role, userId, firstName, lastName, email);
        }
    }

    // Getters
    public String getToken()     { return token; }
    public String getMessage()   { return message; }
    public String getRole()      { return role; }
    public Long getUserId()      { return userId; }
    public String getFirstName() { return firstName; }
    public String getLastName()  { return lastName; }
    public String getEmail()     { return email; }

    // Setters
    public void setToken(String v)     { this.token = v; }
    public void setMessage(String v)   { this.message = v; }
    public void setRole(String v)      { this.role = v; }
    public void setUserId(Long v)      { this.userId = v; }
    public void setFirstName(String v) { this.firstName = v; }
    public void setLastName(String v)  { this.lastName = v; }
    public void setEmail(String v)     { this.email = v; }
}
