package com.passkind.backend.controller;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        return response;
    }

    @PutMapping("/me")
    public ResponseEntity<com.passkind.backend.dto.UserResponse> updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new com.passkind.backend.exception.ResourceNotFoundException("User not found"));

        // Update user fields
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToUserResponse(updatedUser));
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody String preferences) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setPreferences(preferences);
        userRepository.save(user);
        return ResponseEntity.ok("Preferences updated");
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
    }
}
