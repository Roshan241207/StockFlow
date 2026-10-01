package com.example.stockflowapi.controller;

import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductRestController {

    private final ProductService productService;

    public ProductRestController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {

        if (product.getCurrentStock() == null) {
            product.setCurrentStock(0.0);
        }

        if (product.getStatus() == null || product.getStatus().trim().isEmpty()) {
            product.setStatus("ACTIVE");
        }

        return ResponseEntity.ok(productService.saveProduct(product));
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return productService.getProductById(id)
                .map(existingProduct -> {

                    existingProduct.setProductCode(product.getProductCode());
                    existingProduct.setProductName(product.getProductName());
                    existingProduct.setMaterialType(product.getMaterialType());
                    existingProduct.setAlloyGrade(product.getAlloyGrade());

                    existingProduct.setLength(product.getLength());
                    existingProduct.setWidth(product.getWidth());
                    existingProduct.setThickness(product.getThickness());

                    existingProduct.setUnit(product.getUnit());
                    existingProduct.setWeightPerUnit(product.getWeightPerUnit());

                    existingProduct.setCurrentStock(product.getCurrentStock());
                    existingProduct.setMinimumStock(product.getMinimumStock());

                    existingProduct.setPurchasePrice(product.getPurchasePrice());
                    existingProduct.setSellingPrice(product.getSellingPrice());

                    existingProduct.setWarehouseLocation(product.getWarehouseLocation());
                    existingProduct.setStatus(product.getStatus());

                    existingProduct.setCategory(product.getCategory());

                    return ResponseEntity.ok(
                            productService.saveProduct(existingProduct)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

        if (productService.getProductById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();
    }
}