package com.passkind.backend.controller;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import com.passkind.backend.dto.ChangePasswordRequest;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({ "/api/users", "/users" })
public class UserController {

    private final UserRepository userRepository;
    private final com.passkind.backend.service.OTPService otpService;
    private final com.passkind.backend.security.JwtTokenProvider tokenProvider;
    private final com.passkind.backend.service.UserService userService;

    public UserController(UserRepository userRepository, com.passkind.backend.service.OTPService otpService,
            com.passkind.backend.security.JwtTokenProvider tokenProvider,
            com.passkind.backend.service.UserService userService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<com.passkind.backend.dto.UserResponse> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new com.passkind.backend.exception.ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(mapToUserResponse(user));
    }

    @GetMapping
    public ResponseEntity<java.util.List<com.passkind.backend.dto.UserResponse>> getAllUsers() {
        java.util.List<User> users = userRepository.findAll();
        java.util.List<com.passkind.backend.dto.UserResponse> response = users.stream()
                .map(this::mapToUserResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.passkind.backend.dto.UserResponse> getUserById(@PathVariable java.util.UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.passkind.backend.exception.ResourceNotFoundException(
                        "User not found with id: " + id));
        return ResponseEntity.ok(mapToUserResponse(user));
    }

    private com.passkind.backend.dto.UserResponse mapToUserResponse(User user) {
        com.passkind.backend.dto.UserResponse response = new com.passkind.backend.dto.UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setFullName(user.getFullName());
        response.setIsEmailVerified(user.getIsEmailVerified());
        response.setCreatedDate(user.getCreatedDate());
        response.setLastLoginDate(user.getLastLoginDate());
        response.setPreferences(user.getPreferences());
        return response;
    }

    @PutMapping("/me")
    public ResponseEntity<com.passkind.backend.dto.UserResponse> updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new com.passkind.backend.exception.ResourceNotFoundException("User not found"));

        boolean usernameChanged = false;
        // Update user fields
        if (request.getUsername() != null && !request.getUsername().isEmpty()
                && !request.getUsername().equals(user.getUsername())) {
            user.setUsername(request.getUsername());
            usernameChanged = true;
        }

        boolean emailChanged = false;
        if (request.getEmail() != null && !request.getEmail().isEmpty()
                && !request.getEmail().equals(user.getEmail())) {
            user.setEmail(request.getEmail());
            user.setIsEmailVerified(false);
            emailChanged = true;
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPreferences() != null) {
            // Preferences should be a JSON string
            user.setPreferences(request.getPreferences());
        }

        User updatedUser = userRepository.save(user);

        if (emailChanged) {
            try {
                otpService.generateOTP(updatedUser.getEmail());
            } catch (Exception e) {
                // Log error but don't fail the update, user can request OTP later
                System.err.println("Failed to send OTP for email update: " + e.getMessage());
            }
        }

        com.passkind.backend.dto.UserResponse response = mapToUserResponse(updatedUser);

        if (usernameChanged) {
            // Generate new token for the new username
            org.springframework.security.core.Authentication authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    updatedUser.getUsername(), null, java.util.Collections.emptyList());
            String newToken = tokenProvider.generateToken(authentication);
            response.setAccessToken(newToken);
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody String preferences) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setPreferences(preferences);
        userRepository.save(user);
        return ResponseEntity.ok("Preferences updated");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.changePassword(username, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // @GetMapping("/export")
    // public void exportSecrets(HttpServletResponse response) throws IOException {
    // // String username =
    // SecurityContextHolder.getContext().getAuthentication().getName();
    // // In real app, fetch secrets and decrypt

    // response.setContentType("text/csv");
    // response.setHeader("Content-Disposition", "attachment;
    // filename=\"secrets.csv\"");

    // try (CSVWriter writer = new CSVWriter(new
    // OutputStreamWriter(response.getOutputStream()))) {
    // writer.writeNext(new String[] { "Title", "Username", "Password", "Notes" });
    // // Iterate secrets and write
    // }
    // }

    @Data
    public static class UpdateUserRequest {
        private String username;
        private String email;
        private Long phoneNumber;
        private String fullName;
        private String preferences;
    }
}
