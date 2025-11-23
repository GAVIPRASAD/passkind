package com.passkind.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private Long phoneNumber;
    private Boolean isEmailVerified;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
}
