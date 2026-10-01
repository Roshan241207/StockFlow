package com.example.stockflowapi.dto;

import com.example.stockflowapi.entity.Product;
import com.example.stockflowapi.entity.StockMovement;

import java.util.List;

public class DashboardResponse {

    private long totalProducts;

    private long lowStockCount;

    private List<Product> lowStockProducts;

    private double totalStock;

    private double stockValue;

    private List<StockMovement> recentMovements;


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }


    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }


    public List<Product> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(
            List<Product> lowStockProducts) {

        this.lowStockProducts = lowStockProducts;
    }


    public double getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(double totalStock) {
        this.totalStock = totalStock;
    }


    public double getStockValue() {
        return stockValue;
    }

    public void setStockValue(double stockValue) {
        this.stockValue = stockValue;
    }


    public List<StockMovement> getRecentMovements() {
        return recentMovements;
    }

    public void setRecentMovements(
            List<StockMovement> recentMovements) {

        this.recentMovements = recentMovements;
    }
}