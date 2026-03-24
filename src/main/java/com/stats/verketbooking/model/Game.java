package com.stats.verketbooking.model;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @Setter
    @Column(name = "is_active")
    private Boolean isActive;

    @Setter
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public Game() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

}