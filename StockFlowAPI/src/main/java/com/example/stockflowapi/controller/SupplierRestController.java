package com.example.stockflowapi.controller;

import com.example.stockflowapi.entity.Supplier;
import com.example.stockflowapi.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierRestController {

    private final SupplierService supplierService;

    public SupplierRestController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }


    // =========================
    // GET ALL SUPPLIERS
    // =========================

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }


    // =========================
    // GET SUPPLIER BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(
            @PathVariable Long id) {

        return supplierService.getSupplierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // CREATE SUPPLIER
    // =========================

    @PostMapping
    public ResponseEntity<?> createSupplier(
            @RequestBody Supplier supplier) {

        String validationMessage = validateSupplier(supplier);

        if (validationMessage != null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            validationMessage
                    ));
        }


        if (supplier.getStatus() == null ||
                supplier.getStatus().trim().isEmpty()) {

            supplier.setStatus("ACTIVE");
        }


        Supplier savedSupplier =
                supplierService.saveSupplier(supplier);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedSupplier);
    }


    // =========================
    // UPDATE SUPPLIER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier) {


        String validationMessage =
                validateSupplier(supplier);


        if (validationMessage != null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            validationMessage
                    ));
        }


        return supplierService.getSupplierById(id)
                .map(existingSupplier -> {

                    existingSupplier.setSupplierCode(
                            supplier.getSupplierCode()
                    );

                    existingSupplier.setSupplierName(
                            supplier.getSupplierName()
                    );

                    existingSupplier.setContactPerson(
                            supplier.getContactPerson()
                    );

                    existingSupplier.setPhone(
                            supplier.getPhone()
                    );

                    existingSupplier.setEmail(
                            supplier.getEmail()
                    );

                    existingSupplier.setAddress(
                            supplier.getAddress()
                    );

                    existingSupplier.setStatus(
                            supplier.getStatus()
                    );


                    if (existingSupplier.getStatus() == null ||
                            existingSupplier.getStatus()
                                    .trim()
                                    .isEmpty()) {

                        existingSupplier.setStatus("ACTIVE");
                    }


                    return ResponseEntity.ok(
                            supplierService.saveSupplier(
                                    existingSupplier
                            )
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // DELETE SUPPLIER
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(
            @PathVariable Long id) {

        if (supplierService.getSupplierById(id).isEmpty()) {

            return ResponseEntity.notFound().build();
        }


        supplierService.deleteSupplier(id);


        return ResponseEntity.noContent().build();
    }


    // =========================
    // VALIDATION
    // =========================

    private String validateSupplier(Supplier supplier) {

        if (supplier.getSupplierCode() == null ||
                supplier.getSupplierCode().trim().isEmpty()) {

            return "Supplier code is required.";
        }


        if (supplier.getSupplierName() == null ||
                supplier.getSupplierName().trim().isEmpty()) {

            return "Supplier name is required.";
        }


        if (supplier.getPhone() == null ||
                !supplier.getPhone().matches("\\d{10}")) {

            return "Phone number must contain exactly 10 digits.";
        }


        if (supplier.getEmail() == null ||
                supplier.getEmail().trim().isEmpty()) {

            return "Gmail address is required.";
        }


        String gmailPattern =
                "^[A-Za-z0-9._%+-]+@gmail\\.com$";


        if (!supplier.getEmail().matches(gmailPattern)) {

            return "Please enter a valid Gmail address.";
        }


        return null;
    }
}