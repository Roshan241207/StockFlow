package com.example.stockflowapi.controller;

import com.example.stockflowapi.entity.Notification;
import com.example.stockflowapi.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationRestController {

    private final NotificationService notificationService;


    public NotificationRestController(
            NotificationService notificationService
    ) {
        this.notificationService =
                notificationService;
    }


    // =========================================
    // GET ALL NOTIFICATIONS
    // =========================================

    @GetMapping
    public ResponseEntity<List<Notification>>
    getNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getAllNotifications()
        );
    }


    // =========================================
    // GET UNREAD COUNT
    // =========================================

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>>
    getUnreadCount() {

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        notificationService
                                .getUnreadCount()
                )
        );
    }


    // =========================================
    // MARK ONE AS READ
    // =========================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification>
    markAsRead(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id)
        );
    }


    // =========================================
    // MARK ALL AS READ
    // =========================================

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>>
    markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "All notifications marked as read."
                )
        );
    }
}