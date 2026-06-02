package com.stats.verketbooking.dto;

import jakarta.validation.constraints.NotBlank;

public record GameRenameDto(
        @NotBlank String name
) {}
