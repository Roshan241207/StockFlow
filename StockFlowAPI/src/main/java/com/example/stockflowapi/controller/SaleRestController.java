package com.example.stockflowapi.controller;

import com.example.stockflowapi.dto.SaleItemRequest;
import com.example.stockflowapi.dto.SaleRequest;
import com.example.stockflowapi.entity.Customer;
import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.Sale;
import com.example.stockflowapi.entity.SaleItem;
import com.example.stockflowapi.service.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleRestController {

    private final SaleService saleService;

    public SaleRestController(SaleService saleService) {
        this.saleService = saleService;
    }


    // =========================
    // GET ALL SALES
    // =========================

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }


    // =========================
    // GET SALE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(
            @PathVariable Long id) {

        return saleService.getSaleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // GET SALE ITEMS
    // =========================

    @GetMapping("/{id}/items")
    public ResponseEntity<List<SaleItem>> getSaleItems(
            @PathVariable Long id) {

        if (saleService.getSaleById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                saleService.getSaleItems(id)
        );
    }


    // =========================
    // CREATE SALE
    // =========================

    @PostMapping
    public ResponseEntity<?> createSale(
            @RequestBody SaleRequest request) {

        try {

            // Validate sale number
            if (request.getSaleNumber() == null ||
                    request.getSaleNumber().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Sale number is required."
                        ));
            }


            // Validate sale date
            if (request.getSaleDate() == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Sale date is required."
                        ));
            }


            // Validate customer
            if (request.getCustomerId() == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Customer is required."
                        ));
            }


            // Validate items
            if (request.getItems() == null ||
                    request.getItems().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "At least one sale item is required."
                        ));
            }


            // =========================
            // CREATE SALE ENTITY
            // =========================

            Sale sale = new Sale();

            sale.setSaleNumber(
                    request.getSaleNumber().trim()
            );

            sale.setSaleDate(
                    request.getSaleDate()
            );


            // Connect customer using ID
            Customer customer = new Customer();

            customer.setId(
                    request.getCustomerId()
            );

            sale.setCustomer(customer);


            // =========================
            // CREATE SALE ITEMS
            // =========================

            List<SaleItem> saleItems =
                    request.getItems()
                            .stream()
                            .map(this::convertToSaleItem)
                            .toList();


            // =========================
            // SAVE SALE
            // =========================

            Sale savedSale =
                    saleService.createSale(
                            sale,
                            saleItems
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedSale);


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
                            "Failed to create sale."
                    ));
        }
    }


    // =========================
    // CONVERT DTO TO ENTITY
    // =========================

    private SaleItem convertToSaleItem(
            SaleItemRequest request) {

        SaleItem item = new SaleItem();


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