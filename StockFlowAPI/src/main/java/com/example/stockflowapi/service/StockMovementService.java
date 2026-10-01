package com.example.stockflowapi.service;

import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.StockMovement;
import com.example.stockflowapi.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(
            StockMovementRepository stockMovementRepository) {

        this.stockMovementRepository =
                stockMovementRepository;
    }


    // =========================
    // CREATE MOVEMENT
    // =========================

    public StockMovement createMovement(
            Product product,
            String movementType,
            Double quantity,
            Double stockAfter,
            String reason) {

        StockMovement movement =
                new StockMovement();

        movement.setProduct(product);

        movement.setMovementType(
                movementType
        );

        movement.setQuantity(
                quantity
        );

        movement.setStockAfter(
                stockAfter
        );

        movement.setReason(
                reason
        );

        movement.setMovementDate(
                LocalDateTime.now()
        );

        return stockMovementRepository.save(
                movement
        );
    }


    // =========================
    // GET ALL MOVEMENTS
    // =========================

    public List<StockMovement> getAllMovements() {

        return stockMovementRepository
                .findAll();
    }


    // =========================
    // GET PRODUCT MOVEMENTS
    // =========================

    public List<StockMovement> getProductMovements(
            Long productId) {

        return stockMovementRepository
                .findByProductIdOrderByMovementDateDesc(
                        productId
                );
    }


    // =========================
    // GET RECENT 6 MOVEMENTS
    // =========================

    public List<StockMovement> getRecentMovements() {

        return stockMovementRepository
                .findTop6ByOrderByMovementDateDesc();
    }
}