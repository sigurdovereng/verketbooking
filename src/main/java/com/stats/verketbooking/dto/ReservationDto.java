package com.stats.verketbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public class ReservationDto {

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    @NotBlank
    private String status;

    @NotNull
    private Long gameId;

    private OffsetDateTime startedAt;

    private OffsetDateTime endsAt;

    public ReservationDto() {}

    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getStatus() { return status; }
    public Long getGameId() { return gameId; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getEndsAt() { return endsAt; }

    public void setName(String name) { this.name = name; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setStatus(String status) { this.status = status; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }
    public void setEndsAt(OffsetDateTime endsAt) { this.endsAt = endsAt; }
}