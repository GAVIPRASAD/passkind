package com.passkind.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private Long phoneNumber;

    @Column(nullable = true)
    private String fullName;

    @CreationTimestamp
    private java.time.LocalDateTime createdDate;

    @UpdateTimestamp
    private java.time.LocalDateTime modifiedDate;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isLocked = false;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer failedLoginAttempts = 0;

    private java.time.LocalDateTime lockUntil;

    private java.time.LocalDateTime lastLoginDate;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isEmailVerified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private java.util.Set<Role> roles = new java.util.HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String preferences; // JSON string for theme, etc.
}
