package com.stats.verketbooking.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.from-number}")
    private String fromNumber;

    @PostConstruct
    public void initTwilio() {
        if (!isConfigured()) {
            System.out.println("Twilio is not configured. SMS sending is disabled.");
            return;
        }

        Twilio.init(accountSid, authToken);
        System.out.println("Twilio initialized");
    }

    public String sendSms(String toNumber, String body) {
        if (!isConfigured()) {
            throw new IllegalStateException("Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER.");
        }

        Message message = Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                body
        ).create();

        return message.getSid();
    }

    public String sendNextUpSms(String toNumber, String guestName, String gameName) {
        String body = "Hei " + guestName + "! Det er snart din tur til " + gameName + ". Spillet starter om cirka 5 minutter. - Værket";;
        return sendSms(toNumber, body);
    }

    public String sendEndingSoonSms(String toNumber, String guestName, String gameName) {
        String body = "Hei " + guestName + "! Du har cirka 5 minutter igjen av spilletiden din, husk å levere tilbake utstyret. - Værket";
        return sendSms(toNumber, body);
    }

    private boolean isConfigured() {
        return !accountSid.isBlank() && !authToken.isBlank() && !fromNumber.isBlank();
    }
}
