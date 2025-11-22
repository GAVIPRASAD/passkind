package com.passkind.backend.controller;

import com.passkind.backend.entity.Secret;
import com.passkind.backend.service.SecretService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/secrets")
public class SecretController {

    private final SecretService secretService;

    public SecretController(SecretService secretService) {
        this.secretService = secretService;
    }

    @PostMapping
    public ResponseEntity<Secret> createSecret(@RequestBody SecretRequest request) throws Exception {
        return ResponseEntity.ok(secretService.createSecret(request.getTitle(), request.getValue(),
                request.getMetadata(), request.getTags()));
    }

    @GetMapping
    public ResponseEntity<List<Secret>> getSecrets() {
        return ResponseEntity.ok(secretService.getMySecrets());
    }

    @GetMapping("/{id}/value")
    public ResponseEntity<String> getSecretValue(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(secretService.getDecryptedValue(id));
    }

    @Data
    public static class SecretRequest {
        private String title;
        private String value;
        private Map<String, String> metadata;
        private List<String> tags;
    }
}
