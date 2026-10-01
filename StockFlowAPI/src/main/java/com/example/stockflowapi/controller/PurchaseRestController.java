package com.example.stockflowapi.controller;

import com.example.stockflowapi.dto.PurchaseItemRequest;
import com.example.stockflowapi.dto.PurchaseRequest;
import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.Purchase;
import com.example.stockflowapi.entity.PurchaseItem;
import com.example.stockflowapi.entity.Supplier;
import com.example.stockflowapi.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseRestController {

    private final PurchaseService purchaseService;

    public PurchaseRestController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }


    // =========================
    // GET ALL PURCHASES
    // =========================

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseService.getAllPurchases();
    }


    // =========================
    // GET PURCHASE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(
            @PathVariable Long id) {

        return purchaseService.getPurchaseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // GET PURCHASE ITEMS
    // =========================

    @GetMapping("/{id}/items")
    public ResponseEntity<List<PurchaseItem>> getPurchaseItems(
            @PathVariable Long id) {

        if (purchaseService.getPurchaseById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                purchaseService.getPurchaseItems(id)
        );
    }


    // =========================
    // CREATE PURCHASE
    // =========================

    @PostMapping
    public ResponseEntity<?> createPurchase(
            @RequestBody PurchaseRequest request) {

        try {

            // Validate request
            if (request.getPurchaseNumber() == null ||
                    request.getPurchaseNumber().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Purchase number is required."
                        ));
            }


            if (request.getPurchaseDate() == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Purchase date is required."
                        ));
            }


            if (request.getSupplierId() == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Supplier is required."
                        ));
            }


            if (request.getItems() == null ||
                    request.getItems().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "At least one purchase item is required."
                        ));
            }


            // =========================
            // CREATE PURCHASE ENTITY
            // =========================

            Purchase purchase = new Purchase();

            purchase.setPurchaseNumber(
                    request.getPurchaseNumber().trim()
            );

            purchase.setPurchaseDate(
                    request.getPurchaseDate()
            );


            // Connect supplier using ID
            Supplier supplier = new Supplier();

            supplier.setId(
                    request.getSupplierId()
            );

            purchase.setSupplier(supplier);


            // =========================
            // CREATE PURCHASE ITEMS
            // =========================

            List<PurchaseItem> purchaseItems =
                    request.getItems()
                            .stream()
                            .map(this::convertToPurchaseItem)
                            .toList();


            // =========================
            // SAVE PURCHASE
            // =========================

            Purchase savedPurchase =
                    purchaseService.createPurchase(
                            purchase,
                            purchaseItems
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedPurchase);


        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            error.getMessage()
                    ));

        } catch (Exception error) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to create purchase."
                    ));
        }
    }


    // =========================
    // CONVERT DTO TO ENTITY
    // =========================

    private PurchaseItem convertToPurchaseItem(
            PurchaseItemRequest request) {

        PurchaseItem item = new PurchaseItem();


        Product product = new Product();

        product.setId(
                request.getProductId()
        );


        item.setProduct(product);

        item.setQuantity(
                request.getQuantity()
        );

        item.setRate(
                request.getRate()
        );


        return item;
    }
}