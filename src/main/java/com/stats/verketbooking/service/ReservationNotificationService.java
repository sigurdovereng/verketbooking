package com.stats.verketbooking.service;

import com.stats.verketbooking.model.Reservation;
import com.stats.verketbooking.repository.ReservationRep;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ReservationNotificationService {

    private final ReservationRep reservationRep;
    private final SmsService smsService;

    public ReservationNotificationService(ReservationRep reservationRep, SmsService smsService) {
        this.reservationRep = reservationRep;
        this.smsService = smsService;
    }

    @Scheduled(fixedRate = 60000) // every 60 seconds
    public void sendScheduledNotifications() {
        sendNextUpNotifications();
        sendEndingSoonNotifications();
    }

    public void sendNextUpNotifications() {
        List<Reservation> reservations = reservationRep.findReservationsNeedingNextUpSms();

        for (Reservation reservation : reservations) {
            try {
                String sid = smsService.sendSms(
                        reservation.getPhoneNumber(),
                        "Hi " + reservation.getName() + "! Your game starts in about 5 minutes."
                );

                reservation.setNextUpSmsSentAt(OffsetDateTime.now());
                reservationRep.save(reservation);

                System.out.println("Next-up SMS sent to reservation " + reservation.getId() + ", SID: " + sid);
            } catch (Exception e) {
                System.out.println("Failed to send next-up SMS for reservation " + reservation.getId());
                e.printStackTrace();
            }
        }
    }

    public void sendEndingSoonNotifications() {
        List<Reservation> reservations = reservationRep.findReservationsNeedingEndingSoonSms();

        for (Reservation reservation : reservations) {
            try {
                String sid = smsService.sendSms(
                        reservation.getPhoneNumber(),
                        "Hi " + reservation.getName() + "! You have about 5 minutes left of your game."
                );

                reservation.setEndingSoonSmsSentAt(OffsetDateTime.now());
                reservationRep.save(reservation);

                System.out.println("Ending-soon SMS sent to reservation " + reservation.getId() + ", SID: " + sid);
            } catch (Exception e) {
                System.out.println("Failed to send ending-soon SMS for reservation " + reservation.getId());
                e.printStackTrace();
            }
        }
    }
}