package com.stats.verketbooking.model;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "queue_entry")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @Setter
    @Column(name = "phone_number")
    private String phoneNumber;

    @Setter
    private String status;

    @Setter
    @Column(name = "game_id")
    private Long gameId;

    @Setter
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Setter
    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Setter
    @Column(name = "ends_at")
    private OffsetDateTime endsAt;

    @Setter
    @Column(name = "next_up_sms_sent_at")
    private OffsetDateTime nextUpSmsSentAt;

    @Setter
    @Column(name = "ending_soon_sms_sent_at")
    private OffsetDateTime endingSoonSmsSentAt;

    public Reservation() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getStatus() {
        return status;
    }

    public Long getGameId() {
        return gameId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public OffsetDateTime getEndsAt() {
        return endsAt;
    }

    public OffsetDateTime getNextUpSmsSentAt() {
        return nextUpSmsSentAt;
    }

    public OffsetDateTime getEndingSoonSmsSentAt() {
        return endingSoonSmsSentAt;
    }

}