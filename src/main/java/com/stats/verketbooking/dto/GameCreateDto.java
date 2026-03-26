package com.stats.verketbooking.dto;

import jakarta.validation.constraints.NotBlank;

public record GameCreateDto(
        @NotBlank String name
) {}