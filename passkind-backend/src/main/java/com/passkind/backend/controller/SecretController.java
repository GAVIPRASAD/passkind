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
    public ResponseEntity<SecretResponse> createSecret(@RequestBody SecretRequest request) throws Exception {
        Secret secret = secretService.createSecret(request.getName(), request.getValue(),
                request.getMetadata(), request.getTags(), request.getEmail(), request.getUsername());
        return ResponseEntity.ok(mapToResponse(secret));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SecretResponse> updateSecret(@PathVariable java.util.UUID id,
            @RequestBody SecretRequest request) throws Exception {
        Secret secret = secretService.updateSecret(id, request.getName(), request.getValue(),
                request.getMetadata(), request.getTags(), request.getEmail(), request.getUsername());
        return ResponseEntity.ok(mapToResponse(secret));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecret(@PathVariable java.util.UUID id) {
        secretService.deleteSecret(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SecretResponse>> getSecrets() {
        List<Secret> secrets = secretService.getMySecrets();
        List<SecretResponse> responses = secrets.stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SecretResponse> getSecret(@PathVariable java.util.UUID id) {
        Secret secret = secretService.getSecret(id);
        return ResponseEntity.ok(mapToResponse(secret));
    }

    @GetMapping("/{id}/value")
    public ResponseEntity<String> getSecretValue(@PathVariable java.util.UUID id) throws Exception {
        return ResponseEntity.ok(secretService.getDecryptedValue(id));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<SecretHistoryResponse>> getSecretHistory(@PathVariable java.util.UUID id) {
        List<com.passkind.backend.entity.SecretHistory> history = secretService.getSecretHistory(id);
        List<SecretHistoryResponse> response = history.stream()
                .map(h -> {
                    SecretHistoryResponse r = new SecretHistoryResponse();
                    r.setId(h.getId());
                    r.setModifiedAt(h.getModifiedAt());
                    r.setChangeType(h.getChangeType());
                    r.setPreviousData(h.getPreviousData());
                    r.setModifiedBy(h.getModifiedBy().getUsername());
                    return r;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    public ResponseEntity<List<SecretExportResponse>> exportSecrets() throws Exception {
        List<Secret> secrets = secretService.getMySecrets();
        List<SecretExportResponse> responses = new java.util.ArrayList<>();

        for (Secret secret : secrets) {
            try {
                SecretExportResponse response = new SecretExportResponse();
                response.setId(secret.getId());
                response.setName(secret.getName());
                response.setValue(secretService.getDecryptedValue(secret.getId()));
                response.setMetadata(secret.getMetadata());
                response.setTags(secret.getTags());
                response.setEmail(secret.getEmail());
                response.setUsername(secret.getUsername());
                response.setCreatedAt(secret.getCreatedAt());
                response.setUpdatedAt(secret.getUpdatedAt());
                responses.add(response);
            } catch (Exception e) {
                // Log error but continue with other secrets
                System.err.println("Failed to decrypt secret: " + secret.getId() + " - " + e.getMessage());
                // Optionally, you could add the secret with a placeholder value
                // or skip it entirely
            }
        }

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportSecretsAsExcel(@RequestBody Map<String, String> request) throws Exception {
        String password = request.get("password");
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        byte[] excelBytes = secretService.exportSecretsAsExcel(password);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment",
                "passkind-vault-" + java.time.LocalDate.now() + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);
    }

    private SecretResponse mapToResponse(Secret secret) {
        SecretResponse response = new SecretResponse();
        response.setId(secret.getId());
        response.setName(secret.getName());
        response.setEncryptedValue(secret.getEncryptedValue());
        response.setMetadata(secret.getMetadata());
        response.setTags(secret.getTags());
        response.setEmail(secret.getEmail());
        response.setUsername(secret.getUsername());
        response.setCreatedAt(secret.getCreatedAt());
        response.setUpdatedAt(secret.getUpdatedAt());

        OwnerResponse owner = new OwnerResponse();
        owner.setId(secret.getOwner().getId());
        owner.setUsername(secret.getOwner().getUsername());
        response.setOwner(owner);

        return response;
    }

    @Data
    public static class SecretRequest {
        private String name;
        private String value;
        private Map<String, Object> metadata;
        private List<String> tags;
        private String email;
        private String username;
    }

    @Data
    public static class SecretResponse {
        private java.util.UUID id;
        private String name;
        private String encryptedValue;
        private Map<String, Object> metadata;
        private List<String> tags;
        private String email;
        private String username;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
        private OwnerResponse owner;
    }

    @Data
    public static class OwnerResponse {
        private java.util.UUID id;
        private String username;
    }

    @Data
    public static class SecretHistoryResponse {
        private java.util.UUID id;
        private java.time.LocalDateTime modifiedAt;
        private String changeType;
        private Map<String, Object> previousData;
        private String modifiedBy;
    }

    @Data
    public static class SecretExportResponse {
        private java.util.UUID id;
        private String name;
        private String value; // Decrypted value
        private Map<String, Object> metadata;
        private List<String> tags;
        private String email;
        private String username;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }
}
