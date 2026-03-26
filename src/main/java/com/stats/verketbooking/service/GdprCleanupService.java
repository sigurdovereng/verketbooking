// Dette skal slette telefon nummer for GDPR regler

package com.stats.verketbooking.service;

import com.stats.verketbooking.repository.ReservationRep;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class GdprCleanupService {

    private final ReservationRep reservationRep;

    public GdprCleanupService(ReservationRep reservationRep) {
        this.reservationRep = reservationRep;
    }

    // Kjøre denne hver dag klokka 04:00 Oslo-tid
    @Scheduled(cron = "0 0 4 * * *", zone = "Europe/Oslo")
    public void removePhoneNumbersAtClosingTime() {
        int updated = reservationRep.removePhoneNumbersForFinishedEntries();
        System.out.println("[GDPR Cleanup] Removed phone numbers from " + updated + " finished queue entries.");
    }
}