package com.example.stockflowapi.repository;

import com.example.stockflowapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {
}