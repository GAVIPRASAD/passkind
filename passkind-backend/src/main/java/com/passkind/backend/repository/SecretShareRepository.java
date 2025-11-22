package com.passkind.backend.repository;

import com.passkind.backend.entity.SecretShare;
import com.passkind.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecretShareRepository extends JpaRepository<SecretShare, Long> {
    List<SecretShare> findBySharedWith(User user);
}
