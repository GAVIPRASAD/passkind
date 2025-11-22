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

    public SecretService(SecretRepository secretRepository, UserRepository userRepository,
            EncryptionService encryptionService, AuditLogRepository auditLogRepository) {
        this.secretRepository = secretRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Secret createSecret(String title, String value, Map<String, String> metadata, List<String> tags)
            throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Secret secret = new Secret();
        secret.setTitle(title);
        secret.setEncryptedValue(encryptionService.encrypt(value));
        secret.setOwner(user);
        secret.setMetadata(metadata);
        secret.setTags(tags);

        Secret savedSecret = secretRepository.save(secret);
        logAudit(username, "CREATE", "SECRET", savedSecret.getId(), "Created secret: " + title);

        return savedSecret;
    }

    public List<Secret> getMySecrets() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return secretRepository.findByOwner(user);
    }

    public String getDecryptedValue(Long secretId) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to access this secret");
        }

        logAudit(username, "READ", "SECRET", secretId, "Accessed secret value");
        return encryptionService.decrypt(secret.getEncryptedValue());
    }

    @Transactional
    public void shareSecret(Long secretId, String targetUsername, String permission) {
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
        logAudit(username, "SHARE", "SECRET", secretId, "Shared with " + targetUsername);
    }

    private void logAudit(String username, String action, String resourceType, Long resourceId, String details) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }
}
