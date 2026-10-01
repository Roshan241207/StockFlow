package com.example.stockflowapi.controller;

import com.example.stockflowapi.dto.LoginRequest;
import com.example.stockflowapi.dto.RegisterRequest;
import com.example.stockflowapi.entity.User;
import com.example.stockflowapi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthRestController {

    private final UserService userService;

    public AuthRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService
                .findByUsername(request.getUsername())
                .orElse(null);

        if (user == null ||
                !user.getPassword().equals(request.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "User account is inactive"
                    ));
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("status", user.getStatus());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.getUsername() == null ||
                request.getUsername().trim().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "Username is required.")
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "Gmail address is required.")
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "Password is required.")
            );
        }

        String gmailPattern =
                "^[A-Za-z0-9._%+-]+@gmail\\.com$";

        if (!request.getEmail().matches(gmailPattern)) {

            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "Please enter a valid Gmail address.")
            );
        }

        if (userService.usernameExists(request.getUsername())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Username already exists."
                    ));
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setRole("USER");
        user.setStatus("ACTIVE");

        User savedUser = userService.saveUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message",
                        "Registration successful.",
                        "id",
                        savedUser.getId(),
                        "username",
                        savedUser.getUsername()
                ));
    }

    @GetMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {

        if (userService.findByUsername("admin").isPresent()) {

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Admin user already exists."
                    )
            );
        }

        User user = new User();

        user.setUsername("admin");
        user.setPassword("admin123");
        user.setEmail("admin@gmail.com");
        user.setRole("ADMIN");
        user.setStatus("ACTIVE");

        userService.saveUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message",
                        "Admin user created successfully."
                ));
    }
}