package com.passkind.backend.service;

import com.passkind.backend.entity.AuditLog;
import com.passkind.backend.entity.Secret;
import com.passkind.backend.entity.User;
import com.passkind.backend.exception.ResourceNotFoundException;
import com.passkind.backend.exception.UnauthorizedException;
import com.passkind.backend.repository.AuditLogRepository;
import com.passkind.backend.repository.SecretRepository;
import com.passkind.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class SecretService {

    private final SecretRepository secretRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final AuditLogRepository auditLogRepository;
    private final com.passkind.backend.repository.SecretHistoryRepository secretHistoryRepository;

    public SecretService(SecretRepository secretRepository, UserRepository userRepository,
            EncryptionService encryptionService, AuditLogRepository auditLogRepository,
            com.passkind.backend.repository.SecretHistoryRepository secretHistoryRepository) {
        this.secretRepository = secretRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.auditLogRepository = auditLogRepository;
        this.secretHistoryRepository = secretHistoryRepository;
    }

    @Transactional
    public Secret createSecret(String name, String value, Map<String, Object> metadata, List<String> tags, String email,
            String usernameForSecret)
            throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Secret secret = new Secret();
        secret.setName(name);
        secret.setEncryptedValue(encryptionService.encrypt(value));
        secret.setOwner(user);
        secret.setMetadata(metadata);
        secret.setTags(tags);
        secret.setEmail(email);
        secret.setUsername(usernameForSecret);

        Secret savedSecret = secretRepository.save(secret);

        // Log history
        logHistory(savedSecret, user, "CREATE", null);

        logAudit(username, "CREATE", "SECRET", String.valueOf(savedSecret.getId()), "Created secret: " + name);

        return savedSecret;
    }

    @Transactional
    public Secret updateSecret(java.util.UUID secretId, String name, String value, Map<String, Object> metadata,
            List<String> tags, String email, String usernameForSecret) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to update this secret");
        }

        // Capture previous state for history
        Map<String, Object> previousData = new java.util.HashMap<>();
        previousData.put("name", secret.getName());
        previousData.put("email", secret.getEmail());
        previousData.put("username", secret.getUsername());
        previousData.put("tags", secret.getTags());
        previousData.put("metadata", secret.getMetadata());
        // We don't store the full previous encrypted value in history JSON to keep it
        // light, or we could.
        // For now, let's store metadata changes.

        if (name != null && !name.isEmpty()) {
            secret.setName(name);
        }
        if (value != null && !value.isEmpty()) {
            secret.setEncryptedValue(encryptionService.encrypt(value));
        }
        if (metadata != null) {
            secret.setMetadata(metadata);
        }
        if (tags != null) {
            secret.setTags(tags);
        }
        if (email != null) {
            secret.setEmail(email);
        }
        if (usernameForSecret != null) {
            secret.setUsername(usernameForSecret);
        }

        Secret updatedSecret = secretRepository.save(secret);

        logHistory(updatedSecret, secret.getOwner(), "UPDATE", previousData);
        logAudit(username, "UPDATE", "SECRET", String.valueOf(updatedSecret.getId()), "Updated secret: " + name);

        return updatedSecret;
    }

    public List<Secret> getMySecrets() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return secretRepository.findByOwner(user);
    }

    public String getDecryptedValue(java.util.UUID secretId) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to access this secret");
        }

        logAudit(username, "READ", "SECRET", String.valueOf(secretId), "Accessed secret value");
        return encryptionService.decrypt(secret.getEncryptedValue());
    }

    @Transactional
    public void shareSecret(java.util.UUID secretId, String targetUsername, String permission) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("Only owner can share secret");
        }

        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUsername));

        com.passkind.backend.entity.SecretShare share = new com.passkind.backend.entity.SecretShare();
        share.setSecret(secret);
        share.setSharedWith(targetUser);
        share.setPermission(permission);

        // Save share logic would go here (need repository)
        logAudit(username, "SHARE", "SECRET", String.valueOf(secretId), "Shared with " + targetUsername);
    }

    private void logAudit(String username, String action, String resourceType, String resourceId, String details) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    private void logHistory(Secret secret, User modifiedBy, String changeType, Map<String, Object> previousData) {
        com.passkind.backend.entity.SecretHistory history = new com.passkind.backend.entity.SecretHistory();
        history.setSecret(secret);
        history.setModifiedBy(modifiedBy);
        history.setChangeType(changeType);
        history.setPreviousData(previousData);
        secretHistoryRepository.save(history);
    }

    public List<com.passkind.backend.entity.SecretHistory> getSecretHistory(java.util.UUID secretId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to view history for this secret");
        }

        return secretHistoryRepository.findBySecretOrderByModifiedAtDesc(secret);
    }
}
