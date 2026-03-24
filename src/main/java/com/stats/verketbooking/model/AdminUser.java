package com.stats.verketbooking.model;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String username;

    @Setter
    @Column(name = "password_hash")
    private String passwordHash;

    @Setter
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public AdminUser() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

}