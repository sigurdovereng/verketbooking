package com.stats.verketbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Setter
@Getter
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

}