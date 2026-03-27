package com.stats.verketbooking.controller;

import com.stats.verketbooking.service.SmsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SmsTestController {

    private final SmsService smsService;

    public SmsTestController(SmsService smsService) {
        this.smsService = smsService;
    }

    @GetMapping("/test-sms")
    public String testSms(@RequestParam String to) {
        String sid = smsService.sendSms(to, "Test SMS from Verket Booking.");
        return "SMS sent. Twilio SID: " + sid;
    }
}