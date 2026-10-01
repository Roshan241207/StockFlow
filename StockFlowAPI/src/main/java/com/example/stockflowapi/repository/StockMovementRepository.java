package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByMovementDateDesc(
            Long productId
    );

    List<StockMovement> findTop6ByOrderByMovementDateDesc();
}