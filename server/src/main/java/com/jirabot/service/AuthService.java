package com.jirabot.service;

import com.jirabot.dto.AuthResponse;
import com.jirabot.dto.LoginRequest;
import com.jirabot.dto.SignupRequest;
import com.jirabot.entity.User;
import com.jirabot.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return AuthResponse.error("Username already exists");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return AuthResponse.error("Email already exists");
            }

            // Generate session token for the new user
            String sessionToken = UUID.randomUUID().toString();

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setToken(sessionToken); // Session token for authentication
            user.setJiraToken(request.getToken()); // User's JIRA token
            user.setTokenExpiry(LocalDateTime.now().plusDays(30)); // Token valid for 30 days
            user.setIsActive(true);

            User savedUser = userRepository.save(user);

            logger.info("User created successfully: {}", savedUser.getUsername());

            return AuthResponse.success(
                    "User created successfully",
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    sessionToken,
                    savedUser.getJiraToken());

        } catch (Exception e) {
            logger.error("Error during signup: ", e);
            return AuthResponse.error("An error occurred during signup");
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Optional<User> userOptional = userRepository.findActiveUserByUsername(request.getUsername());

            if (userOptional.isEmpty()) {
                return AuthResponse.error("Invalid username or password");
            }

            User user = userOptional.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return AuthResponse.error("Invalid username or password");
            }

            // Generate new token for login session
            String sessionToken = UUID.randomUUID().toString();
            user.setToken(sessionToken);
            user.setTokenExpiry(LocalDateTime.now().plusDays(30));
            user.setLastLogin(LocalDateTime.now());

            userRepository.save(user);

            logger.info("User logged in successfully: {}", user.getUsername());

            return AuthResponse.success(
                    "Login successful",
                    user.getUsername(),
                    user.getEmail(),
                    sessionToken,
                    user.getJiraToken());

        } catch (Exception e) {
            logger.error("Error during login: ", e);
            return AuthResponse.error("An error occurred during login");
        }
    }

    public boolean validateToken(String token) {
        try {
            Optional<User> userOptional = userRepository.findByValidToken(token, LocalDateTime.now());
            return userOptional.isPresent();
        } catch (Exception e) {
            logger.error("Error validating token: ", e);
            return false;
        }
    }

    public Optional<User> getUserByToken(String token) {
        try {
            return userRepository.findByValidToken(token, LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Error getting user by token: ", e);
            return Optional.empty();
        }
    }

    public AuthResponse logout(String token) {
        try {
            Optional<User> userOptional = userRepository.findByToken(token);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setToken(null);
                user.setTokenExpiry(null);
                userRepository.save(user);

                logger.info("User logged out successfully: {}", user.getUsername());
                return AuthResponse.success("Logout successful", null, null, null);
            }

            return AuthResponse.error("Invalid token");

        } catch (Exception e) {
            logger.error("Error during logout: ", e);
            return AuthResponse.error("An error occurred during logout");
        }
    }

    public User updateUser(User user) {
        try {
            User updatedUser = userRepository.save(user);
            logger.info("User updated successfully: {}", updatedUser.getUsername());
            return updatedUser;
        } catch (Exception e) {
            logger.error("Error updating user: ", e);
            throw new RuntimeException("Failed to update user", e);
        }
    }
}
