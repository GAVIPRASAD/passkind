package com.passkind.backend.security;

import com.passkind.backend.entity.User;
import com.passkind.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + identifier));
        } else if (identifier.matches("\\d+")) {
            try {
                Long phoneNumber = Long.parseLong(identifier);
                user = userRepository.findByPhoneNumber(phoneNumber)
                        .orElseThrow(
                                () -> new UsernameNotFoundException("User not found with phone number: " + identifier));
            } catch (NumberFormatException e) {
                // Fallback to username if parsing fails (unlikely given regex)
                user = userRepository.findByUsername(identifier)
                        .orElseThrow(
                                () -> new UsernameNotFoundException("User not found with username: " + identifier));
            }
        } else {
            user = userRepository.findByUsername(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + identifier));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), // Always return the actual username as the principal
                user.getPassword(),
                Collections.emptyList());
    }
}
