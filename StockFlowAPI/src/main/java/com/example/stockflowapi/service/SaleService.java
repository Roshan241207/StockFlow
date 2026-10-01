package com.example.stockflowapi.service;

import com.example.stockflowapi.entity.Customer;
import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.Sale;
import com.example.stockflowapi.entity.SaleItem;
import com.example.stockflowapi.repository.CustomerRepository;
import com.example.stockflowapi.repository.ProductRepository;
import com.example.stockflowapi.repository.SaleItemRepository;
import com.example.stockflowapi.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final StockMovementService stockMovementService;
    private final NotificationService notificationService;


    public SaleService(
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            StockMovementService stockMovementService,
            NotificationService notificationService) {

        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.stockMovementService = stockMovementService;
        this.notificationService = notificationService;
    }


    // =========================
    // GET ALL SALES
    // =========================

    public List<Sale> getAllSales() {

        return saleRepository.findAll();
    }


    // =========================
    // GET SALE BY ID
    // =========================

    public Optional<Sale> getSaleById(Long id) {

        return saleRepository.findById(id);
    }


    // =========================
    // GET SALE ITEMS
    // =========================

    public List<SaleItem> getSaleItems(
            Long saleId) {

        return saleItemRepository
                .findBySaleId(saleId);
    }


    // =========================
    // CREATE SALE
    // =========================

    @Transactional
    public Sale createSale(
            Sale sale,
            List<SaleItem> items) {

        if (sale.getCustomer() == null ||
                sale.getCustomer().getId() == null) {

            throw new IllegalArgumentException(
                    "Customer is required."
            );
        }


        if (items == null || items.isEmpty()) {

            throw new IllegalArgumentException(
                    "At least one sale item is required."
            );
        }


        // =========================
        // FIND CUSTOMER
        // =========================

        Customer customer = customerRepository
                .findById(
                        sale.getCustomer().getId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found."
                        )
                );


        sale.setCustomer(customer);


        // =========================
        // VALIDATE SALE
        // =========================

        if (sale.getSaleNumber() == null ||
                sale.getSaleNumber().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Sale number is required."
            );
        }


        if (sale.getSaleDate() == null) {

            throw new IllegalArgumentException(
                    "Sale date is required."
            );
        }


        double totalAmount = 0.0;


        // =========================
        // SAVE SALE
        // =========================

        sale.setTotalAmount(0.0);

        Sale savedSale =
                saleRepository.save(sale);


        // =========================
        // PROCESS SALE ITEMS
        // =========================

        for (SaleItem item : items) {

            if (item.getProduct() == null ||
                    item.getProduct().getId() == null) {

                throw new IllegalArgumentException(
                        "Product is required for every sale item."
                );
            }


            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Sale quantity must be greater than zero."
                );
            }


            if (item.getRate() == null ||
                    item.getRate() < 0) {

                throw new IllegalArgumentException(
                        "Sale rate cannot be negative."
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
            // GET CURRENT STOCK
            // =========================

            double currentStock =
                    product.getCurrentStock() == null
                            ? 0.0
                            : product.getCurrentStock();


            // =========================
            // STOCK VALIDATION
            // =========================

            if (item.getQuantity() > currentStock) {

                throw new IllegalArgumentException(
                        "Out of stock."
                );
            }


            // =========================
            // CALCULATE ITEM TOTAL
            // =========================

            double itemTotal =
                    item.getQuantity()
                            * item.getRate();


            item.setTotal(itemTotal);

            item.setSale(savedSale);

            item.setProduct(product);


            // =========================
            // SAVE SALE ITEM
            // =========================

            saleItemRepository.save(item);


            // =========================
            // DECREASE STOCK
            // =========================

            double newStock =
                    currentStock - item.getQuantity();


            product.setCurrentStock(newStock);

            productRepository.save(product);


            // =========================
            // CREATE STOCK MOVEMENT
            // =========================

            stockMovementService.createMovement(
                    product,
                    "SALE",
                    item.getQuantity(),
                    newStock,
                    "Stock sold to customer"
            );


            // =========================
            // CHECK LOW STOCK
            // =========================

            notificationService.checkLowStockAfterStockChange(
                    product,
                    currentStock
            );


            // =========================
            // ADD TO SALE TOTAL
            // =========================

            totalAmount += itemTotal;
        }


        // =========================
        // UPDATE SALE TOTAL
        // =========================

        savedSale.setTotalAmount(
                totalAmount
        );


        return saleRepository.save(
                savedSale
        );
    }
}