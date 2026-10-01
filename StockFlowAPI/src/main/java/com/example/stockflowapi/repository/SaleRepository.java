package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}