package com.stats.verketbooking.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected Game() {}

    public Game(String name) {
        this.name = name;
        this.isActive = false;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public boolean isActive() { return isActive; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setActive(boolean active) { this.isActive = active; }
}