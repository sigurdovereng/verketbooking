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

    public Reservation save(Reservation reservation) {
        return reservationRepo.save(reservation);
    }

    public void delete(Long id) {
        reservationRepo.deleteById(id);
    }
}