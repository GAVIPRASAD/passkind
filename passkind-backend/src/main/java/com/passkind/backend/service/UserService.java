package com.passkind.backend.service;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passkind.backend.dto.RegisterRequest;
import com.passkind.backend.entity.Role;
import com.passkind.backend.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import com.passkind.backend.dto.ForgotPasswordRequest;
import com.passkind.backend.dto.ResetPasswordRequest;
import com.passkind.backend.dto.ChangePasswordRequest;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OTPService otpService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_DURATION_HOURS = 1;

    @Transactional
    public void registerUser(RegisterRequest request) {
        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());

        if (existingUserByEmail.isPresent()) {
            User user = existingUserByEmail.get();
            if (user.getIsEmailVerified()) {
                throw new BadRequestException("Email already exists");
            }
            // User exists but not verified. Allow re-registration (update).

            // Check if username is taken by a DIFFERENT user
            Optional<User> existingUserByUsername = userRepository.findByUsername(request.getUsername());
            if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(user.getId())) {
                throw new BadRequestException("Username already exists");
            }

            // Update user details
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            // Ensure default role is present
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                user.setRoles(new HashSet<>(Collections.singletonList(Role.ROLE_USER)));
            }
            userRepository.save(user);

            // Send OTP
            try {
                otpService.generateOTP(request.getEmail());
            } catch (Exception e) {
                throw new RuntimeException("Failed to send OTP: " + e.getMessage(), e);
            }
        } else {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username already exists");
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setIsEmailVerified(false);
            user.setRoles(new HashSet<>(Collections.singletonList(Role.ROLE_USER)));
            userRepository.save(user);

            try {
                otpService.generateOTP(request.getEmail());
            } catch (Exception e) {
                throw new RuntimeException("Failed to send OTP: " + e.getMessage(), e);
            }
        }
    }

    @Transactional
    public void handleFailedLogin(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getIsLocked()) {
                return;
            }

            int failedAttempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(failedAttempts);

            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                user.setIsLocked(true);
                user.setLockUntil(LocalDateTime.now().plusHours(LOCK_TIME_DURATION_HOURS));
            }
            userRepository.save(user);
        }
    }

    @Transactional
    public void handleSuccessfulLogin(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFailedLoginAttempts(0);
            user.setIsLocked(false);
            user.setLockUntil(null);
            user.setLastLoginDate(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    @Transactional
    public boolean unlockAccount(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsLocked(false);
            user.setLockUntil(null);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean isAccountLocked(User user) {
        if (!user.getIsLocked()) {
            return false;
        }

        if (user.getLockUntil() != null && user.getLockUntil().isBefore(LocalDateTime.now())) {
            // Lock expired
            user.setIsLocked(false);
            user.setLockUntil(null);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            return false;
        }

        return true;
    }

    @Transactional
    public void initiateForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with this email"));

        try {
            otpService.generateOTP(user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtp());
        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
