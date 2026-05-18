package com.stats.verketbooking.service;

import com.stats.verketbooking.dto.DisplayQueueEntryDto;
import com.stats.verketbooking.dto.DisplayQueueResponseDto;
import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.repository.ReservationRepo;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.IntStream;

@Service
public class DisplayService {

    private static final Set<String> HIDDEN_STATUSES = Set.of("DONE", "NO_SHOW", "CANCELLED");

    private final ReservationRepo reservationRepo;

    public DisplayService(ReservationRepo reservationRepo) {
        this.reservationRepo = reservationRepo;
    }

    public DisplayQueueResponseDto getQueueDisplay() {
        OffsetDateTime now = OffsetDateTime.now();

        List<Reservation> reservations = reservationRepo.findByEndsAtGreaterThanEqualOrderByStartedAtAsc(now).stream()
                .filter(this::hasDisplayData)
                .filter(this::isVisibleOnDisplay)
                .toList();

        List<DisplayQueueEntryDto> activeGames = reservations.stream()
                .filter(reservation -> isActive(reservation, now))
                .sorted(Comparator.comparing(Reservation::getEndsAt)
                        .thenComparing(Reservation::getStartedAt)
                        .thenComparing(Reservation::getId))
                .map(reservation -> toEntry(reservation, "PLAYING", null))
                .toList();

        List<Reservation> waitingReservations = reservations.stream()
                .filter(reservation -> isWaiting(reservation, now))
                .sorted(Comparator.comparing(Reservation::getStartedAt)
                        .thenComparing(this::createdAtOrStartedAt)
                        .thenComparing(Reservation::getId))
                .toList();

        List<DisplayQueueEntryDto> waitingQueue = IntStream.range(0, waitingReservations.size())
                .mapToObj(index -> toEntry(waitingReservations.get(index), "NEXT_UP", index + 1))
                .toList();

        return new DisplayQueueResponseDto(activeGames, waitingQueue);
    }

    private boolean hasDisplayData(Reservation reservation) {
        return reservation.getGame() != null
                && reservation.getStartedAt() != null
                && reservation.getEndsAt() != null;
    }

    private boolean isVisibleOnDisplay(Reservation reservation) {
        String status = reservation.getStatus();
        if (status == null) {
            return true;
        }

        return !HIDDEN_STATUSES.contains(status.toUpperCase(Locale.ROOT));
    }

    private boolean isActive(Reservation reservation, OffsetDateTime now) {
        return !reservation.getStartedAt().isAfter(now) && !reservation.getEndsAt().isBefore(now);
    }

    private boolean isWaiting(Reservation reservation, OffsetDateTime now) {
        return reservation.getStartedAt().isAfter(now);
    }

    private OffsetDateTime createdAtOrStartedAt(Reservation reservation) {
        return reservation.getCreatedAt() != null ? reservation.getCreatedAt() : reservation.getStartedAt();
    }

    private DisplayQueueEntryDto toEntry(Reservation reservation, String status, Integer queuePosition) {
        return new DisplayQueueEntryDto(
                reservation.getId(),
                reservation.getGame().getId(),
                reservation.getName(),
                reservation.getGame().getName(),
                status,
                reservation.getStartedAt(),
                reservation.getEndsAt(),
                queuePosition
        );
    }
}
