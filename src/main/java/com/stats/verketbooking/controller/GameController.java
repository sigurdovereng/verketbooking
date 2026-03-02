package com.stats.verketbooking.controller;

import com.stats.verketbooking.dto.GameCreateDto;
import com.stats.verketbooking.model.Game;
import com.stats.verketbooking.service.GameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<Game> getAll() {
        return gameService.getAllGames();
    }

    @PostMapping
    public Game create(@Valid @RequestBody GameCreateDto dto) {
        return gameService.createGame(dto.name());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gameService.deleteGame(id);
    }
}