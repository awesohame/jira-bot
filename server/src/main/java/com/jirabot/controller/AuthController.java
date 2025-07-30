package com.jirabot.controller;

import com.jirabot.dto.AuthResponse;
import com.jirabot.dto.LoginRequest;
import com.jirabot.dto.SignupRequest;
import com.jirabot.entity.User;
import com.jirabot.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174" })
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        logger.info("Signup request for username: {}", request.getUsername());

        AuthResponse response = authService.signup(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login request for username: {}", request.getUsername());

        AuthResponse response = authService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);

            if (token == null) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid authorization header"));
            }

            logger.info("Logout request for token: {}", token.substring(0, Math.min(token.length(), 10)) + "...");

            AuthResponse response = authService.logout(token);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error during logout: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.error("An error occurred during logout"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);

            if (token == null) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid authorization header"));
            }

            boolean isValid = authService.validateToken(token);

            if (isValid) {
                Optional<User> userOptional = authService.getUserByToken(token);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    return ResponseEntity.ok(AuthResponse.success(
                            "Token is valid",
                            user.getUsername(),
                            user.getEmail(),
                            token,
                            user.getJiraToken()));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid or expired token"));

        } catch (Exception e) {
            logger.error("Error validating token: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.error("An error occurred during token validation"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);

            if (token == null) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid authorization header"));
            }

            Optional<User> userOptional = authService.getUserByToken(token);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                return ResponseEntity.ok(user);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid or expired token"));

        } catch (Exception e) {
            logger.error("Error getting current user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponse.error("An error occurred"));
        }
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
