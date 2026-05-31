package com.stats.verketbooking.service;

import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.repository.GameRepo;
import com.stats.verketbooking.repository.ReservationRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class GameService {

    private final GameRepo gameRepo;
    private final ReservationRepo reservationRepo;

    public GameService(GameRepo gameRepo, ReservationRepo reservationRepo) {
        this.gameRepo = gameRepo;
        this.reservationRepo = reservationRepo;
    }

    public List<Game> getAllGames() {
        return gameRepo.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Game not found: " + id));
    }

    public Game createGame(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Game name cannot be empty");
        }

        String trimmedName = name.trim();

        if (gameRepo.existsByName(trimmedName)) {
            throw new IllegalArgumentException("Game already exists: " + trimmedName);
        }

        Game game = new Game(trimmedName);
        return gameRepo.save(game);
    }

    public Game setActive(Long id, boolean active) {
        Game game = getGameById(id);
        game.setActive(active);
        return gameRepo.save(game);
    }

    @Transactional
    public void deleteGame(Long id) {
        if (!gameRepo.existsById(id)) {
            throw new IllegalArgumentException("Game not found: " + id);
        }
        if (reservationRepo.existsByGameIdAndEndsAtAfter(id, OffsetDateTime.now())) {
            throw new IllegalStateException("Kan ikke slette spill med aktive eller kommende reservasjoner");
        }
        reservationRepo.deleteByGameId(id);
        gameRepo.deleteById(id);
    }
}