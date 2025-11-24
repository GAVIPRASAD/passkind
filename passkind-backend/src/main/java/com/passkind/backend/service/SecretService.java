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
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public SecretService(SecretRepository secretRepository, UserRepository userRepository,
            EncryptionService encryptionService, AuditLogRepository auditLogRepository,
            com.passkind.backend.repository.SecretHistoryRepository secretHistoryRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.secretRepository = secretRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.auditLogRepository = auditLogRepository;
        this.secretHistoryRepository = secretHistoryRepository;
        this.passwordEncoder = passwordEncoder;
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

        // Decrypt the value before storing in history
        try {
            String decryptedValue = encryptionService.decrypt(secret.getEncryptedValue());
            previousData.put("secretValue", decryptedValue);
        } catch (Exception e) {
            previousData.put("secretValue", "[Decryption failed]");
        }

        previousData.put("tags", secret.getTags());
        previousData.put("metadata", secret.getMetadata());

        if (name != null && !name.isEmpty()) {
            secret.setName(name);
        }
        if (value != null && !value.isEmpty()) {
            secret.setEncryptedValue(encryptionService.encrypt(value));
        }
        // Always update metadata when provided (even if empty map)
        secret.setMetadata(metadata != null ? metadata : secret.getMetadata());
        // Always update tags when provided (even if empty list)
        secret.setTags(tags != null ? tags : secret.getTags());
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

        // logAudit(username, "READ", "SECRET", String.valueOf(secretId), "Accessed
        // secret value");
        return encryptionService.decrypt(secret.getEncryptedValue());
    }

    @Transactional
    public void deleteSecret(java.util.UUID secretId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Secret secret = secretRepository.findById(secretId)
                .orElseThrow(() -> new ResourceNotFoundException("Secret not found with id: " + secretId));

        if (!secret.getOwner().getUsername().equals(username)) {
            throw new UnauthorizedException("You do not have permission to delete this secret");
        }

        // Delete history first to avoid foreign key constraint violation
        List<com.passkind.backend.entity.SecretHistory> history = secretHistoryRepository
                .findBySecretOrderByModifiedAtDesc(secret);
        secretHistoryRepository.deleteAll(history);

        secretRepository.delete(secret);
        logAudit(username, "DELETE", "SECRET", String.valueOf(secretId), "Deleted secret: " + secret.getName());
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

    public byte[] exportSecretsAsExcel(String rawPassword) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Verify password
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        List<Secret> secrets = secretRepository.findByOwner(user);

        // Create workbook
        org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
        org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Secrets");

        // Create header row
        org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
        String[] headers = { "Name", "Username", "Email", "Password", "Tags", "Created At", "Updated At" };

        org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        for (int i = 0; i < headers.length; i++) {
            org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 1;
        for (Secret secret : secrets) {
            org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(secret.getName());
            row.createCell(1).setCellValue(secret.getUsername() != null ? secret.getUsername() : "");
            row.createCell(2).setCellValue(secret.getEmail() != null ? secret.getEmail() : "");

            // Decrypt password
            try {
                String decryptedValue = encryptionService.decrypt(secret.getEncryptedValue());
                row.createCell(3).setCellValue(decryptedValue);
            } catch (Exception e) {
                row.createCell(3).setCellValue("[Decryption failed]");
                // Log error but continue export
                System.err.println("Failed to decrypt secret " + secret.getId() + ": " + e.getMessage());
            }

            row.createCell(4).setCellValue(secret.getTags() != null ? String.join(", ", secret.getTags()) : "");
            row.createCell(5).setCellValue(secret.getCreatedAt().toString());
            row.createCell(6).setCellValue(secret.getUpdatedAt().toString());
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // In production, you might want to use a separate encryption password
        workbook.lockStructure();

        // Write workbook to a byte array first
        java.io.ByteArrayOutputStream workbookBos = new java.io.ByteArrayOutputStream();
        workbook.write(workbookBos);
        workbook.close();
        byte[] workbookBytes = workbookBos.toByteArray();

        // Encrypt the workbook using POIFS
        try (org.apache.poi.poifs.filesystem.POIFSFileSystem fs = new org.apache.poi.poifs.filesystem.POIFSFileSystem()) {
            org.apache.poi.poifs.crypt.EncryptionInfo info = new org.apache.poi.poifs.crypt.EncryptionInfo(
                    org.apache.poi.poifs.crypt.EncryptionMode.standard);
            org.apache.poi.poifs.crypt.Encryptor enc = info.getEncryptor();
            enc.confirmPassword(rawPassword);

            // Wrap the workbook bytes in an OPCPackage and save it to the encrypted stream
            try (org.apache.poi.openxml4j.opc.OPCPackage opc = org.apache.poi.openxml4j.opc.OPCPackage
                    .open(new java.io.ByteArrayInputStream(workbookBytes));
                    java.io.OutputStream os = enc.getDataStream(fs)) {
                opc.save(os);
            }

            // Write the encrypted file system to the final output stream
            java.io.ByteArrayOutputStream finalBos = new java.io.ByteArrayOutputStream();
            fs.writeFilesystem(finalBos);
            logAudit(username, "EXPORT", "SECRETS", "ALL", "Exported secrets as Excel");
            return finalBos.toByteArray();
        }
    }
}
