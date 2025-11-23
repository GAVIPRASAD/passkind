package com.passkind.backend.repository;

import com.passkind.backend.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByEmailAndOtpCodeAndVerifiedFalse(String email, String otpCode);

    void deleteByEmail(String email);

    Optional<OTP> findTopByEmailOrderByCreatedAtDesc(String email);
}
