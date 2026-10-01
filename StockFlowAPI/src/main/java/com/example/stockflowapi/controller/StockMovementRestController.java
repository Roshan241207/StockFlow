package com.example.stockflowapi.controller;

import com.example.stockflowapi.entity.StockMovement;
import com.example.stockflowapi.service.StockMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin(origins = "http://localhost:5173")
public class StockMovementRestController {

    private final StockMovementService stockMovementService;

    public StockMovementRestController(
            StockMovementService stockMovementService) {

        this.stockMovementService = stockMovementService;
    }


    // =========================
    // GET ALL MOVEMENTS
    // =========================

    @GetMapping
    public List<StockMovement> getAllMovements() {

        return stockMovementService
                .getAllMovements();
    }


    // =========================
    // GET PRODUCT MOVEMENTS
    // =========================

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockMovement>> getProductMovements(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                stockMovementService
                        .getProductMovements(productId)
        );
    }


    // =========================
    // GET RECENT 6 MOVEMENTS
    // =========================

    @GetMapping("/recent")
    public List<StockMovement> getRecentMovements() {

        return stockMovementService
                .getRecentMovements();
    }
}