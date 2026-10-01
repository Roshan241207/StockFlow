package com.example.stockflowapi.controller;

import com.example.stockflowapi.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class PasswordResetRestController {

    private final PasswordResetService passwordResetService;

    public PasswordResetRestController(
            PasswordResetService passwordResetService) {

        this.passwordResetService =
                passwordResetService;
    }


    // =========================
    // FORGOT PASSWORD
    // =========================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            passwordResetService.sendOtp(email);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP sent successfully to your Gmail."
                    )
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to send OTP email."
                            )
                    );
        }
    }


    // =========================
    // VERIFY OTP
    // =========================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            String otp =
                    request.get("otp");

            passwordResetService.verifyOtp(
                    email,
                    otp
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP verified successfully."
                    )
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to verify OTP."
                            )
                    );
        }
    }


    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            String otp =
                    request.get("otp");

            String newPassword =
                    request.get("newPassword");


            passwordResetService.resetPassword(
                    email,
                    otp,
                    newPassword
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password reset successfully."
                    )
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );

        } catch (Exception error) {

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to reset password."
                            )
                    );
        }
    }
}