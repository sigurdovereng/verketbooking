package com.stats.verketbooking.controller;

import com.stats.verketbooking.dto.ReservationDto;
import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.service.GameService;
import com.stats.verketbooking.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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

        Game game = gameService.getById(dto.getGameId());

        Reservation reservation = new Reservation(
                dto.getName(),
                dto.getPhoneNumber(),
                dto.getStatus(),
                game,
                dto.getStartedAt(),
                dto.getEndsAt()
        );

        return reservationService.save(reservation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reservationService.delete(id);
    }
}