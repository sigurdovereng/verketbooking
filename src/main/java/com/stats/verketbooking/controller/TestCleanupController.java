package com.stats.verketbooking.controller;

import com.stats.verketbooking.service.GdprCleanupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestCleanupController {

    private final GdprCleanupService cleanupService;

    public TestCleanupController(GdprCleanupService cleanupService) {
        this.cleanupService = cleanupService;
    }

    @GetMapping("/test-cleanup")
    public String runCleanup() {
        cleanupService.removePhoneNumbersAtClosingTime();
        return "Cleanup triggered!";
    }
}