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
        Twilio.init(accountSid, authToken);
        System.out.println("Twilio initialized");
    }

    public String sendSms(String toNumber, String body) {
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
}