package com.stats.verketbooking.service;

import com.stats.verketbooking.model.AdminUser;
import com.stats.verketbooking.repository.AdminUserRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class AdminUserService implements UserDetailsService {

    private final AdminUserRepo repo;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminUserService(
            AdminUserRepo repo,
            PasswordEncoder passwordEncoder
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initializeAdmin() {

        String passwordHash = passwordEncoder.encode(adminPassword);

        AdminUser admin = repo.findByUsername(adminUsername)
                .orElse(null);

        if (admin == null) {
            admin = new AdminUser(
                    adminUsername,
                    passwordHash,
                    OffsetDateTime.now()
            );
        } else {
            admin.updatePasswordHash(passwordHash);
        }

        repo.save(admin);

        System.out.println("Admin user initialized/updated.");
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        AdminUser user = repo.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin not found")
                );

        return User.withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .roles("ADMIN")
                .build();
    }
}