package com.passkind.backend.service;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_DURATION_HOURS = 1;

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
}
