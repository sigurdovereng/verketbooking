package com.stats.verketbooking.repository;

import com.stats.verketbooking.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepo extends JpaRepository<Game, Long> {

    Optional<Game> findByName(String name);

    boolean existsByName(String name);
}