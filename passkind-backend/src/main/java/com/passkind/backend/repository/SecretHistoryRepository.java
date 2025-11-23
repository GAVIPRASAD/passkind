package com.passkind.backend.repository;

import com.passkind.backend.entity.Secret;
import com.passkind.backend.entity.SecretHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SecretHistoryRepository extends JpaRepository<SecretHistory, UUID> {
    List<SecretHistory> findBySecretOrderByModifiedAtDesc(Secret secret);
}
