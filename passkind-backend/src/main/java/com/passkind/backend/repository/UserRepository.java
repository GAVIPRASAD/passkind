package com.passkind.backend.repository;

import com.passkind.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, java.util.UUID> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    // Preserve existing username methods for compatibility
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Optional<User> findByPhoneNumber(Long phoneNumber);
}
