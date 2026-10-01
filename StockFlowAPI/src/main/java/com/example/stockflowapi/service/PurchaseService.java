package com.example.stockflowapi.service;

import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.Purchase;
import com.example.stockflowapi.entity.PurchaseItem;
import com.example.stockflowapi.entity.Supplier;
import com.example.stockflowapi.repository.ProductRepository;
import com.example.stockflowapi.repository.PurchaseItemRepository;
import com.example.stockflowapi.repository.PurchaseRepository;
import com.example.stockflowapi.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final StockMovementService stockMovementService;
    private final NotificationService notificationService;


    public PurchaseService(
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository purchaseItemRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository,
            StockMovementService stockMovementService,
            NotificationService notificationService) {

        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.stockMovementService = stockMovementService;
        this.notificationService = notificationService;
    }


    // =========================
    // GET ALL PURCHASES
    // =========================

    public List<Purchase> getAllPurchases() {

        return purchaseRepository.findAll();
    }


    // =========================
    // GET PURCHASE BY ID
    // =========================

    public Optional<Purchase> getPurchaseById(Long id) {

        return purchaseRepository.findById(id);
    }


    // =========================
    // GET PURCHASE ITEMS
    // =========================

    public List<PurchaseItem> getPurchaseItems(
            Long purchaseId) {

        return purchaseItemRepository
                .findByPurchaseId(purchaseId);
    }


    // =========================
    // CREATE PURCHASE
    // =========================

    @Transactional
    public Purchase createPurchase(
            Purchase purchase,
            List<PurchaseItem> items) {

        if (purchase.getSupplier() == null ||
                purchase.getSupplier().getId() == null) {

            throw new IllegalArgumentException(
                    "Supplier is required."
            );
        }


        if (items == null || items.isEmpty()) {

            throw new IllegalArgumentException(
                    "At least one purchase item is required."
            );
        }


        // =========================
        // FIND SUPPLIER
        // =========================

        Supplier supplier = supplierRepository
                .findById(
                        purchase.getSupplier().getId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Supplier not found."
                        )
                );


        purchase.setSupplier(supplier);


        // =========================
        // VALIDATE PURCHASE
        // =========================

        if (purchase.getPurchaseNumber() == null ||
                purchase.getPurchaseNumber().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Purchase number is required."
            );
        }


        if (purchase.getPurchaseDate() == null) {

            throw new IllegalArgumentException(
                    "Purchase date is required."
            );
        }


        double totalAmount = 0.0;


        // =========================
        // SAVE PURCHASE
        // =========================

        purchase.setTotalAmount(0.0);

        Purchase savedPurchase =
                purchaseRepository.save(purchase);


        // =========================
        // PROCESS ITEMS
        // =========================

        for (PurchaseItem item : items) {

            if (item.getProduct() == null ||
                    item.getProduct().getId() == null) {

                throw new IllegalArgumentException(
                        "Product is required for every purchase item."
                );
            }


            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Purchase quantity must be greater than zero."
                );
            }


            if (item.getRate() == null ||
                    item.getRate() < 0) {

                throw new IllegalArgumentException(
                        "Purchase rate cannot be negative."
                );
            }


            // =========================
            // FIND PRODUCT
            // =========================

            Product product = productRepository
                    .findById(
                            item.getProduct().getId()
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Product not found."
                            )
                    );


            // =========================
            // CALCULATE ITEM TOTAL
            // =========================

            double itemTotal =
                    item.getQuantity()
                            * item.getRate();


            item.setTotal(itemTotal);

            item.setPurchase(savedPurchase);

            item.setProduct(product);


            // =========================
            // SAVE PURCHASE ITEM
            // =========================

            purchaseItemRepository.save(item);


            // =========================
            // INCREASE STOCK
            // =========================

            double currentStock =
                    product.getCurrentStock() == null
                            ? 0.0
                            : product.getCurrentStock();


            // Store stock before change
            double previousStock = currentStock;


            double newStock =
                    currentStock + item.getQuantity();


            product.setCurrentStock(newStock);


            productRepository.save(product);


            // =========================
            // CREATE STOCK MOVEMENT
            // =========================

            stockMovementService.createMovement(
                    product,
                    "PURCHASE",
                    item.getQuantity(),
                    newStock,
                    "Stock purchased from supplier"
            );


            // =========================
            // CHECK LOW STOCK
            // =========================

            notificationService.checkLowStockAfterStockChange(
                    product,
                    previousStock
            );


            // =========================
            // ADD TO PURCHASE TOTAL
            // =========================

            totalAmount += itemTotal;
        }


        // =========================
        // UPDATE PURCHASE TOTAL
        // =========================

        savedPurchase.setTotalAmount(
                totalAmount
        );


        return purchaseRepository.save(
                savedPurchase
        );
    }
}