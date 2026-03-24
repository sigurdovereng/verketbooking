package com.stats.verketbooking.repository;

import com.stats.verketbooking.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ReservationRep extends JpaRepository<Reservation, Long> {

    @Modifying
    @Transactional
    @Query("""
        update Reservation r
        set r.phoneNumber = null
        where r.phoneNumber is not null
        and r.status in ('DONE', 'NO_SHOW', 'CANCELLED')
        and (r.endsAt is null or r.endsAt < CURRENT_TIMESTAMP)
    """)
    int removePhoneNumbersForFinishedEntries();
}