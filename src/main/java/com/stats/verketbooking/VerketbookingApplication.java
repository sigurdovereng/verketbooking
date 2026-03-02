package com.stats.verketbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class VerketbookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(VerketbookingApplication.class, args);
	}
}

