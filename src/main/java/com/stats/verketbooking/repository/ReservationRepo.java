package com.stats.verketbooking.repository;

import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface ReservationRepo extends JpaRepository<Reservation, Long> {

    // Alle reservasjoner for et bestemt game
    List<Reservation> findByGame(Game game);

    // Alle reservasjoner for et game etter et tidspunkt
    List<Reservation> findByGameAndEndsAtAfter(Game game, OffsetDateTime now);

    // Sjekk om et game er i bruk akkurat nå
    boolean existsByGameAndStartedAtBeforeAndEndsAtAfter(
            Game game,
            OffsetDateTime now1,
            OffsetDateTime now2
    );

    // Alle aktive reservasjoner (started men ikke sluttet)
    List<Reservation> findByStartedAtIsNotNullAndEndsAtIsNull();
}