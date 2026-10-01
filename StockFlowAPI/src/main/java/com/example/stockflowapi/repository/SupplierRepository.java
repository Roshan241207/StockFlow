package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}