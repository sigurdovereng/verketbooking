package com.stats.verketbooking.controller;

import com.stats.verketbooking.dto.ReservationDto;
import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.service.GameService;
import com.stats.verketbooking.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final GameService gameService;

    public ReservationController(ReservationService reservationService,
                                 GameService gameService) {
        this.reservationService = reservationService;
        this.gameService = gameService;
    }

    @GetMapping
    public List<Reservation> getAll() {
        return reservationService.getAll();
    }

    @PostMapping
    public Reservation create(@Valid @RequestBody ReservationDto dto) {

        Game game = gameService.getGameById(dto.getGameId());

        Reservation reservation = new Reservation(
                dto.getName(),
                dto.getPhoneNumber(),
                "NEXT_UP",
                game,
                dto.getStartedAt(),
                dto.getEndsAt()
        );

        try {
            Reservation saved = reservationService.save(reservation);
            gameService.setActive(game.getId(), true);
            return saved;
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Reservation reservation = reservationService.getById(id);
        reservationService.delete(id);
        gameService.setActive(reservation.getGame().getId(), false);
    }
}