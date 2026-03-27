package com.stats.verketbooking.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.from-number}")
    private String fromNumber;

    public String sendSms(String toNumber, String body) {
        Message message = Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                body
        ).create();

        return message.getSid();
    }

    public String sendNextUpSms(String toNumber, String guestName, String gameName) {
        String body = "Hi " + guestName + "! Your turn for " + gameName + " starts in about 5 minutes.";
        return sendSms(toNumber, body);
    }

    public String sendEndingSoonSms(String toNumber, String guestName, String gameName) {
        String body = "Hi " + guestName + "! Your turn for " + gameName + " ends in about 5 minutes.";
        return sendSms(toNumber, body);
    }
}