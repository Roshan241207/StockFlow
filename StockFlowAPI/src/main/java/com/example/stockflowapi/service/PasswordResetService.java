package com.example.stockflowapi.service;

import com.example.stockflowapi.entity.PasswordResetToken;
import com.example.stockflowapi.entity.User;
import com.example.stockflowapi.repository.PasswordResetTokenRepository;
import com.example.stockflowapi.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    private final SecureRandom secureRandom =
            new SecureRandom();


    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            JavaMailSender mailSender) {

        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
    }


    // =========================
    // SEND OTP
    // =========================

    public void sendOtp(String email) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Gmail address is required."
            );
        }


        String trimmedEmail =
                email.trim();


        // Gmail-only validation
        String gmailPattern =
                "^[A-Za-z0-9._%+-]+@gmail\\.com$";


        if (!trimmedEmail.matches(
                gmailPattern)) {

            throw new IllegalArgumentException(
                    "Please enter a valid Gmail address."
            );
        }


        // Find user
        User user = userRepository
                .findByEmail(trimmedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No account found with this Gmail address."
                        )
                );


        // Generate 6-digit OTP
        String otp =
                String.format(
                        "%06d",
                        secureRandom.nextInt(1_000_000)
                );


        // Create token
        PasswordResetToken token =
                new PasswordResetToken();

        token.setEmail(
                user.getEmail()
        );

        token.setOtp(otp);

        token.setExpiryTime(
                LocalDateTime.now()
                        .plusMinutes(10)
        );


        tokenRepository.save(token);


        // =========================
        // SEND EMAIL
        // =========================

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(
                user.getEmail()
        );

        message.setSubject(
                "StockFlow Password Reset OTP"
        );

        message.setText(
                "Hello " +
                        user.getUsername() +
                        ",\n\n" +

                        "Your StockFlow password reset OTP is: " +
                        otp +
                        "\n\n" +

                        "This OTP is valid for 10 minutes.\n\n" +

                        "If you did not request a password reset, " +
                        "please ignore this email.\n\n" +

                        "StockFlow"
        );


        mailSender.send(message);
    }


    // =========================
    // VERIFY OTP
    // =========================

    public void verifyOtp(
            String email,
            String otp) {

        PasswordResetToken token =
                getValidToken(email, otp);

        // No action needed if valid.
        // If invalid, getValidToken()
        // throws an exception.
    }


    // =========================
    // RESET PASSWORD
    // =========================

    public void resetPassword(
            String email,
            String otp,
            String newPassword) {


        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "New password is required."
            );
        }


        if (newPassword.length() < 6) {

            throw new IllegalArgumentException(
                    "Password must contain at least 6 characters."
            );
        }


        // Validate OTP
        PasswordResetToken token =
                getValidToken(
                        email,
                        otp
                );


        // Find user
        User user = userRepository
                .findByEmail(email.trim())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found."
                        )
                );


        // Update password
        user.setPassword(
                newPassword
        );


        userRepository.save(user);


        // Delete used OTP
        tokenRepository.delete(token);
    }


    // =========================
    // VALIDATE OTP
    // =========================

    private PasswordResetToken getValidToken(
            String email,
            String otp) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Gmail address is required."
            );
        }


        if (otp == null ||
                !otp.matches("\\d{6}")) {

            throw new IllegalArgumentException(
                    "OTP must contain exactly 6 digits."
            );
        }


        String trimmedEmail =
                email.trim();


        PasswordResetToken token =
                tokenRepository
                        .findTopByEmailOrderByIdDesc(
                                trimmedEmail
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "OTP not found. Please request a new OTP."
                                )
                        );


        // Check OTP
        if (!token.getOtp().equals(otp)) {

            throw new IllegalArgumentException(
                    "Invalid OTP."
            );
        }


        // Check expiry
        if (token.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        return token;
    }
}