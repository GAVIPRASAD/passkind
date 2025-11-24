package com.passkind.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "secret_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecretHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "secret_id", nullable = false)
    private Secret secret;

    @ManyToOne
    @JoinColumn(name = "modified_by_user_id")
    private User modifiedBy;

    private LocalDateTime modifiedAt;

    @Column(nullable = false)
    private String changeType; // CREATE, UPDATE

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> previousData;

    @PrePersist
    protected void onCreate() {
        modifiedAt = LocalDateTime.now(java.time.ZoneId.of("Asia/Kolkata"));
    }
}
