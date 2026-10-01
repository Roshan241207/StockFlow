package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findTop50ByOrderByCreatedAtDesc();

    List<Notification> findByReadStatusFalse();

    long countByReadStatusFalse();
}