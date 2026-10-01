package com.example.stockflowapi.controller;

import com.example.stockflowapi.dto.DashboardResponse;
import com.example.stockflowapi.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardRestController {

    private final DashboardService dashboardService;

    public DashboardRestController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }


    // =========================
    // GET DASHBOARD DATA
    // =========================

    @GetMapping
    public DashboardResponse getDashboardData() {

        return dashboardService.getDashboardData();
    }
}