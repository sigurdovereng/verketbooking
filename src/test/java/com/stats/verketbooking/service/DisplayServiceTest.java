package com.stats.verketbooking.service;

import com.stats.verketbooking.dto.DisplayQueueResponseDto;
import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.repository.ReservationRepo;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class DisplayServiceTest {

    @Test
    void getQueueDisplaySeparatesActiveAndWaitingReservations() {
        OffsetDateTime now = OffsetDateTime.now();

        Game shuffleboard = new Game("Shuffleboard 1");
        shuffleboard.setId(10L);

        Reservation activeReservation = new Reservation(
                "Marius",
                "+4711111111",
                "NEXT_UP",
                shuffleboard,
                now.minusMinutes(15),
                now.plusMinutes(45)
        );
        activeReservation.setId(1L);
        activeReservation.setCreatedAt(now.minusMinutes(20));

        Reservation waitingReservation = new Reservation(
                "Emma",
                "+4722222222",
                "NEXT_UP",
                shuffleboard,
                now.plusMinutes(15),
                now.plusMinutes(75)
        );
        waitingReservation.setId(2L);
        waitingReservation.setCreatedAt(now.minusMinutes(10));

        Reservation cancelledReservation = new Reservation(
                "Skjult",
                "+4733333333",
                "CANCELLED",
                shuffleboard,
                now.plusMinutes(30),
                now.plusMinutes(90)
        );
        cancelledReservation.setId(3L);
        cancelledReservation.setCreatedAt(now.minusMinutes(5));

        ReservationRepo reservationRepo = reservationRepoReturning(
                List.of(activeReservation, waitingReservation, cancelledReservation)
        );
        DisplayService displayService = new DisplayService(reservationRepo);

        DisplayQueueResponseDto response = displayService.getQueueDisplay();

        assertEquals(1, response.activeGames().size());
        assertEquals(1L, response.activeGames().get(0).id());
        assertEquals("PLAYING", response.activeGames().get(0).status());
        assertNull(response.activeGames().get(0).queuePosition());

        assertEquals(1, response.waitingQueue().size());
        assertEquals(2L, response.waitingQueue().get(0).id());
        assertEquals("NEXT_UP", response.waitingQueue().get(0).status());
        assertEquals(1, response.waitingQueue().get(0).queuePosition());
    }

    private ReservationRepo reservationRepoReturning(List<Reservation> reservations) {
        return (ReservationRepo) Proxy.newProxyInstance(
                ReservationRepo.class.getClassLoader(),
                new Class[]{ReservationRepo.class},
                (proxy, method, args) -> {
                    if ("findByEndsAtGreaterThanEqualOrderByStartedAtAsc".equals(method.getName())) {
                        return reservations;
                    }

                    throw new UnsupportedOperationException("Unexpected repository method: " + method.getName());
                }
        );
    }
}
