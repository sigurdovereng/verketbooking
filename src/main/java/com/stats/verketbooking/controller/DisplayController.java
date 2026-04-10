package com.stats.verketbooking.controller;

import com.stats.verketbooking.dto.DisplayQueueResponseDto;
import com.stats.verketbooking.service.DisplayService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/display")
public class DisplayController {

    private final DisplayService displayService;

    public DisplayController(DisplayService displayService) {
        this.displayService = displayService;
    }

    @GetMapping("/queue")
    public DisplayQueueResponseDto getQueueDisplay() {
        return displayService.getQueueDisplay();
    }
}
