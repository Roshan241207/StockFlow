package com.example.stockflowapi.controller;

import com.example.stockflowapi.entity.Customer;
import com.example.stockflowapi.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerRestController {

    private final CustomerService customerService;

    public CustomerRestController(CustomerService customerService) {
        this.customerService = customerService;
    }


    // =========================
    // GET ALL CUSTOMERS
    // =========================

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }


    // =========================
    // GET CUSTOMER BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @PathVariable Long id) {

        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // CREATE CUSTOMER
    // =========================

    @PostMapping
    public ResponseEntity<?> createCustomer(
            @RequestBody Customer customer) {

        String validationMessage =
                validateCustomer(customer);

        if (validationMessage != null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            validationMessage
                    ));
        }

        if (customer.getStatus() == null ||
                customer.getStatus().trim().isEmpty()) {

            customer.setStatus("ACTIVE");
        }

        Customer savedCustomer =
                customerService.saveCustomer(customer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCustomer);
    }


    // =========================
    // UPDATE CUSTOMER
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {

        String validationMessage =
                validateCustomer(customer);

        if (validationMessage != null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            validationMessage
                    ));
        }

        return customerService.getCustomerById(id)
                .map(existingCustomer -> {

                    existingCustomer.setCustomerCode(
                            customer.getCustomerCode()
                    );

                    existingCustomer.setCustomerName(
                            customer.getCustomerName()
                    );

                    existingCustomer.setContactPerson(
                            customer.getContactPerson()
                    );

                    existingCustomer.setPhone(
                            customer.getPhone()
                    );

                    existingCustomer.setEmail(
                            customer.getEmail()
                    );

                    existingCustomer.setAddress(
                            customer.getAddress()
                    );

                    existingCustomer.setStatus(
                            customer.getStatus()
                    );

                    if (existingCustomer.getStatus() == null ||
                            existingCustomer.getStatus()
                                    .trim()
                                    .isEmpty()) {

                        existingCustomer.setStatus("ACTIVE");
                    }

                    return ResponseEntity.ok(
                            customerService.saveCustomer(
                                    existingCustomer
                            )
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // DELETE CUSTOMER
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id) {

        if (customerService.getCustomerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        customerService.deleteCustomer(id);

        return ResponseEntity.noContent().build();
    }


    // =========================
    // VALIDATION
    // =========================

    private String validateCustomer(Customer customer) {

        if (customer.getCustomerCode() == null ||
                customer.getCustomerCode().trim().isEmpty()) {

            return "Customer code is required.";
        }

        if (customer.getCustomerName() == null ||
                customer.getCustomerName().trim().isEmpty()) {

            return "Customer name is required.";
        }

        if (customer.getPhone() == null ||
                !customer.getPhone().matches("\\d{10}")) {

            return "Phone number must contain exactly 10 digits.";
        }

        if (customer.getEmail() == null ||
                customer.getEmail().trim().isEmpty()) {

            return "Gmail address is required.";
        }

        String gmailPattern =
                "^[A-Za-z0-9._%+-]+@gmail\\.com$";

        if (!customer.getEmail().matches(gmailPattern)) {

            return "Please enter a valid Gmail address.";
        }

        return null;
    }
}