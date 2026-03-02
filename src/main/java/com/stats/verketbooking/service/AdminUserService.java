package com.stats.verketbooking.service;

import com.stats.verketbooking.model.AdminUser;
import com.stats.verketbooking.repository.AdminUserRepo;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService implements UserDetailsService {

    private final AdminUserRepo repo;

    public AdminUserService(AdminUserRepo repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        return User.withUsername(user.getUsername())
                .password(user.getPasswordHash()) // BCrypt hash fra DB
                .roles("ADMIN")
                .build();
    }
}
