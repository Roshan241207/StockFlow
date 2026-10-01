package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
}