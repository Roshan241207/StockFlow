package com.example.stockflowapi.service;

import com.example.stockflowapi.entity.Notification;
import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;


    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }


    // =========================================
    // CHECK LOW STOCK AFTER STOCK CHANGE
    // =========================================

    public void checkLowStockAfterStockChange(
            Product product,
            double previousStock) {

        if (product == null) {
            return;
        }

        if (product.getCurrentStock() == null) {
            return;
        }

        if (product.getMinimumStock() == null) {
            return;
        }


        double currentStock =
                product.getCurrentStock();

        double minimumStock =
                product.getMinimumStock();


        // Product was above minimum stock
        // before the stock change.
        boolean wasAboveMinimum =
                previousStock > minimumStock;


        // Product is now at or below minimum stock.
        boolean isNowLow =
                currentStock <= minimumStock;


        // Create notification only when
        // stock crosses into the low-stock state.
        if (wasAboveMinimum && isNowLow) {

            createLowStockNotification(product);
        }
    }


    // =========================================
    // CREATE LOW STOCK NOTIFICATION
    // =========================================

    private void createLowStockNotification(
            Product product) {

        Notification notification =
                new Notification();


        notification.setNotificationType(
                "LOW_STOCK"
        );


        notification.setTitle(
                "Low Stock Alert"
        );


        notification.setMessage(
                product.getProductName()
                        + " is running low on stock."
                        + " Current stock: "
                        + product.getCurrentStock()
                        + ", minimum stock: "
                        + product.getMinimumStock()
        );


        notification.setProductId(
                product.getId()
        );


        notification.setProductName(
                product.getProductName()
        );


        notification.setCurrentStock(
                product.getCurrentStock()
        );


        notification.setMinimumStock(
                product.getMinimumStock()
        );


        notification.setReadStatus(false);


        notificationRepository.save(
                notification
        );
    }


    // =========================================
    // GET ALL NOTIFICATIONS
    // =========================================

    public List<Notification> getAllNotifications() {

        return notificationRepository
                .findTop50ByOrderByCreatedAtDesc();
    }


    // =========================================
    // GET UNREAD COUNT
    // =========================================

    public long getUnreadCount() {

        return notificationRepository
                .countByReadStatusFalse();
    }


    // =========================================
    // MARK ONE AS READ
    // =========================================

    @Transactional
    public Notification markAsRead(Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notification not found."
                                )
                        );


        notification.setReadStatus(true);


        return notificationRepository.save(
                notification
        );
    }


    // =========================================
    // MARK ALL AS READ
    // =========================================

    @Transactional
    public void markAllAsRead() {

        List<Notification> notifications =
                notificationRepository
                        .findByReadStatusFalse();


        for (Notification notification :
                notifications) {

            notification.setReadStatus(true);
        }


        notificationRepository.saveAll(
                notifications
        );
    }
}