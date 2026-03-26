package com.stats.verketbooking.repository;

import com.stats.verketbooking.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


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

    @Query(value = """
    SELECT *
    FROM reservation
    WHERE status = 'NEXT_UP'
      AND phone_number IS NOT NULL
      AND next_up_sms_sent_at IS NULL
      AND started_at IS NOT NULL
      AND started_at <= CURRENT_TIMESTAMP + INTERVAL '5 minutes'
      AND started_at > CURRENT_TIMESTAMP
    """, nativeQuery = true)
    List<Reservation> findReservationsNeedingNextUpSms();

    @Query(value = """
    SELECT *
    FROM reservation
    WHERE status = 'PLAYING'
      AND phone_number IS NOT NULL
      AND ending_soon_sms_sent_at IS NULL
      AND ends_at IS NOT NULL
      AND ends_at <= CURRENT_TIMESTAMP + INTERVAL '5 minutes'
      AND ends_at > CURRENT_TIMESTAMP
    """, nativeQuery = true)
    List<Reservation> findReservationsNeedingEndingSoonSms();

}

