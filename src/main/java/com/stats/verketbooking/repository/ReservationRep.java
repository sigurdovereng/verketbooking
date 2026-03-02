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
        update QueEntry q
        set q.phoneNumber = null
        where q.phoneNumber is not null
          and q.status in ('DONE', 'NO_SHOW', 'CANCELLED')
          and (q.endsAt is null or q.endsAt < CURRENT_TIMESTAMP)
    """)
    int removePhoneNumbersForFinishedEntries();
}
