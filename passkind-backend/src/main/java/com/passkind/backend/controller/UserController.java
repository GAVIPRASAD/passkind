package com.passkind.backend.controller;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody String preferences) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setPreferences(preferences);
        userRepository.save(user);
        return ResponseEntity.ok("Preferences updated");
    }

    @GetMapping("/export")
    public void exportSecrets(HttpServletResponse response) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // In real app, fetch secrets and decrypt

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"secrets.csv\"");

        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(response.getOutputStream()))) {
            writer.writeNext(new String[] { "Title", "Username", "Password", "Notes" });
            // Iterate secrets and write
        }
    }
}
