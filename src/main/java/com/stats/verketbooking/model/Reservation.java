package com.stats.verketbooking.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    // Anbefalt: hold det som VARCHAR i DB for å unngå mapping-trøbbel
    @Column(nullable = false, length = 30)
    private String status;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
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

    public Reservation(String name, String phoneNumber, String status, Game game, OffsetDateTime startedAt, OffsetDateTime endsAt) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.game = game;
        this.startedAt = startedAt;
        this.endsAt = endsAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getStatus() { return status; }
    public Game getGame() { return game; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getEndsAt() { return endsAt; }
    public OffsetDateTime getNextUpSmsSentAt() { return nextUpSmsSentAt; }
    public OffsetDateTime getEndingSoonSmsSentAt() { return endingSoonSmsSentAt; }
}