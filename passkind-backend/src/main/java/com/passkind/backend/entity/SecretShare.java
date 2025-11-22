package com.passkind.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "secret_shares")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecretShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "secret_id", nullable = false)
    private Secret secret;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User sharedWith;

    @Column(nullable = false)
    private String permission; // READ, WRITE
}
