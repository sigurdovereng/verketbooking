package com.stats.verketbooking.service;

import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.repository.GameRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepo gameRepo;

    public GameService(GameRepo gameRepo) {
        this.gameRepo = gameRepo;
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

    public void deleteGame(Long id) {
        if (!gameRepo.existsById(id)) {
            throw new IllegalArgumentException("Game not found: " + id);
        }
        gameRepo.deleteById(id);
    }
}