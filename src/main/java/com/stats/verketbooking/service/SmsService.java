package com.stats.verketbooking.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.from-number}")
    private String fromNumber;

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }

    public String sendSms(String toNumber, String body) {
        Message message = Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                body
        ).create();

        return message.getSid();
    }

}