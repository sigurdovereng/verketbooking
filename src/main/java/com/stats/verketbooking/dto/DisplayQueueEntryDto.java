package com.stats.verketbooking.dto;

import java.time.OffsetDateTime;

public record DisplayQueueEntryDto(
        Long id,
        Long gameId,
        String name,
        String gameName,
        String status,
        OffsetDateTime startTime,
        OffsetDateTime endTime,
        Integer queuePosition
) {}
