package com.stats.verketbooking.service;

import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.repository.ReservationRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepo reservationRepo;

    public ReservationService(ReservationRepo reservationRepo) {
        this.reservationRepo = reservationRepo;
    }

    public List<Reservation> getAll() {
        return reservationRepo.findAll();
    }

    public Reservation getById(Long id) {
        return reservationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + id));
    }

    public Reservation save(Reservation reservation) {
        boolean overlaps = reservationRepo.existsByGameAndStartedAtBeforeAndEndsAtAfter(
                reservation.getGame(),
                reservation.getEndsAt(),
                reservation.getStartedAt()
        );
        if (overlaps) {
            throw new IllegalStateException("Tidspunktet er allerede opptatt for dette bordet.");
        }
        return reservationRepo.save(reservation);
    }

    public void delete(Long id) {
        reservationRepo.deleteById(id);
    }
}