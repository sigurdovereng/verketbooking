package com.stats.verketbooking.dto;

import java.util.List;

public record DisplayQueueResponseDto(
        List<DisplayQueueEntryDto> activeGames,
        List<DisplayQueueEntryDto> waitingQueue
) {}
