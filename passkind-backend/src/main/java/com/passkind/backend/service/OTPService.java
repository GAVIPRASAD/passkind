package com.passkind.backend.service;

import com.passkind.backend.entity.OTP;
import com.passkind.backend.repository.OTPRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OTPService {
    private final OTPRepository otpRepository;
    private final EmailService emailService;

    private static final int OTP_LENGTH = 6;
    private static final int EXPIRY_MINUTES = 5;

    public void generateOTP(String email) throws Exception {
        // Remove any existing OTPs for this email
        otpRepository.deleteByEmail(email);
        String otpCode = String.format("%0" + OTP_LENGTH + "d", new Random().nextInt((int) Math.pow(10, OTP_LENGTH)));
        OTP otp = new OTP();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        otpRepository.save(otp);
        emailService.sendOtpEmail(email, otpCode);
    }

    public boolean validateOTP(String email, String otpCode) {
        Optional<OTP> opt = otpRepository.findByEmailAndOtpCodeAndVerifiedFalse(email, otpCode);
        if (opt.isEmpty()) {
            return false;
        }
        OTP otp = opt.get();
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }
        otp.setVerified(true);
        otpRepository.save(otp);
        return true;
    }

    public void resendOTP(String email) throws Exception {
        generateOTP(email);
    }
}
