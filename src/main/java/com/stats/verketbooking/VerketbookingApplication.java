package com.stats.verketbooking;

import com.stats.verketbooking.model.AdminUser;
import com.stats.verketbooking.repository.AdminUserRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.OffsetDateTime;

@EnableScheduling
@SpringBootApplication
public class VerketbookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(VerketbookingApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(
			AdminUserRepo repo,
			PasswordEncoder passwordEncoder,
			@Value("${admin.username}") String adminUsername,
			@Value("${admin.password}") String adminPassword
	) {
		return args -> {
			if (repo.findByUsername(adminUsername).isEmpty()) {
				AdminUser admin = new AdminUser(
						adminUsername,
						passwordEncoder.encode(adminPassword),
						OffsetDateTime.now()
				);
				repo.save(admin);
				System.out.println("Admin-bruker opprettet: " + adminUsername);
			}
		};
	}

}

