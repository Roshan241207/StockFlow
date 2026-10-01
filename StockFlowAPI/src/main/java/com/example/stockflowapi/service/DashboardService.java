package com.example.stockflowapi.service;

import com.example.stockflowapi.dto.DashboardResponse;
import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.StockMovement;
import com.example.stockflowapi.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final StockMovementService stockMovementService;

    public DashboardService(
            ProductRepository productRepository,
            StockMovementService stockMovementService) {

        this.productRepository = productRepository;
        this.stockMovementService = stockMovementService;
    }


    // =========================
    // GET DASHBOARD DATA
    // =========================

    public DashboardResponse getDashboardData() {

        // Get all products
        List<Product> products =
                productRepository.findAll();


        // Create response object
        DashboardResponse response =
                new DashboardResponse();


        // =========================
        // TOTAL PRODUCTS
        // =========================

        response.setTotalProducts(
                products.size()
        );


        // =========================
        // LOW STOCK PRODUCTS
        // =========================

        List<Product> lowStockProducts =
                products.stream()
                        .filter(product -> {

                            double currentStock =
                                    product.getCurrentStock() == null
                                            ? 0.0
                                            : product.getCurrentStock();

                            double minimumStock =
                                    product.getMinimumStock() == null
                                            ? 0.0
                                            : product.getMinimumStock();

                            return currentStock <= minimumStock;
                        })
                        .collect(Collectors.toList());


        response.setLowStockProducts(
                lowStockProducts
        );


        response.setLowStockCount(
                lowStockProducts.size()
        );


        // =========================
        // TOTAL STOCK
        // =========================

        double totalStock =
                products.stream()
                        .mapToDouble(product ->
                                product.getCurrentStock() == null
                                        ? 0.0
                                        : product.getCurrentStock()
                        )
                        .sum();


        response.setTotalStock(
                totalStock
        );


        // =========================
        // STOCK VALUE
        // =========================

        double stockValue =
                products.stream()
                        .mapToDouble(product -> {

                            double currentStock =
                                    product.getCurrentStock() == null
                                            ? 0.0
                                            : product.getCurrentStock();

                            double purchasePrice =
                                    product.getPurchasePrice() == null
                                            ? 0.0
                                            : product.getPurchasePrice();

                            return currentStock * purchasePrice;
                        })
                        .sum();


        response.setStockValue(
                stockValue
        );


        // =========================
        // RECENT MOVEMENTS
        // =========================

        List<StockMovement> recentMovements =
                stockMovementService
                        .getRecentMovements();


        response.setRecentMovements(
                recentMovements
        );


        return response;
    }
}