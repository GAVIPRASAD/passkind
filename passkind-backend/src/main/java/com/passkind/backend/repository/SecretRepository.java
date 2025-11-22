package com.passkind.backend.repository;

import com.passkind.backend.entity.Secret;
import com.passkind.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecretRepository extends JpaRepository<Secret, Long> {
    List<Secret> findByOwner(User owner);
}
