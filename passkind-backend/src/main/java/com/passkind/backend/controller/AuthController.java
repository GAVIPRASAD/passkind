package com.passkind.backend.controller;

import com.passkind.backend.dto.RegisterRequest;
import com.passkind.backend.dto.ResendOtpRequest;
import com.passkind.backend.dto.VerifyEmailRequest;
import com.passkind.backend.dto.ForgotPasswordRequest;
import com.passkind.backend.dto.ResetPasswordRequest;
import com.passkind.backend.entity.User;

import com.passkind.backend.exception.BadRequestException;
import com.passkind.backend.exception.UnauthorizedException;
import com.passkind.backend.repository.UserRepository;
import com.passkind.backend.security.JwtTokenProvider;
import com.passkind.backend.service.OTPService;
import com.passkind.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping({ "/api/auth", "/auth" })
@RequiredArgsConstructor

public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final OTPService otpService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity
                .ok(Map.of("message", "User registered successfully. Please check your email for verification code."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        boolean isValid = otpService.validateOTP(request.getEmail(), request.getOtpCode());
        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setIsEmailVerified(true);
        userRepository.save(user);

        // Auto-login: Generate JWT token
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null,
                java.util.Collections.emptyList());
        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getIsEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        try {
            otpService.resendOTP(request.getEmail());
        } catch (Exception e) {
            throw new BadRequestException("Failed to resend OTP: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "OTP resent successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.initiateForgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, an OTP has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return ResponseEntity
                .ok(Map.of("message", "Password reset successfully. You can now login with your new password."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        String identifier = request.getUsername();
        java.util.Optional<User> userOpt = java.util.Optional.empty();

        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else if (identifier.matches("\\d+")) {
            try {
                Long phoneNumber = Long.parseLong(identifier);
                userOpt = userRepository.findByPhoneNumber(phoneNumber);
            } catch (NumberFormatException e) {
                // ignore
            }
        }

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }

        User user = userOpt.orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (userService.isAccountLocked(user)) {
            throw new UnauthorizedException("Account is locked. Please try again later.");
        }

        // Removed: Email verification check is now handled on the frontend via
        // VerifiedRoute
        // if (!user.getIsEmailVerified()) {
        // throw new UnauthorizedException("Email not verified. Please verify your
        // email.");
        // }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            userService.handleSuccessfulLogin(user.getUsername());

            String token = tokenProvider.generateToken(authentication);
            return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
        } catch (BadCredentialsException e) {
            userService.handleFailedLogin(user.getUsername());
            throw new UnauthorizedException("Invalid username or password");
        }
    }

    @Data
    public static class AuthRequest {
        private String username;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String accessToken;
        private String tokenType = "Bearer";

        public AuthResponse(String accessToken) {
            this.accessToken = accessToken;
        }

        public AuthResponse(String accessToken, String tokenType) {
            this.accessToken = accessToken;
            this.tokenType = tokenType;
        }
    }
}
