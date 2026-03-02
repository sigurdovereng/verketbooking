package com.stats.verketbooking.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "queue_entry")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    // DB-type er queue_status, men vi bruker String (ingen enum)
    @Column(nullable = false, columnDefinition = "queue_status")
    private String status;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Column(name = "ends_at")
    private OffsetDateTime endsAt;

    @Column(name = "next_up_sms_sent_at")
    private OffsetDateTime nextUpSmsSentAt;

    @Column(name = "ending_soon_sms_sent_at")
    private OffsetDateTime endingSoonSmsSentAt;

    protected Reservation() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getStatus() { return status; }
    public Long getGameId() { return gameId; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getEndsAt() { return endsAt; }
    public OffsetDateTime getNextUpSmsSentAt() { return nextUpSmsSentAt; }
    public OffsetDateTime getEndingSoonSmsSentAt() { return endingSoonSmsSentAt; }
}